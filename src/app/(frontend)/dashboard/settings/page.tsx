// src/app/dashboard/settings/page.tsx
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { loadTranslationsSSR } from "@/utils/loadTranslationsSSR";
import SignOutButton from "@/components/v1/SignOutButton";
import Link from "next/link";

// Ensures fresh data on every visit
export const revalidate = 0;

export default async function Settings() {
  const { translate } = await loadTranslationsSSR();
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); } } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { data: playerProfile } = await supabase
    .from("players")
    .select("name, is_member")
    .eq("id", user?.id)
    .single();

  return (
    <div className="max-w-3xl space-y-10 pb-20 p-4 text-slate-900">
      {/* Header Area */}
      <section>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase">Settings</h1>
        <p className="text-slate-600 font-bold mt-1">Manage your profile and account preferences.</p>

        {/* Membership Quick Status */}
        <div className="mt-6 inline-flex items-center gap-3 px-4 py-2 bg-slate-200 border-2 border-slate-300 rounded-full">
          <div className={`w-3 h-3 rounded-full ${playerProfile?.is_member ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-xs font-black uppercase tracking-widest text-slate-700">
            {playerProfile?.is_member ? "Active Member" : "Non-Member"}
          </span>
        </div>
      </section>

      <div className="space-y-8">
        {/* Profile Details Section: Slate-200 Box */}
        <div className="bg-slate-200 p-8 rounded-3xl border-2 border-slate-300 shadow-sm space-y-6">
          <h2 className="text-2xl font-black text-slate-900 uppercase border-b-2 border-slate-300 pb-2">
            Profile Details
          </h2>

          <div className="grid gap-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                Display Name
              </label>
              {/* Forced dark text and white background for input clarity */}
              <input
                readOnly
                value={playerProfile?.name || ""}
                className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-slate-900 font-bold shadow-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                Account Email
              </label>
              <input
                readOnly
                value={user?.email || ""}
                className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-slate-900 font-bold shadow-sm focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Account Actions Section: Slate-200 Box */}
        <div className="bg-slate-200 p-8 rounded-3xl border-2 border-slate-300 shadow-sm space-y-6">
          <h2 className="text-2xl font-black text-slate-900 uppercase border-b-2 border-slate-300 pb-2">
            Account Management
          </h2>

          <div className="grid gap-4">
            {/* Terms & Privacy Link */}
            <Link
              href="/terms-and-privacy"
              className="flex items-center justify-between w-full px-6 py-4 bg-white border-2 border-slate-300 text-slate-900 rounded-2xl text-sm font-black uppercase hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm"
            >
              Terms & Privacy Policy
              <span className="text-slate-400">→</span>
            </Link>

            {/* Client-side Sign Out Button */}
            <div className="w-full">
              <SignOutButton />
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Debug Footer */}
      <details className="mt-20 opacity-30 hover:opacity-100 transition-opacity">
        <summary className="text-[10px] font-mono font-bold text-slate-500 cursor-pointer uppercase tracking-widest">
          Debug Preferences
        </summary>
        <div className="mt-4 bg-slate-900 rounded-xl p-4 font-mono text-[10px] text-emerald-400 border border-slate-800">
          <pre>{JSON.stringify({ user_metadata: user?.user_metadata, profile: playerProfile }, null, 2)}</pre>
        </div>
      </details>
    </div>
  );
}