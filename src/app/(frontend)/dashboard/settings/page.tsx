import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { loadTranslationsSSR } from "@/utils/loadTranslationsSSR";
import SignOutButton from "@/components/v1/SignOutButton";
import Link from "next/link";

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
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your profile and account preferences.</p>
      </div>

      <div className="space-y-6">
        {/* Profile Details Section */}
        <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Profile</h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input readOnly value={playerProfile?.name || ""} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input readOnly value={user?.email || ""} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-600" />
            </div>
          </div>
        </div>

        {/* Account Actions Section */}
        <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Account</h2>

          <div className="space-y-3">
            {/* Terms & Privacy Link */}
            <Link
              href="/terms-and-privacy"
              className="block w-full px-4 py-3 bg-gray-50 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Terms & Privacy Policy
            </Link>

            {/* Client-side Sign Out Button */}
            <SignOutButton />
          </div>
        </div>
      </div>
    </div>
  );
}