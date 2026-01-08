import { NextResponse } from "next/server";
import AuthService from "@/services/auth.server"; // server-safe async version

export async function GET() {
  try {
    // ✅ Use async factory
    const authService = await AuthService.create();

    const session = await authService.getSession();
    return NextResponse.json(session ?? {}, { status: 200 });
  } catch (error: any) {
    console.error("Get session error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
