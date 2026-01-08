import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import TeamRequestForm from "@/components/v1/TeamRequestForm";
import { InviteList } from "@/components/v1/InviteList";
import TeamManager from "@/components/v1/TeamManager";

export default async function TeamPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Fetch all necessary data in parallel using the user's UUID
  const [playerRes, requestRes, membershipRes] = await Promise.all([
    supabase.from("players").select("*").eq("id", user?.id).single(),
    supabase.from("team_requests").select("*").eq("user_id", user?.id).eq("is_approved", false).maybeSingle(),
    supabase.from("team_members").select("*, teams(*)").eq("member_id", user?.id).maybeSingle()
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
    <div className="space-y-10 max-w-6xl mx-auto p-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-gray-900">Unit Management</h1>
          <p className="text-gray-400 font-medium">Coordinate with your team or establish a new cell.</p>
        </div>

        {/* Membership Badge from version 2 */}
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${isMember ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {isMember ? "PAID MEMBER" : "UNPAID"}
        </div>
      </header>

      {currentTeam ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-indigo-900">
            {currentTeam.name}
          </h2>
          <TeamManager teamId={currentTeam.id} isOwner={isOwner} />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-10">
          {/* Invitations Section */}
          <div className={`space-y-4 ${!isMember ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Incoming Requests</h3>
            <InviteList invitations={invitations || []} isMember={isMember} />
          </div>

          {/* Creation Section */}
          <div className={`space-y-4 ${!isMember ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Establish Team</h3>
            {requestRes.data ? (
              <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 text-indigo-700 font-bold">
                Request for "{requestRes.data.team_name || requestRes.data.desired_team_name}" is pending approval.
              </div>
            ) : (
              <TeamRequestForm isMember={isMember} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}