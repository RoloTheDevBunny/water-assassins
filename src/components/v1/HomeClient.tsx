// src/app/(frontend)/(home)/_components/HomeClient.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/client";

export default function HomeClient({ children }: { children: React.ReactNode }) {
    const supabase = createClient();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function handleOAuthRedirect() {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                console.error("OAuth error:", error.message);
                setLoading(false);
            } else if (session) {
                router.replace("/dashboard");
            } else {
                setLoading(false);
            }
        }

        if (typeof window !== "undefined" && window.location.search.includes("code=")) {
            handleOAuthRedirect();
        } else {
            setLoading(false);
        }
    }, [router, supabase]);

    // We keep this function so you can still call it from 
    // your Navbar or HeroSection if needed, but we remove the button below.
    const handleGoogleSignIn = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (error) console.error("Login error:", error.message);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center py-20 animate-pulse text-gray-500">
                    Logging you in...
                </div>
            </div>
        );
    }

    return (
        <>
            {children}
            {/* The red button section was removed from here */}
        </>
    );
}