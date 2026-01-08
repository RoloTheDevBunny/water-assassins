// src/app/dashboard/team/page.tsx
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import InviteList from "@/components/v1/InviteList";
import TeamRequestForm from "@/components/v1/TeamRequestForm";
import TeamManager from "@/components/v1/TeamManager";

export default async function TeamPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); } } }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Fetch data using the merged UUID (user.id)
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
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-gray-900">Unit Management</h1>
        <p className="text-gray-400 font-medium">Coordinate with your team or establish a new cell.</p>
      </header>

      {currentTeam ? (
        <TeamManager teamId={currentTeam.id} isOwner={isOwner} />
      ) : (
        <div className="grid md:grid-cols-2 gap-10">
          <div className={`space-y-4 ${!isMember ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Incoming Requests</h3>
            <InviteList invitations={invitations || []} isMember={isMember} />
          </div>

          <div className={`space-y-4 ${!isMember ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Establish Team</h3>
            {requestRes.data ? (
                <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 text-indigo-700 font-bold">
                    Request for "{requestRes.data.team_name}" is pending approval.
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