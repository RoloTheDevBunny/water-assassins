import { NextRequest, NextResponse } from "next/server";

import { supabaseServerClient as supabase } from "@/libs/supabase/server";
import TeamService from "@/services/team";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || typeof userId !== "string") {
      throw new Error("Invalid or missing userId");
    }

    const teamService = new TeamService(supabase);
    const team = await teamService.getTeamByUserId(
      userId
    );

    if (!team) {
      return NextResponse.json({ status: 204 });
    }

    return NextResponse.json(team, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
