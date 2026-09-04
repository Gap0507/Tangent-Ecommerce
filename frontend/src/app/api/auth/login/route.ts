import { NextResponse } from "next/server";
import { createToken } from "@/lib/auth";
import { cookies } from "next/headers";

// Basic admin credentials for now. In a real scenario, you could use a DB Admin model or Env vars.
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@tangentdrinks.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Create JWT token
      const token = await createToken({ email, role: "admin" });

      // Set HTTP-only cookie
      const cookieStore = await cookies();
      cookieStore.set({
        name: "admin_session",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      });

      return NextResponse.json({ success: true, message: "Logged in successfully" });
    }

    return NextResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
