import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import TeamManager from "@/components/v1/TeamManager";
import TeamRequestForm from "@/components/v1/TeamRequestForm";
import InviteList from "@/components/v1/InviteList";

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
    <div className="space-y-8 max-w-5xl mx-auto pb-20 text-gray-900">
      {/* Header */}
      <section>
        <h1 className="text-4xl font-black text-gray-900">DASHBOARD</h1>
        <p className="text-gray-600 font-medium">Player: {playerRes.data?.name || 'Unknown'}</p>
      </section>

      {/* Status Row - Grey Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-100 p-6 rounded-lg border border-gray-300">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Membership</p>
          <p className={`text-2xl font-bold mt-1 ${isMember ? 'text-green-700' : 'text-red-600'}`}>
            {isMember ? "ACTIVE" : "UNPAID / INACTIVE"}
          </p>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg border border-gray-300">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Current Team</p>
          <p className="text-2xl font-bold mt-1 text-gray-900">
            {currentTeam?.name || "NONE"}
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <section className="space-y-6">
        {currentTeam ? (
          <div className="bg-gray-100 p-6 rounded-xl border border-gray-300">
            <h2 className="text-xl font-bold mb-4 text-gray-900 border-b border-gray-300 pb-2">TEAM ROSTER</h2>
            <TeamManager teamId={currentTeam.id} isOwner={isOwner} />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Invitations */}
            <div className="bg-gray-100 p-6 rounded-xl border border-gray-300">
              <h2 className="text-lg font-bold mb-4 text-gray-900">INVITATIONS</h2>
              <div className={!isMember ? 'opacity-40 pointer-events-none' : ''}>
                <InviteList invitations={invitations || []} isMember={isMember} />
              </div>
            </div>

            {/* Request Team */}
            <div className="bg-gray-100 p-6 rounded-xl border border-gray-300 text-gray-900">
              <h2 className="text-lg font-bold mb-4">REQUEST A TEAM</h2>
              <div className={!isMember ? 'opacity-40 pointer-events-none' : ''}>
                {requestRes.data ? (
                  <div className="p-4 bg-gray-200 border border-gray-400 rounded-md">
                    <p className="font-bold text-gray-800">Pending: "{requestRes.data.team_name}"</p>
                  </div>
                ) : (
                  <TeamRequestForm isMember={isMember} />
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* DEBUG (Keep as is, but small) */}
      <details className="mt-20">
        <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">View System Debug</summary>
        <div className="mt-4 bg-gray-900 p-6 rounded-xl font-mono text-[10px] overflow-auto max-h-96">
          <pre className="text-emerald-400">{JSON.stringify({ user, player: playerRes.data, membership: membershipRes.data }, null, 2)}</pre>
        </div>
      </details>
    </div>
  );
}