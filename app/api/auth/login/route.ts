import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken, COOKIE_NAME } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }

    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "Grinaldi2024!";

    if (username !== adminUsername) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Support both plain text (env var) and bcrypt hashed passwords
    let isValid = false;
    if (adminPassword.startsWith("$2")) {
      isValid = await bcrypt.compare(password, adminPassword);
    } else {
      isValid = password === adminPassword;
    }

    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await signToken({ username });

    const response = NextResponse.json({ success: true, username });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
