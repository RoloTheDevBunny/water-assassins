import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import TeamManager from "@/components/v1/TeamManager";
import TeamRequestForm from "@/components/v1/TeamRequestForm";
import InviteList from "@/components/v1/InviteList";

// This ensures the dashboard doesn't show old cached data from Supabase
export const revalidate = 0;

export default async function DashboardOverview() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); } } }
  );

  const { data: { user } } = await supabase.auth.getUser();

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
    <div className="space-y-10 max-w-6xl mx-auto pb-20">
      {/* Welcome Header */}
      <section>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
        <p className="text-gray-600 mt-2 text-lg">
          Welcome back, <span className="font-semibold text-indigo-600">{playerRes.data?.name || 'Player'}</span>.
        </p>
      </section>

      {/* Quick Stats Grid - High Contrast */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Membership Status</p>
          <div className="mt-3 flex items-center gap-3">
            <div className={`h-3 w-3 rounded-full ${isMember ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className={`text-2xl font-black ${isMember ? 'text-green-700' : 'text-red-700'}`}>
              {isMember ? "Active Member" : "Action Required"}
            </span>
          </div>
          {!isMember && (
            <p className="text-sm text-gray-500 mt-2 bg-red-50 p-2 rounded-lg border border-red-100">
              Your account is currently unpaid. Please visit settings to join the league.
            </p>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Team Association</p>
          <p className="text-2xl font-black text-gray-900 mt-3">
            {currentTeam?.name || "Free Agent"}
          </p>
          <p className="text-sm text-gray-500 mt-1">{currentTeam ? "Playing for " + currentTeam.name : "You are not on a team yet."}</p>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Main Action Area */}
      <section>
        {currentTeam ? (
          <div className="bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-sm space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-2xl font-bold text-gray-800">Team Roster</h2>
              <p className="text-gray-500 text-sm">Manage your teammates and starting lineup.</p>
            </div>
            <TeamManager teamId={currentTeam.id} isOwner={isOwner} />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Invitations Card */}
            <div className="bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Pending Invitations</h2>
              <div className={!isMember ? 'opacity-40 grayscale pointer-events-none' : ''}>
                <InviteList invitations={invitations || []} isMember={isMember} />
              </div>
            </div>

            {/* Request a Team Card */}
            <div className="bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Start a Team</h2>
              <div className={!isMember ? 'opacity-40 grayscale pointer-events-none' : ''}>
                {requestRes.data ? (
                  <div className="p-6 bg-indigo-50 border-2 border-indigo-100 rounded-2xl">
                    <p className="text-indigo-900 font-medium">
                      Your request for <span className="font-bold underline">"{requestRes.data.team_name}"</span> is currently being reviewed by admins.
                    </p>
                  </div>
                ) : (
                  /* Note: Ensure TeamRequestForm.tsx uses:
                     - text-gray-900 for input text
                     - bg-gray-50 for input backgrounds
                  */
                  <TeamRequestForm isMember={isMember} />
                )}
              </div>
              {!isMember && (
                <p className="text-xs text-center text-red-500 font-semibold italic">
                  Membership required to join or create teams.
                </p>
              )}
            </div>
          </div>
        )}
      </section>

      {/* DEBUG BOX - Isolated Dark Section */}
      <section className="mt-32">
        <div className="bg-slate-950 rounded-3xl p-8 overflow-hidden shadow-2xl border border-slate-800">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-2 w-2 bg-yellow-400 rounded-full animate-ping" />
            <h3 className="text-sm font-mono font-bold text-yellow-500 uppercase tracking-[0.2em]">
              System Debugger
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono">
            <div className="space-y-2">
              <p className="text-[10px] text-slate-500 uppercase">Supabase Auth User</p>
              <pre className="text-[11px] text-emerald-400 bg-slate-900/50 p-4 rounded-xl border border-slate-800 h-64 overflow-auto custom-scrollbar">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] text-slate-500 uppercase">Database: Players</p>
              <pre className="text-[11px] text-sky-400 bg-slate-900/50 p-4 rounded-xl border border-slate-800 h-64 overflow-auto">
                {JSON.stringify(playerRes.data, null, 2)}
              </pre>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] text-slate-500 uppercase">Database: Team Info</p>
              <pre className="text-[11px] text-purple-400 bg-slate-900/50 p-4 rounded-xl border border-slate-800 h-64 overflow-auto">
                {JSON.stringify({ membership: membershipRes.data, requests: requestRes.data }, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}