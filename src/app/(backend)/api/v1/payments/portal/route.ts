import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/libs/stripe";
import { supabaseServerClient as supabase } from "@/libs/supabase/server";
import AuthService from "@/services/auth";
import PaymentService from "@/services/payment";
import TeamService from "@/services/team";

export async function POST() {
  try {
    const headersList = headers();
    const cleanBearer = (await headersList)
      .get("authorization")
      ?.replace("Bearer ", "");

    if (!cleanBearer) {
      return NextResponse.json(
        { error: "Auth session missing!" },
        { status: 401 }
      );
    }

    const authService = new AuthService(supabase);
    const teamService = new TeamService(supabase);
    const PaymentServiceInstance = new PaymentService(stripe);

    const user = await authService.getUser(cleanBearer);

    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const team = await teamService.getTeamByUserId(
      user.id
    );

    if (!team) {
      return NextResponse.json(
        { error: "No team found for user" },
        { status: 404 }
      );
    }

    const customerId =
      await PaymentServiceInstance.getCustomerIdFromTeam(
        team.stripe_team_id
      );

    if (!customerId) {
      return NextResponse.json(
        { error: "No customerId found for team" },
        { status: 404 }
      );
    }

    const portalSession =
      await PaymentServiceInstance.createBillingPortalSession(customerId);

    return NextResponse.json({ url: portalSession.url }, { status: 200 });
  } catch (error) {
    console.error("Error creating billing portal session:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
