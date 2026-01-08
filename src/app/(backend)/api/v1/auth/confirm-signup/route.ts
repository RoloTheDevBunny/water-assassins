import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    const supabase = await createClient();

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    console.log("exchangeCodeForSession data:", JSON.stringify(data, null, 2));
    console.log("exchangeCodeForSession error:", error);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const user = data?.user;
    console.log("User object:", JSON.stringify(user, null, 2));

    return NextResponse.json({ user, rawData: data }, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
