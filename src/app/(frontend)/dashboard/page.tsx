import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import TeamManager from "@/components/v1/TeamManager";
import TeamRequestForm from "@/components/v1/TeamRequestForm";
import InviteList from "@/components/v1/InviteList";
import TargetList from "@/components/v1/TargetList";

// Ensures your dashboard reflects database changes immediately on refresh
export const revalidate = 0;

export default async function DashboardOverview() {
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

  const { data: invitations } = await supabase
    .from("invitations")
    .select("*, teams(name)")
    .eq("invited_player_id", user?.id)
    .eq("status", "pending");

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
        <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase">Dashboard</h1>
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

        {/* Card 3: Team Invites or Roster */}
        <div className="bg-slate-200 p-8 rounded-3xl border-2 border-slate-300 shadow-sm">
          <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">
            {currentTeam ? "Your Roster" : "Team Invites"}
          </h2>
          <div className={!isMember ? 'opacity-40 grayscale pointer-events-none' : ''}>
            <div className="bg-slate-50 rounded-xl p-6 border-2 border-slate-300 border-dashed min-h-[120px] flex items-center justify-center text-center">
              {currentTeam ? (
                <TeamManager teamId={currentTeam.id} isOwner={isOwner} />
              ) : (
                <InviteList invitations={invitations || []} isMember={isMember} />
              )}
            </div>
          </div>
          {!isMember && (
            <p className="text-xs font-bold text-red-500 mt-4 bg-red-100 p-2 rounded border border-red-200">
              Membership required to access team features.
            </p>
          )}
        </div>

        {/* Card 4: Targets */}
        <div className="bg-slate-200 p-8 rounded-3xl border-2 border-slate-300 shadow-sm">
          <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">Targets</h2>
          <div className={!isMember ? 'opacity-40 grayscale pointer-events-none' : ''}>
            <div className="bg-slate-50 rounded-xl p-6 border-2 border-slate-300 border-dashed min-h-[120px] flex items-center justify-center text-center">
              <TargetList targets={formattedTargets} isMember={isMember} week={currentWeek} />
            </div>
          </div>
          {!isMember && (
            <p className="text-xs font-bold text-red-500 mt-4 bg-red-100 p-2 rounded border border-red-200">
              Membership required to receive targets.
            </p>
          )}
        </div>

      </div>

      {/* Developer Trace stays outside the grid */}
      <details className="mt-24 border-t border-slate-300 pt-8">
        <summary className="text-xs font-mono font-bold text-slate-400 cursor-pointer hover:text-slate-600 uppercase tracking-widest">
          Developer Trace
        </summary>
        <div className="mt-6 bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <pre className="text-[10px] text-emerald-400 bg-black/30 p-4 rounded-lg overflow-auto max-h-64">
              {JSON.stringify(user, null, 2)}
            </pre>
            <pre className="text-[10px] text-sky-400 bg-black/30 p-4 rounded-lg overflow-auto max-h-64">
              {JSON.stringify({ player: playerRes.data, team: membershipRes.data }, null, 2)}
            </pre>
          </div>
        </div>
      </details>
    </div>
  );
}