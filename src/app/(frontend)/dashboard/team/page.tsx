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
      {/* Page Header */}
      <section>
        <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
        <p className="text-gray-500 mt-2">Required to join or create a team.</p>

        <div className="mt-6 inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded-full shadow-sm">
          <div className={`w-2 h-2 rounded-full ${isMember ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">
            Membership: {isMember ? "Active" : "Unpaid"}
          </span>
        </div>
      </section>

      {currentTeam ? (
        /* If user is in a team */
        <TeamManager teamId={currentTeam.id} isOwner={isOwner} />
      ) : (
        /* If user is looking for a team */
        <div className="grid md:grid-cols-2 gap-12 items-start">

          {/* Left: Invitations */}
          <div className={`space-y-4 ${!isMember ? 'opacity-50 grayscale' : ''}`}>
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">Pending Invitations</h2>
            <InviteList invitations={invitations || []} isMember={isMember} />
          </div>

          {/* Right: Team Creation */}
          <div className={`space-y-4 ${!isMember ? 'opacity-50 grayscale' : ''}`}>
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">Start a Team</h2>
            {requestRes.data ? (
              <div className="p-6 bg-white border border-indigo-100 rounded-xl shadow-sm">
                <p className="text-sm font-medium text-indigo-600 italic">
                  Request for <span className="font-bold">"{requestRes.data.team_name}"</span> is pending approval.
                </p>
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