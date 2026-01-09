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
        <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase">Fees & Payments</h1>
        <p className="text-slate-600 font-bold mt-1">Manage your tournament dues</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* CARD 1: PLAYER MEMBERSHIP FEE */}
        <div className="bg-slate-200 p-8 rounded-3xl border-2 border-slate-300 shadow-sm flex flex-col justify-between min-h-[250px]">
          <div>
            <div className="flex justify-between items-start">
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Player Fee</p>
              <span className={`text-[10px] font-black px-2 py-1 rounded border ${isMember ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                {isMember ? "PAID" : "REQUIRED"}
              </span>
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2">$25.00</p>
            <p className="text-sm font-bold text-slate-600 mt-2">Personal membership to join the season.</p>
          </div>

          {!isMember ? (
            <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-black text-sm hover:bg-black transition-all mt-6 uppercase tracking-tight">
              Pay Membership Fee
            </button>
          ) : (
            <div className="mt-6 py-3 px-4 bg-white/50 border border-slate-300 rounded-xl text-center text-xs font-black text-green-700 uppercase">
              ✓ Membership Active
            </div>
          )}
        </div>

        {/* CARD 2: TEAM REGISTRATION FEE */}
        <div className="bg-slate-200 p-8 rounded-3xl border-2 border-slate-300 shadow-sm flex flex-col justify-between min-h-[250px]">
          <div>
            <div className="flex justify-between items-start">
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Team Fee</p>
              {hasPendingRequest && (
                <span className="text-[10px] font-black px-2 py-1 rounded border bg-blue-100 text-blue-700 border-blue-200">
                  AWAITING PAYMENT
                </span>
              )}
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2">$10.00</p>
            <p className="text-sm font-bold text-slate-600 mt-2">
              {hasPendingRequest 
                ? `Required for team: ${requestRes.data.team_name}` 
                : "Only required if you are starting a new team."}
            </p>
          </div>

          {hasPendingRequest ? (
            <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-black text-sm hover:bg-indigo-700 transition-all mt-6 uppercase tracking-tight shadow-md">
              Pay Team Fee
            </button>
          ) : (
            <div className="mt-6 py-3 px-4 border border-dashed border-slate-400 rounded-xl text-center text-xs font-bold text-slate-500 uppercase">
              No Pending Team Requests
            </div>
          )}
        </div>

      </div>

      <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        Secure payments powered by Stripe. Fees are non-refundable once the season begins.
      </p>
    </div>
  );
}