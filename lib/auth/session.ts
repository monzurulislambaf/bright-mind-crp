import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE = "bm_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

// The secret is read lazily inside a function instead of at module scope.
// Next.js inlines statically-referenced `process.env.X` values at build time;
// reading at module scope baked SESSION_SECRET into the Turbopack build cache
// and tripped Netlify's secrets scanner. Function-scope reads stay runtime-only.
let encodedKey: Uint8Array | undefined;

function getEncodedKey(): Uint8Array {
  if (encodedKey) {
    return encodedKey;
  }
  const env = process.env;
  const secretKey = env.SESSION_SECRET;
  if (!secretKey) {
    throw new Error("SESSION_SECRET is not defined");
  }
  encodedKey = new TextEncoder().encode(secretKey);
  return encodedKey;
}

export interface SessionPayload {
  userId: string;
  role: string;
  expiresAt: Date;
}

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getEncodedKey());
}

export async function decrypt(
  session: string | undefined = ""
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(session, getEncodedKey(), {
      algorithms: ["HS256"],
    });
    return {
      userId: String(payload.userId),
      role: String(payload.role),
      expiresAt: new Date(String(payload.expiresAt)),
    };
  } catch {
    return null;
  }
}

export async function createSession(userId: string, role: string): Promise<void> {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  const session = await encrypt({ userId, role, expiresAt });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value;
}
