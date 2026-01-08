import { createBrowserClient } from "@supabase/ssr";
import { EmailOtpType } from "@supabase/supabase-js";

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const authClient = {
    async getSession() {
        const { data } = await supabase.auth.getSession();
        return data.session;
    },

    async getUser() {
        const { data } = await supabase.auth.getUser();
        return data.user;
    },

    async signUp(email: string, password: string) {
        return supabase.auth.signUp({ email, password });
    },

    async signIn(email: string, password: string) {
        return supabase.auth.signInWithPassword({ email, password });
    },

    async resendEmail(email: string) {
        return supabase.auth.resend({ email, type: "signup" });
    },

    async confirmEmail(token: string, type: EmailOtpType) {
        return supabase.auth.verifyOtp({ token_hash: token, type });
    },
};