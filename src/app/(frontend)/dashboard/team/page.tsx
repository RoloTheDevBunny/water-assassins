// src/app/dashboard/team/page.tsx
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import InviteList from "@/components/v1/InviteList";
import TeamRequestForm from "@/components/v1/TeamRequestForm";
import TeamManager from "@/components/v1/TeamManager";

// Ensures fresh data on every visit
export const revalidate = 0;

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
    <div className="space-y-10 max-w-5xl mx-auto pb-20 p-4 text-slate-900">
      {/* Header Area */}
      <section>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase">Team Management</h1>
        <p className="text-slate-600 font-bold mt-1">Manage your current team or join a new one.</p>

        {/* Status Badge */}
        <div className="mt-6 inline-flex items-center gap-3 px-4 py-2 bg-slate-200 border-2 border-slate-300 rounded-full shadow-sm">
          <div className={`w-3 h-3 rounded-full ${isMember ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-xs font-black uppercase tracking-widest text-slate-700">
            {isMember ? "Active Member" : "Membership Required"}
          </span>
        </div>
      </section>

      {/* Main Content Area */}
      <section>
        {currentTeam ? (
          <div className="bg-slate-200 p-8 rounded-3xl border-2 border-slate-300 shadow-sm">
            <div className="border-b-2 border-slate-300 pb-4 mb-6">
              <h2 className="text-2xl font-black text-slate-900 uppercase">Team Roster</h2>
              <p className="text-slate-500 font-bold text-sm">Managing: {currentTeam.name}</p>
            </div>
            <TeamManager teamId={currentTeam.id} isOwner={isOwner} />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Invitations Section */}
            <div className="bg-slate-200 p-8 rounded-3xl border-2 border-slate-300 shadow-sm">
              <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">Invitations</h2>
              <div className={!isMember ? 'opacity-40 grayscale pointer-events-none' : ''}>
                <div className="bg-slate-50 rounded-xl p-6 border-2 border-slate-300 border-dashed text-center">
                  <InviteList invitations={invitations || []} isMember={isMember} />
                </div>
              </div>
              {!isMember && (
                <p className="text-[10px] font-bold text-red-500 mt-4 uppercase text-center">Membership required to accept invites</p>
              )}
            </div>

            {/* Create Team Section */}
            <div className="bg-slate-200 p-8 rounded-3xl border-2 border-slate-300 shadow-sm">
              <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">Create Team</h2>
              <div className={!isMember ? 'opacity-40 grayscale pointer-events-none' : ''}>
                {requestRes.data ? (
                  <div className="p-6 bg-blue-100 border-2 border-blue-200 rounded-xl">
                    <p className="text-blue-900 font-black italic uppercase">
                      Request Pending: "{requestRes.data.team_name}"
                    </p>
                  </div>
                ) : (
                  <div className="bg-white p-6 rounded-2xl border-2 border-slate-300 shadow-md">
                    <TeamRequestForm isMember={isMember} />
                  </div>
                )}
              </div>
              {!isMember && (
                <p className="text-[10px] font-bold text-red-500 mt-4 uppercase text-center">Membership required to create a team</p>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Hidden Debug Tool */}
      <details className="mt-20 opacity-30 hover:opacity-100 transition-opacity">
        <summary className="text-[10px] font-mono font-bold text-slate-500 cursor-pointer uppercase tracking-widest">
          Raw Team Data
        </summary>
        <div className="mt-4 bg-slate-900 rounded-xl p-4 font-mono text-[10px] text-emerald-400 border border-slate-800">
          <pre>{JSON.stringify({ membership: membershipRes.data, invitations, request: requestRes.data }, null, 2)}</pre>
        </div>
      </details>
    </div>
  );
}