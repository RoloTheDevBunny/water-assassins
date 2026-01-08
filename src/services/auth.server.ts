import { SupabaseClient, Session, User, EmailOtpType } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies as nextCookies } from "next/headers";

// Minimal typed cookie store for Supabase
type CookieStore = {
    get(name: string): string | undefined;
    set(name: string, value: string, options?: { path?: string; maxAge?: number }): void;
    remove(name: string, options?: { path?: string }): void;
};

export default class AuthService {
    private supabase: SupabaseClient;

    // Async factory to create request-scoped service
    static async create(): Promise<AuthService> {
        const cookieStore = await nextCookies(); // Must await

        const typedCookieStore: CookieStore = {
            get: (name: string) => cookieStore.get(name)?.value ?? undefined,
            set: (name: string, value: string, options?: { path?: string; maxAge?: number }) =>
                cookieStore.set({ name, value, ...options }),
            remove: (name: string, options?: { path?: string }) =>
                cookieStore.set({ name, value: "", ...options }),
        };

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: typedCookieStore,
            }
        );

        return new AuthService(supabase);
    }

    private constructor(supabase: SupabaseClient) {
        this.supabase = supabase;
    }

    // -----------------------
    // Auth methods
    // -----------------------
    async getSession(): Promise<Session | null> {
        const { data } = await this.supabase.auth.getSession();
        return data?.session ?? null;
    }

    async getUser(accessToken?: string): Promise<User | null> {
        const { data } = await this.supabase.auth.getUser(accessToken);
        return data?.user ?? null;
    }

    async getUserById(id: string): Promise<User | null> {
        const { data } = await this.supabase.auth.admin.getUserById(id);
        return data?.user ?? null;
    }

    async getUserId(): Promise<string | null> {
        const user = await this.getUser();
        return user?.id ?? null;
    }

    async signUp(email: string, password: string): Promise<User | null> {
        const { data, error } = await this.supabase.auth.signUp({ email, password });
        this.handleError(error);
        return data.user;
    }

    async signIn(email: string, password: string): Promise<User | null> {
        const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
        if (error) {
            await this.resendEmail(email);
            throw error;
        }
        return data.user;
    }

    async confirmEmail(token: string, type: EmailOtpType): Promise<User | null> {
        const { data, error } = await this.supabase.auth.verifyOtp({ token_hash: token, type });
        this.handleError(error);
        return data.user;
    }

    async forgotPassword(email: string): Promise<boolean> {
        const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.NEXT_PUBLIC_PROJECT_URL}/new-password`,
        });
        this.handleError(error);
        return true;
    }

    async updatePassword(password: string): Promise<boolean> {
        const { error } = await this.supabase.auth.updateUser({ password });
        this.handleError(error);
        return true;
    }

    async resendEmail(email: string): Promise<void> {
        const { error } = await this.supabase.auth.resend({ email, type: "signup" });
        this.handleError(error);
    }

    // -----------------------
    // Private helper
    // -----------------------
    private handleError(error: unknown): void {
        if (error) throw error;
    }
}
