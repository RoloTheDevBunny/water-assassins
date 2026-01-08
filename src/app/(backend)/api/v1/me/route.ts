export const runtime = 'nodejs';
import { NextResponse } from "next/server";
import AuthService from "@/services/auth.server"; // server-safe async

export async function GET() {
  try {
    // ✅ Use async factory to create the service
    const authService = await AuthService.create();

    const user = await authService.getUser();
    return NextResponse.json(user ?? {}, { status: 200 });
  } catch (error: any) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
