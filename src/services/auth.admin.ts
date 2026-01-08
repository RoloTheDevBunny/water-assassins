// src/services/auth.admin.ts
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getUserById(id: string) {
  const { data } = await supabaseAdmin.auth.admin.getUserById(id);
  return data.user;
}
