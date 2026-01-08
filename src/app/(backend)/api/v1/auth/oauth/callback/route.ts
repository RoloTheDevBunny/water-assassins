import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "Missing OAuth code" }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Error exchanging code:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { session, user } = data;

    if (!session || !user) {
      return NextResponse.json({ error: "Failed to get session or user" }, { status: 500 });
    }

    // --- 2. DOMAIN SECURITY CHECK ---
    // If the email is wrong, we stop here and DON'T set the cookies.
    if (!user.email?.endsWith('@student.lvusd.org')) {
      // Optional: Sign them out server-side to invalidate the session immediately
      await supabase.auth.signOut(); 
      
      return NextResponse.json(
        { error: "Access restricted: Only @student.lvusd.org accounts are allowed." },
        { status: 403 }
      );
    }

    // 3. Set Supabase cookies for the session (Only for valid domains)
    const res = NextResponse.json({ user, message: "OAuth successful" }, { status: 200 });
    
    // Using the default Supabase cookie names
    res.cookies.set("sb-access-token", session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });
    res.cookies.set("sb-refresh-token", session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return res;
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}