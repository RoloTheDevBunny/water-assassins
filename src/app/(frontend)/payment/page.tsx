import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export const revalidate = 0;

export default async function PaymentOverview() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); } } }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const [playerRes, requestRes] = await Promise.all([
    supabase.from("players").select("*").eq("id", user?.id).single(),
    supabase.from("team_requests").select("*").eq("user_id", user?.id).eq("is_approved", false).maybeSingle(),
  ]);

  const isMember = playerRes.data?.is_member ?? false;
  const hasPendingRequest = !!requestRes.data;

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-20 p-4 text-slate-900">
      <section>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase italic">Payments</h1>
        <p className="text-slate-600 font-bold mt-1">Send your dues via the apps below.</p>
      </section>

      {/* 1. Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-200 p-8 rounded-3xl border-2 border-slate-300 shadow-sm">
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Player Membership</p>
          <p className={`text-3xl font-black mt-2 ${isMember ? 'text-green-700' : 'text-red-600'}`}>
            {isMember ? "$25.00 PAID" : "$25.00 DUE"}
          </p>
        </div>

        <div className="bg-slate-200 p-8 rounded-3xl border-2 border-slate-300 shadow-sm">
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Team Registration</p>
          <p className={`text-3xl font-black mt-2 ${hasPendingRequest ? 'text-blue-700' : 'text-slate-400'}`}>
            {hasPendingRequest ? "$0.00 DUE" : "$0.00"}
          </p>
        </div>
      </div>

      {/* 2. Payment Methods Grid */}
      <section className="space-y-6">
        <div className="bg-amber-50 border-2 border-amber-200 p-4 rounded-2xl">
          <p className="text-xs font-black text-amber-800 uppercase text-center">
            ⚠️ Important: Include your name "({playerRes.data?.name})" in the payment notes so we can verify you!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Venmo */}
          <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mb-4 text-sky-600 font-black">V</div>
            <h3 className="font-black text-slate-900">VENMO</h3>
            <p className="text-sm font-bold text-slate-500 mt-1">@AlecJMacLean</p>
          </div>

          {/* PayPal */}
          <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4 text-indigo-600 font-black">P</div>
            <h3 className="font-black text-slate-900">PAYPAL</h3>
            <p className="text-sm font-bold text-slate-500 mt-1">Agoura Water Assassins: alec@ahswaterassassins.com</p>
          </div>

          {/* Zelle */}
          <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 text-purple-600 font-black">Z</div>
            <h3 className="font-black text-slate-900">ZELLE</h3>
            <p className="text-sm font-bold text-slate-500 mt-1">805-795-1059</p>
          </div>
        </div>
      </section>

      {/* 3. Help Footer */}
      <div className="bg-slate-900 p-8 rounded-3xl text-center">
        <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Verification Process</p>
        <p className="text-white font-bold mt-2">
          Once sent, an admin will verify your payment and update your dashboard within 24 hours.
        </p>
      </div>
    </div>
  );
}