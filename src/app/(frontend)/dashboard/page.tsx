import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import TeamManager from "@/components/v1/TeamManager";
import TeamRequestForm from "@/components/v1/TeamRequestForm";
import InviteList from "@/components/v1/InviteList";

export default async function DashboardOverview() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); } } }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Unified data fetch for the Overview
  const [playerRes, membershipRes, requestRes] = await Promise.all([
    supabase.from("players").select("*").eq("id", user?.id).single(),
    supabase.from("team_members").select("*, teams(*)").eq("member_id", user?.id).maybeSingle(),
    supabase.from("team_requests").select("*").eq("user_id", user?.id).eq("is_approved", false).maybeSingle(),
  ]);

  const isMember = playerRes.data?.is_member ?? false;
  const currentTeam = membershipRes.data?.teams;
  const isOwner = membershipRes.data?.is_owner ?? false;

  // Fetch invitations if they aren't on a team yet
  const { data: invitations } = await supabase
    .from("invitations")
    .select("*, teams(name)")
    .eq("invited_player_id", user?.id)
    .eq("status", "pending");

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <section>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-2">Welcome back, {playerRes.data?.name || 'Player'}.</p>
      </section>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Membership Status</p>
          <div className="mt-2 flex items-center gap-2">
            <span className={`text-xl font-bold ${isMember ? 'text-green-600' : 'text-red-600'}`}>
              {isMember ? "Active" : "Unpaid"}
            </span>
          </div>
          {!isMember && (
            <p className="text-sm text-gray-500 mt-1">Visit settings to complete your membership.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Team Association</p>
          <p className="text-xl font-bold text-gray-900 mt-2">
            {currentTeam?.name || "No Team Assigned"}
          </p>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Main Action Area */}
      <div>
        {currentTeam ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Your Team Roster</h2>
            <TeamManager teamId={currentTeam.id} isOwner={isOwner} />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Components utilized here */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Invitations</h2>
              <div className={!isMember ? 'opacity-50 grayscale pointer-events-none' : ''}>
                <InviteList invitations={invitations || []} isMember={isMember} />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Request a Team</h2>
              <div className={!isMember ? 'opacity-50 grayscale pointer-events-none' : ''}>
                {requestRes.data ? (
                  <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <p className="text-sm font-medium text-indigo-600">
                      Request for <span className="font-bold">"{requestRes.data.team_name}"</span> is currently pending approval.
                    </p>
                  </div>
                ) : (
                  <TeamRequestForm isMember={isMember} />
                )}
              </div>
            </div>
          </div>
        )}
        Debug:
        JSON.stringify(playerRes.data)
      </div>
    </div>
  );
}