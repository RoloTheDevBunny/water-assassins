import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { GET as getMeHandler } from "@/app/(backend)/api/v1/me/route";
import { updateSession } from "@/libs/supabase/middleware";

async function getUserPlan(
  userId: string
): Promise<"global" | "individual" | "member" | "team"> {
  // Check user's level based on team membership
  const baseUrl = process.env.NEXT_PUBLIC_PROJECT_URL;
  if (!baseUrl) throw new Error("Missing NEXT_PUBLIC_PROJECT_URL env variable");

  try {
    const response = await fetch(
      `${baseUrl}/api/v1/user/level?userId=${userId}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.level;
    }
  } catch (error) {
    console.error("Error fetching user level:", error);
  }

  // Default to global if API fails
  return "global";
}

export async function middleware(request: NextRequest) {
  await updateSession(request);

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    const getMeResponse = await getMeHandler();
    const data = await getMeResponse.json();


    if (!data?.id) {
      const redirectUrl = new URL("/register", request.url);
      return NextResponse.redirect(redirectUrl);
    }

    const plan = await getUserPlan(data?.id);

    const response = NextResponse.next();
    response.headers.set("x-shared-data", JSON.stringify({ plan }));
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
