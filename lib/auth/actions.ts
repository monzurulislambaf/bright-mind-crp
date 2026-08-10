"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { User } from "@/models/User";
import { IndividualClient } from "@/models/IndividualClient";
import { connectToDatabase } from "@/lib/db";
import { createSession, deleteSession } from "@/lib/auth/session";
import { getAuth } from "@/lib/auth/dal";
import { nextId } from "@/lib/ids";
import { type Role } from "@/lib/auth/roles";
import { INTERNAL_ROLES, type InternalRole } from "@/lib/auth/roles";
import { writeAuditLog } from "@/services/audit";

const RegisterSchema = z.object({
  firstName: z.string().min(1).trim(),
  lastName: z.string().min(1).trim(),
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8),
});

export type AuthState =
  | { errors?: Record<string, string[]>; message?: string }
  | undefined;

export async function register(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const parsed = RegisterSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { firstName, lastName, email, password } = parsed.data;

  await connectToDatabase();
  const existing = await User.findOne({ email }).lean();
  if (existing) {
    return { message: "An account with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const userId = await nextId("USR");

  const user = await User.create({
    userId,
    firstName,
    lastName,
    email,
    passwordHash,
    role: "INDIVIDUAL_CLIENT" as Role,
    userType: "CLIENT",
    status: "active",
  });

  await IndividualClient.create({
    clientId: await nextId("CLI"),
    userId: user._id,
    firstName,
    lastName,
    email,
    status: "onboarding",
  });

  await writeAuditLog({
    actor: user.userId,
    actorUserId: user._id.toString(),
    action: "CREATE",
    resource: "user",
    resourceType: "USER",
    resourceId: user.userId,
    metadata: { email, event: "auth.register" },
  });

  await createSession(user._id.toString(), "INDIVIDUAL_CLIENT");
  redirect("/portal");
}

export async function login(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { message: "Email and password are required." };
  }

  await connectToDatabase();
  const user = await User.findOne({ email }).lean();
  if (!user) {
    return { message: "Invalid email or password." };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return { message: "Invalid email or password." };
  }

  await User.updateOne({ _id: user._id }, { $set: { lastLoginAt: new Date() } });

  await writeAuditLog({
    actor: user.userId,
    actorUserId: user._id.toString(),
    action: "LOGIN",
    resource: "user",
    resourceType: "USER",
    resourceId: user.userId,
  });

  await createSession(user._id.toString(), user.role);
  const internal = INTERNAL_ROLES.includes(user.role as InternalRole);
  redirect(internal ? "/crm" : "/portal");
}

export async function logout(): Promise<void> {
  const auth = await getAuth();
  if (auth) {
    await writeAuditLog({
      actor: auth.user.id,
      actorUserId: auth.user.id,
      action: "LOGOUT",
      resource: "user",
      resourceType: "USER",
    });
  }
  await deleteSession();
  redirect("/login");
}