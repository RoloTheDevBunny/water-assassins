import { NextRequest, NextResponse } from "next/server";
import AuthService from "@/services/auth.server"; // <-- use server version

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    // ✅ Use async factory to create the request-scoped AuthService
    const authService = await AuthService.create();
    await authService.updatePassword(password);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Update password error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
