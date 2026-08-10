import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth/session";
import { INTERNAL_ROLES, type InternalRole } from "@/lib/auth/roles";
import type { Role } from "@/lib/auth/roles";

const PROTECTED_PREFIXES = ["/dashboard", "/crm", "/portal"];

// AUTH_SESSION_COOKIE kept in sync with lib/auth/session.ts
const SESSION_COOKIE = "bm_session";

function hubFor(session: { role: string } | null): string {
  if (!session) return "/login";
  const role = session.role as Role;
  return INTERNAL_ROLES.includes(role as InternalRole)
    ? "/crm"
    : "/portal";
}

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const session = await decrypt(req.cookies.get(SESSION_COOKIE)?.value);

  const isProtected = PROTECTED_PREFIXES.some((p) => path.startsWith(p));
  const isAuthPage = path === "/login" || path === "/register";

  if (isProtected && !session?.userId) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("next", path);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && session?.userId) {
    return NextResponse.redirect(new URL(hubFor(session), req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};