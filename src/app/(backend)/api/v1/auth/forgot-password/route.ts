import { NextRequest, NextResponse } from "next/server";
import AuthService from "@/services/auth.server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // ✅ Use the async factory to create the service
    const authService = await AuthService.create();
    await authService.forgotPassword(email);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
