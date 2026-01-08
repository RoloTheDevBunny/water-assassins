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
    { cookies: { getAll() { return cookieStore.getAll(); } } }
  );

  const { data: { user } } = await supabase.auth.getUser();

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
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Team Management</h1>
        <p className="text-slate-500">Manage your current team or create a new one to participate.</p>
      </header>

      {currentTeam ? (
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <TeamManager teamId={currentTeam.id} isOwner={isOwner} />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          <div className={`p-8 bg-white rounded-3xl border border-slate-100 shadow-sm ${!isMember ? 'opacity-50 grayscale' : ''}`}>
            <h3 className="text-lg font-bold text-slate-900 mb-6">Invitations</h3>
            <InviteList invitations={invitations || []} isMember={isMember} />
          </div>

          <div className={`p-8 bg-white rounded-3xl border border-slate-100 shadow-sm ${!isMember ? 'opacity-50 grayscale' : ''}`}>
            <h3 className="text-lg font-bold text-slate-900 mb-6">Create a Team</h3>
            {requestRes.data ? (
              <div className="bg-indigo-50 p-6 rounded-2xl text-indigo-700 font-medium border border-indigo-100 text-sm">
                Your request for "{requestRes.data.team_name}" is currently being reviewed.
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