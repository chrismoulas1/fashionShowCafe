import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-in-production";
const COOKIE_NAME = "grinaldi_admin_token";
const secret = new TextEncoder().encode(JWT_SECRET);

export async function signToken(payload: { username: string }): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value || null;
}

export async function getCurrentUser() {
  const token = await getAuthToken();
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload) return null;
  return { username: payload.username as string };
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

export function getTokenFromRequest(req: NextRequest): string | null {
  return req.cookies.get(COOKIE_NAME)?.value || null;
}

export async function verifyRequestToken(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  return await verifyToken(token);
}

export { COOKIE_NAME };
