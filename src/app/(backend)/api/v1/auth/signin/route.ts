import { NextRequest, NextResponse } from "next/server";
import AuthService from "@/services/auth.server"; // server-safe async version

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // ✅ Use the async factory
    const authService = await AuthService.create();
    const user = await authService.signIn(email, password);

    return NextResponse.json({ user }, { status: 200 });
  } catch (error: any) {
    console.error("Sign-in error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
