import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Ensures your dashboard reflects database changes immediately on refresh
export const revalidate = 0;

export default async function PaymentOverview() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); } } }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Unified data fetch
  const [playerRes, membershipRes, requestRes] = await Promise.all([
    supabase.from("players").select("*").eq("id", user?.id).single(),
    supabase.from("team_members").select("*, teams(*)").eq("member_id", user?.id).maybeSingle(),
    supabase.from("team_requests").select("*").eq("user_id", user?.id).eq("is_approved", false).maybeSingle(),
  ]);

  const isMember = playerRes.data?.is_member ?? false;
  const currentTeam = membershipRes.data?.teams;
  const isOwner = membershipRes.data?.is_owner ?? false;

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-20 p-4 text-slate-900">
      {/* Header Area */}
      <section>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase">Payments</h1>
        <p className="text-slate-600 font-bold mt-1">Player: {playerRes.data?.name || 'User'}</p>
      </section>

      {/* Primary Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Card 1: Membership */}
        <div className="bg-slate-200 p-8 rounded-3xl border-2 border-slate-300 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Membership Status</p>
            <p className={`text-3xl font-black mt-2 ${isMember ? 'text-green-700' : 'text-red-600'}`}>
              {isMember ? "ACTIVE" : "UNPAID"}
            </p>
          </div>
          {!isMember && (
            <p className="text-xs font-bold text-red-500 mt-4 bg-red-100 p-2 rounded border border-red-200">
              Membership required to access team features.
            </p>
          )}
        </div>

        {/* Card 2: Team Name */}
        <div className="bg-slate-200 p-8 rounded-3xl border-2 border-slate-300 shadow-sm">
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Team Name</p>
          <p className="text-3xl font-black text-slate-900 mt-2 uppercase">
            {currentTeam?.name || "NONE"}
          </p>
        </div>

      </div>
    </div>
  );
}