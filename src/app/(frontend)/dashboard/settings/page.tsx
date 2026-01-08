// src/app/dashboard/settings/page.tsx
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { loadTranslationsSSR } from "@/utils/loadTranslationsSSR";

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
    .select("name, is_member, teams(name)")
    .eq("id", user?.id)
    .single();

  const teamData = Array.isArray(playerProfile?.teams)
    ? playerProfile?.teams[0]
    : playerProfile?.teams;

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your profile and membership status.</p>
      </div>

      <div className="space-y-6">
        {/* Profile Details */}
        <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Profile</h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {translate("pages.settings.name")}
              </label>
              <input
                type="text"
                value={playerProfile?.name || ""}
                readOnly
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {translate("pages.settings.email")}
              </label>
              <input
                type="email"
                value={user?.email || ""}
                readOnly
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Team</label>
              <input
                type="text"
                value={teamData?.name || "None"}
                readOnly
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Membership Status */}
        <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Membership</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${playerProfile?.is_member ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {playerProfile?.is_member ? "Active" : "Unpaid"}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            Membership is required to participate in official events and teams.
            {playerProfile?.is_member
              ? " Your membership is currently active."
              : " Please complete your payment to unlock team features."}
          </p>
        </div>
      </div>
    </div>
  );
}