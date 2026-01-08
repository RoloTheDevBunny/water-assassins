import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    const supabase = await createClient();

    // Exchange OAuth code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    console.log("exchangeCodeForSession data:", data);
    console.log("exchangeCodeForSession error:", error);

    // Log session info
    if (data?.session) {
      console.log("Session access_token:", data.session.access_token);
      console.log("Session refresh_token:", data.session.refresh_token);
      console.log("Session expires_at:", data.session.expires_at);
    }

    // Log user info
    const user = data?.user;
    console.log("User object:", user);

    if (!user) {
      return NextResponse.json(
        { error: "User not found in session", rawData: data },
        { status: 400 }
      );
    }

    return NextResponse.json({ user, rawData: data }, { status: 200 });
  } catch (err: unknown) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
