"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { User } from "@/models/User";
import { connectToDatabase } from "@/lib/db";
import { nextId } from "@/lib/ids";
import { requireAuth } from "@/lib/auth/dal";
import { hasPermission } from "@/lib/auth/permissions";
import { writeAuditLog } from "@/services/audit";
import { ALL_ROLES, type Role } from "@/lib/auth/roles";

export type UserActionState =
  | { ok: boolean; message?: string; errors?: Record<string, string[]> }
  | undefined;

const CreateUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().trim().optional().default(""),
  email: z.email("Enter a valid email"),
  phone: z.string().optional().default(""),
  role: z.enum(ALL_ROLES as unknown as [Role, ...Role[]], {
    message: "Select a valid role",
  }),
  userType: z
    .enum(["EMPLOYEE", "PARTNER", "PSYCHOLOGIST", "CLIENT"])
    .optional()
    .default("CLIENT"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128),
});

export async function createUser(
  _prev: UserActionState,
  formData: FormData
): Promise<UserActionState> {
  const user = await requireAuth();
  if (!hasPermission(user.role, "users:create")) {
    return { ok: false, message: "You do not have permission to create users." };
  }

  const parsed = CreateUserSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    role: formData.get("role"),
    userType: formData.get("userType"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the form.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  await connectToDatabase();
  const existing = await User.findOne({
    email: parsed.data.email.toLowerCase().trim(),
  }).lean();
  if (existing) {
    return { ok: false, message: "A user with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const userId = await nextId("USR");

  await User.create({
    userId,
    firstName: parsed.data.firstName.trim(),
    lastName: parsed.data.lastName,
    email: parsed.data.email.toLowerCase().trim(),
    phone: parsed.data.phone,
    role: parsed.data.role,
    userType: parsed.data.userType,
    passwordHash,
    status: "active",
  });

  await writeAuditLog({
    actor: user.id,
    actorUserId: user.id,
    action: "CREATE",
    resource: "user",
    resourceType: "USER",
    resourceId: userId,
    metadata: { role: parsed.data.role, via: "admin.console" },
  });

  revalidatePath("/crm/users");
  return { ok: true, message: `User ${userId} created.` };
}
