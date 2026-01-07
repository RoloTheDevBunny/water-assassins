import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Supabase sends 'token_hash' and 'type' in the email link
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/Dashboard";

  if (token_hash && type) {
    const supabase = await createClient();

    // This method handles the cookie exchange internally
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      // On success, redirect to the dashboard
      return NextResponse.redirect(new URL(next, request.url));
    }
    
    console.error("Auth Error:", error.message);
  }

  // On failure, redirect to signin with an error message
  return NextResponse.redirect(new URL("/signin?error=invalid_token", request.url));
}