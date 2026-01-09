import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import TeamManager from "@/components/v1/TeamManager";
import TeamRequestForm from "@/components/v1/TeamRequestForm";
import InviteList from "@/components/v1/InviteList";

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

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-20 p-4 text-slate-900">
      {/* Header Area */}
      <section>
        <h1 className="text-4xl font-black tracking-tight text-slate-900">DASHBOARD</h1>
        <p className="text-slate-600 font-bold mt-1">Player: {playerRes.data?.name || 'User'}</p>
      </section>

      {/* Top Stats: High Contrast Slate-200 Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-200 p-8 rounded-2xl border-2 border-slate-300 shadow-sm">
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Membership Status</p>
          <p className={`text-3xl font-black mt-2 ${isMember ? 'text-green-700' : 'text-red-600'}`}>
            {isMember ? "ACTIVE" : "UNPAID"}
          </p>
          {!isMember && (
            <p className="text-xs font-bold text-red-500 mt-2 bg-red-100 p-2 rounded border border-red-200">
              Membership required to access team features.
            </p>
          )}
        </div>

        <div className="bg-slate-200 p-8 rounded-2xl border-2 border-slate-300 shadow-sm">
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Team Name</p>
          <p className="text-3xl font-black text-slate-900 mt-2 uppercase">
            {currentTeam?.name || "NONE"}
          </p>
        </div>
      </div>

      {/* Main Content Sections */}
      <section>
        {currentTeam ? (
          <div className="bg-slate-200 p-8 rounded-3xl border-2 border-slate-300">
            <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase border-b-2 border-slate-300 pb-2">Your Roster</h2>
            <TeamManager teamId={currentTeam.id} isOwner={isOwner} />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Invitations Section */}
            <div className="bg-slate-200 p-8 rounded-3xl border-2 border-slate-300 shadow-sm">
              <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">Team Invites</h2>
              <div className={!isMember ? 'opacity-40 grayscale pointer-events-none' : ''}>
                <div className="bg-slate-50 rounded-xl p-6 border-2 border-slate-300 border-dashed text-center">
                  <InviteList invitations={invitations || []} isMember={isMember} />
                </div>
              </div>
              {!isMember && (
                <p className="text-xs font-bold text-red-500 mt-2 bg-red-100 p-2 rounded border border-red-200">
                  Membership required to access team features.
                </p>
              )}
            </div>
          </div>
        )}
      </section>

      <section>
        {currentTeam ? (
          <div className="bg-slate-200 p-8 rounded-3xl border-2 border-slate-300">
            <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase border-b-2 border-slate-300 pb-2">Your Targets</h2>
            {/* <TeamManager teamId={currentTeam.id} isOwner={isOwner} /> */}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Invitations Section */}
            <div className="bg-slate-200 p-8 rounded-3xl border-2 border-slate-300 shadow-sm">
              <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">Targets</h2>
              <div className={!isMember ? 'opacity-40 grayscale pointer-events-none' : ''}>
                <div className="bg-slate-50 rounded-xl p-6 border-2 border-slate-300 border-dashed text-center">
                  {/* <InviteList invitations={invitations || []} isMember={isMember} /> */}
                </div>
              </div>
              {!isMember && (
                <p className="text-xs font-bold text-red-500 mt-2 bg-red-100 p-2 rounded border border-red-200">
                  Membership required to recieve targets.
                </p>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Collapsible Debug Tool - Keeps the main site clean */}
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