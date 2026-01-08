import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Dashboard as DashboardContainer } from "@/components/v1/Dashboard";
import { ModalProvider } from "@/contexts/ModalContext";

export default async function Dashboard() {
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

  // 1. Get the current user
  const { data: { user } } = await supabase.auth.getUser();

  // 2. Fetch the player status and check if they own any teams
  // We use .maybeSingle() to avoid errors if the player record doesn't exist yet
  const { data: playerData } = await supabase
    .from('players')
    .select('is_member, team_members(is_owner)')
    .eq('user_id', user?.id)
    .maybeSingle();

  // 3. Map the database values to your existing "plan" logic for the UI
  let calculatedPlan: "global" | "member" | "team" = "global";

  if (playerData?.is_member) {
    calculatedPlan = "member";
  }

  // Check if any record in team_members for this user has is_owner = true
  const hasOwnership = playerData?.team_members?.some((m: any) => m.is_owner);
  if (hasOwnership) {
    calculatedPlan = "team";
  }

  return (
    <ModalProvider>
      <div className="bg-white border-b border-gray-200">
        {/* We pass the calculated plan so your UI still functions exactly the same */}
        <DashboardContainer plan={calculatedPlan} />
      </div>
    </ModalProvider>
  );
}