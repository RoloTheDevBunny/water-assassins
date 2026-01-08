import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "Missing OAuth code" }, { status: 400 });
    }

    const supabase = await createClient();

    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Error exchanging code:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const session = data.session;
    const user = data.user;

    if (!session || !user) {
      return NextResponse.json({ error: "Failed to get session or user" }, { status: 500 });
    }

    // Set Supabase cookies for the session
    const res = NextResponse.json({ user, message: "OAuth successful" }, { status: 200 });
    res.cookies.set("sb-access-token", session.access_token, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "lax",
    });
    res.cookies.set("sb-refresh-token", session.refresh_token, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "lax",
    });

    return res;
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
