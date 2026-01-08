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
    { 
      cookies: { 
        getAll() { return cookieStore.getAll(); } 
      } 
    }
  );

  // 2. Fetch User and Shared Data
  const getMeResponse = await getMeHandler();
  const authData = await getMeResponse.json();
  const sharedData = JSON.parse((await headers()).get("x-shared-data") || "{}");

  // 3. Fetch Player Profile using the unified UUID
  // Note: We use .single() to tell Supabase we expect one row
  const { data: playerProfile } = await supabase
    .from("players")
    .select(`
      name, 
      is_member, 
      teams ( name )
    `)
    .eq("id", authData?.id)
    .single();

  // Fix for the Type Error: access the first element if it's an array, 
  // or handle it if it's a single object (depends on your specific Supabase version/types)
  const teamData = Array.isArray(playerProfile?.teams) 
    ? playerProfile?.teams[0] 
    : playerProfile?.teams;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your account and subscription details.</p>
      </div>

      <div className="space-y-6">
        {/* Profile Details Section */}
        <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Profile</h2>
          
          <div className="grid gap-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {translate("pages.settings.name")}
              </label>
              <input
                type="text"
                value={playerProfile?.name || authData?.user_metadata?.name || ""}
                readOnly
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-600 focus:outline-none"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {translate("pages.settings.email")}
              </label>
              <input
                type="email"
                value={authData?.email}
                readOnly
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-600 focus:outline-none"
              />
            </div>

            {/* Team Display - Fixed logic here */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Team
              </label>
              <input
                type="text"
                value={teamData?.name || "None"}
                readOnly
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Membership & Subscription Section */}
        <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Subscription</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${playerProfile?.is_member ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {playerProfile?.is_member ? "Active" : "Unpaid"}
            </span>
          </div>
          
          <SettingsOptions
            currentPlan={capitalize(sharedData.plan)}
            userEmail={authData?.email}
          />
        </div>
      </div>
    </div>
  );
}