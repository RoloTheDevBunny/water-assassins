import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    const supabase = await createClient();

    // Exchange the OAuth code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const user = data?.user;

    if (!user) {
      return NextResponse.json({ error: "User not found in session" }, { status: 400 });
    }

    // Return the user to the frontend
    return NextResponse.json({ user }, { status: 200 });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
