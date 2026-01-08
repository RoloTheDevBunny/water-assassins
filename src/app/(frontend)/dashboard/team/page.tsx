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
    { cookies: { getAll() { return cookieStore.getAll() } } }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Fetch player, their team (via join), and pending invites
  const [playerRes, inviteRes, requestRes] = await Promise.all([
    supabase.from("players").select("*, teams(*)").eq("user_id", user?.id).single(),
    supabase.from("invitations").select("*, teams(name)").eq("invited_player_id", 
      (await supabase.from("players").select("id").eq("user_id", user?.id).single()).data?.id
    ).eq("status", "pending"),
    supabase.from("team_requests").select("*").eq("user_id", user?.id).eq("is_approved", false)
  ]);

  const player = playerRes.data;
  const invitations = inviteRes.data || [];
  const pendingRequest = requestRes.data?.[0];
  const isOwner = player?.teams?.owner_id === user?.id;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* 1. Membership Status */}
      <div className="p-4 rounded-lg border bg-white flex justify-between items-center">
        <div>
          <h2 className="font-bold">Player Membership</h2>
          <p className="text-sm text-gray-500">Required to join any team.</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${player?.is_member ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {player?.is_member ? "PAID MEMBER" : "UNPAID"}
        </span>
      </div>

      {player?.teams ? (
        /* 2. Team Management (If in a team) */
        <div className="space-y-4">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-indigo-900">
            {player.teams.name}
          </h2>
          <TeamManager teamId={player.teams.id} isOwner={isOwner} />
        </div>
      ) : (
        /* 3. Join/Create Options (If not in a team) */
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-xl border">
            <h3 className="font-bold mb-4">Pending Invitations</h3>
            <InviteList invitations={invitations} isMember={player?.is_member} />
          </div>
          <div className="p-6 bg-white rounded-xl border">
            <h3 className="font-bold mb-4">Create a Team</h3>
            {pendingRequest ? (
              <p className="text-sm text-amber-600">Request for "{pendingRequest.desired_team_name}" is pending approval.</p>
            ) : (
              <TeamRequestForm />
            )}
          </div>
        </div>
      )}
    </div>
  );
}