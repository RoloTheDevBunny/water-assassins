import { NextRequest, NextResponse } from "next/server";

import { supabaseServerClient as supabase } from "@/libs/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || typeof userId !== "string") {
      return NextResponse.json({ level: "global" }, { status: 200 });
    }

    // Check if user is owner of a team
    const { data: ownerData, error: ownerError } = await supabase
      .from('teams')
      .select('TeamID')
      .eq('Owner', userId)
      .limit(1);

    if (ownerError) {
      console.error("Error checking owner:", ownerError);
      return NextResponse.json({ level: "global" }, { status: 200 });
    }

    if (ownerData && ownerData.length > 0) {
      return NextResponse.json({ level: "team" }, { status: 200 });
    }

    // Check if user is a member of any team
    const { data: memberData, error: memberError } = await supabase
      .from('teams')
      .select('TeamID')
      .contains('Members', [userId])
      .limit(1);

    if (memberError) {
      console.error("Error checking member:", memberError);
      return NextResponse.json({ level: "global" }, { status: 200 });
    }

    if (memberData && memberData.length > 0) {
      return NextResponse.json({ level: "member" }, { status: 200 });
    }

    // Not in any team
    return NextResponse.json({ level: "global" }, { status: 200 });
  } catch (error) {
    console.error("Error in user level API:", error);
    return NextResponse.json({ level: "global" }, { status: 200 });
  }
}