import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const rawSecret = process.env.JWT_SECRET;
if (!rawSecret && process.env.NODE_ENV === "production") {
  throw new Error("FATAL: JWT_SECRET environment variable is required in production mode.");
}
const JWT_SECRET = rawSecret || (process.env.NODE_ENV === "production" ? "" : "tangent_super_secret_jwt_key_development_32chars_min");
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

export async function createToken(payload: Record<string, any>) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(encodedSecret);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, encodedSecret);
    return payload;
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token) return null;
  return await verifyToken(token);
}
