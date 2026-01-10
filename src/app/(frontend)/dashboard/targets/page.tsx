// src/app/dashboard/team/page.tsx
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import TargetList from "@/components/v1/TargetList";

// Ensures fresh data on every visit
export const revalidate = 0;

export default async function TeamPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); } } }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Unified data fetch
  const [playerRes, membershipRes] = await Promise.all([
    supabase.from("players").select("*").eq("id", user?.id).single(),
    supabase.from("team_members").select("*, teams(*)").eq("member_id", user?.id).maybeSingle(),
  ]);

  const isMember = playerRes.data?.is_member ?? false;

  // UPDATED QUERY: 
  // We are selecting everything from 'targets' 
  // AND joining the 'players' table using 'target_id' to get their name
  const { data: targets } = await supabase
    .from("targets")
    .select(`
      *,
      target_info:players!target_id (
        name
      )
    `)
    .eq("assassin_id", user?.id);

  const { data: config } = await supabase
    .from("game_config")
    .select("current_week_number")
    .eq("id", 1)
    .single();

  const currentWeek = config?.current_week_number || 1;

  // Map the targets to ensure the name is easily accessible by TargetList
  const formattedTargets = targets?.map(t => ({
    ...t,
    // This ensures TargetList sees "target_name"
    target_name: t.target_info?.name || "Unknown Player"
  })) || [];

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-20 p-4 text-slate-900">
      {/* Header Area */}
      <section>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase">Targets</h1>
        <p className="text-slate-600 font-bold mt-1">View your assigned targets.</p>

        {/* Status Badge */}
        <div className="mt-6 inline-flex items-center gap-3 px-4 py-2 bg-slate-200 border-2 border-slate-300 rounded-full shadow-sm">
          <div className={`w-3 h-3 rounded-full ${isMember ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-xs font-black uppercase tracking-widest text-slate-700">
            {isMember ? "Active Member" : "Membership Required"}
          </span>
        </div>
      </section>

      {/* Main Content Area */}
      <section>
        <div className="bg-slate-200 p-8 rounded-3xl border-2 border-slate-300 shadow-sm">
          <div className="border-b-2 border-slate-300 pb-4 mb-6">
            <h2 className="text-2xl font-black text-slate-900 uppercase">Your Targets</h2>
          </div>

          <TargetList targets={formattedTargets} isMember={isMember} week={currentWeek} compact={false} />

          {!isMember && (
            <p className="text-xs font-bold text-red-500 mt-4 bg-red-100 p-2 rounded border border-red-200">
              Membership required to receive targets.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}