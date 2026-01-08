// src/app/team/page.tsx
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
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Fetch everything using the unified UUID (user.id)
  const [playerRes, requestRes, membershipRes] = await Promise.all([
    supabase.from("players").select("*").eq("id", user?.id).single(),
    supabase.from("team_requests").select("*").eq("user_id", user?.id).eq("is_approved", false).maybeSingle(),
    supabase.from("team_members").select("*, teams(*)").eq("member_id", user?.id).maybeSingle()
  ]);

  const player = playerRes.data;
  const pendingRequest = requestRes.data;
  const currentTeam = membershipRes.data?.teams;
  const isOwner = membershipRes.data?.is_owner ?? false;
  const isMember = player?.is_member ?? false;

  // Fetch invitations sent to this player UUID
  const { data: invitations } = await supabase
    .from("invitations")
    .select("*, teams(name)")
    .eq("invited_player_id", user?.id)
    .eq("status", "pending");

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* 1. Membership Status Banner */}
      <div className={`p-6 border rounded-xl flex justify-between items-center shadow-sm transition-all ${!isMember ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-100'}`}>
        <div>
          <h2 className="text-xl font-black uppercase italic tracking-tight text-gray-900">Player Membership</h2>
          <p className="text-sm text-gray-500 font-medium">Required to join or create a team.</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${isMember ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {isMember ? "ACTIVE MEMBER" : "UNPAID"}
          </span>
          {!isMember && <span className="text-[10px] font-bold text-red-400 uppercase">Action Required</span>}
        </div>
      </div>

      {currentTeam ? (
        /* 2. Active Team View */
        <div className="space-y-6">
          <div className="flex items-baseline gap-4">
            <h1 className="text-5xl font-black italic uppercase tracking-tighter text-indigo-600">
              {currentTeam.name}
            </h1>
            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Team Hub</span>
          </div>
          <TeamManager teamId={currentTeam.id} isOwner={isOwner} />
        </div>
      ) : (
        /* 3. Join / Create View (Locked if Unpaid) */
        <div className="grid md:grid-cols-2 gap-8">
          {/* Invitations Section */}
          <div className={`space-y-4 transition-all ${!isMember ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-black uppercase text-gray-400 text-sm tracking-widest">Pending Invitations</h3>
              {!isMember && <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded font-bold">LOCKED</span>}
            </div>
            <InviteList invitations={invitations || []} isMember={isMember} />
          </div>

          {/* Create Team Section */}
          <div className={`space-y-4 transition-all ${!isMember ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-black uppercase text-gray-400 text-sm tracking-widest">Start a Team</h3>
              {!isMember && <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded font-bold">LOCKED</span>}
            </div>
            {pendingRequest ? (
              <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-700">
                <p className="text-xs uppercase font-black tracking-widest mb-1 opacity-60">Status: Pending</p>
                <p className="font-bold">Request for "{pendingRequest.team_name}" is awaiting admin approval.</p>
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