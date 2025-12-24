import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { FINISH_CHECKOUT_EMAIL } from "@/constants/finish-checkout-email";
import { stripe } from "@/libs/stripe";
import { supabaseServerClient as supabase } from "@/libs/supabase/server";
import AuthService from "@/services/auth";
import EmailService from "@/services/email";
import PaymentService from "@/services/payment";
import TeamService from "@/services/team";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(req: NextRequest): Promise<string> {
  const text = await req.text();
  return text;
}

export async function POST(req: NextRequest) {
  const emailService = new EmailService();
  const authService = new AuthService(supabase);
  const teamService = new TeamService(supabase);
  const paymentService = new PaymentService(stripe);

  const headersList = headers();
  const sig = (await headersList).get("stripe-signature");
  const rawBody = await getRawBody(req);

  if (!sig || !endpointSecret) {
    return NextResponse.json(
      { error: "Webhook Error: Missing Stripe signature" },
      { status: 400 }
    );
  }

  let event;

  try {
    event = paymentService.constructWebhookEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Erro desconhecido";
    console.error("Erro ao verificar a assinatura do webhook:", errorMessage);
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const session = event.data.object as any;
        const { userId, plan } = session.metadata;

        await teamService.upsertTeam({
          user_id: userId,
          stripe_team_id: session.team,
          plan,
          status: "active",
          current_period_start: new Date(session.current_period_start * 1000),
          current_period_end: new Date(session.current_period_end * 1000),
        });

        const email = (await authService.getUserById(userId))?.email;
        if (!email) {
          throw new Error("Missing User Data in Completed Checkout");
        }

        await emailService.sendEmail({
          from: "Sassy - Powerful AHS Water Assassins",
          to: [email],
          subject: "Welcome to Sassy!",
          text: "Welcome to Sassy! Your team has been activated.",
          html: FINISH_CHECKOUT_EMAIL.replace("{plan}", plan),
        });

        break;
      }

      case "customer.team.updated": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const team = event.data.object as any;

        await teamService.updateTeamPeriod(
          team.id,
          new Date(team.current_period_start * 1000),
          new Date(team.current_period_end * 1000)
        );

        await teamService.updateTeamStatus(
          team.id,
          team.status
        );
        break;
      }

      case "customer.team.deleted": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const team = event.data.object as any;
        await teamService.cancelTeam(team.id);
        break;
      }

      default:
        console.warn(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Error handling webhook event:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
