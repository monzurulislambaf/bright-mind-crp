import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { decrypt, getSessionCookie } from "@/lib/auth/session";
import type { Role } from "@/lib/auth/roles";

export interface AuthUser {
  id: string;
  role: Role;
}

/**
 * Data Access Layer — verifies the session and returns the minimal user
 * identity. Redirects to /login when no valid session exists.
 */
export const getAuth = cache(async (): Promise<{ user: AuthUser } | null> => {
  const cookie = await getSessionCookie();
  const session = await decrypt(cookie);
  if (!session?.userId) {
    return null;
  }
  return { user: { id: session.userId, role: session.role as Role } };
});

export const requireAuth = cache(async (): Promise<AuthUser> => {
  const auth = await getAuth();
  if (!auth) {
    redirect("/login");
  }
  return auth.user;
});

/** Returns the current user or null without redirecting (for optional UI). */
export const currentUser = cache(async (): Promise<AuthUser | null> => {
  return (await getAuth())?.user ?? null;
});