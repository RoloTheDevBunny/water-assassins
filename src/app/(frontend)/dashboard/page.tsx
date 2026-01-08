// src/app/dashboard/page.tsx
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export default async function DashboardOverview() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); } } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { data: player } = await supabase
    .from("players")
    .select("*, teams(name)")
    .eq("id", user?.id)
    .single();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-gray-900">
          Agent Briefing
        </h1>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em]">
          ID: {user?.id?.slice(0, 8)}...
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Membership Status */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Membership</p>
          <p className={`text-xl font-bold ${player?.is_member ? 'text-green-600' : 'text-red-600'}`}>
            {player?.is_member ? 'ACTIVE DUTY' : 'UNPAID'}
          </p>
        </div>

        {/* Team Status */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Current Unit</p>
          <p className="text-xl font-bold text-gray-900 uppercase">
            {player?.teams?.name || 'LONE WOLF'}
          </p>
        </div>

        {/* Join Date */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Enlisted</p>
          <p className="text-xl font-bold text-gray-900 uppercase">
            {new Date(player?.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}