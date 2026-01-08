import { headers, cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { GET as getMeHandler } from "@/app/(backend)/api/v1/me/route";
import SettingsOptions from "@/components/v1/SettingsOptions";
import { capitalize } from "@/utils/capitalize";
import { loadTranslationsSSR } from "@/utils/loadTranslationsSSR";

export default async function Settings() {
  const { translate } = await loadTranslationsSSR();
  
  // 1. Setup Supabase Client
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); } } }
  );

  // 2. Fetch User and Shared Data
  const getMeResponse = await getMeHandler();
  const authData = await getMeResponse.json();
  const sharedData = JSON.parse((await headers()).get("x-shared-data") || "{}");

  // 3. Fetch Unified Player Profile (matches the schema in image_bb8912.png)
  const { data: playerProfile } = await supabase
    .from("players")
    .select("name, is_member")
    .eq("id", authData?.id)
    .single();

  return (
    <div className="max-w-4xl space-y-10">
      <header>
        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-gray-900">
          Agent Profile
        </h1>
        <p className="text-gray-400 font-medium">Manage your operative credentials and subscription.</p>
      </header>

      <main className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Profile Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 border border-gray-100 rounded-2xl shadow-sm space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-indigo-600">Identification</h3>
            
            <div className="grid gap-4">
              {/* Name Field (Drawn from Players Table) */}
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  {translate("pages.settings.name")}
                </label>
                <input
                  type="text"
                  value={playerProfile?.name || authData?.user_metadata?.name || ""}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-bold focus:outline-none"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  {translate("pages.settings.email")}
                </label>
                <input
                  type="email"
                  value={authData?.email}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-bold focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Plan/Billing Options */}
          <div className="bg-white p-8 border border-gray-100 rounded-2xl shadow-sm">
             <SettingsOptions
              currentPlan={capitalize(sharedData.plan)}
              userEmail={authData?.email}
            />
          </div>
        </div>

        {/* Right Column: Status Cards */}
        <div className="space-y-4">
          <div className="bg-black p-6 rounded-2xl text-white shadow-xl">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Membership</p>
            <p className="text-2xl font-black italic uppercase tracking-tight">
              {playerProfile?.is_member ? "Active Operative" : "Restricted Access"}
            </p>
            <div className={`mt-4 h-1 w-full rounded-full ${playerProfile?.is_member ? 'bg-green-500' : 'bg-red-500'}`} />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Assigned ID</p>
            <code className="text-[10px] text-gray-400 break-all">{authData?.id}</code>
          </div>
        </div>
      </main>
    </div>
  );
}