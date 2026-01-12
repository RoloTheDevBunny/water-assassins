"use client";

import { useRouter } from "next/navigation";
import { useEffect, useReducer } from "react";
import { supabase } from "@/libs/supabase/client";
import { useI18n } from "@/contexts/i18nContext";
import Spinner from "@/components/v1/Spinner";

type State = {
  isLoading: boolean;
  error: string | null;
  wrongEmail: string | null;
};

const initialState: State = {
  isLoading: true,
  error: null,
  wrongEmail: null,
};

type Action =
  | { type: "SUCCESS" }
  | { type: "FAILURE"; error: string; wrongEmail?: string }
  | { type: "SET_LOADING"; isLoading: boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SUCCESS":
      return { ...state, isLoading: false, error: null, wrongEmail: null };
    case "FAILURE":
      return { ...state, isLoading: false, error: action.error, wrongEmail: action.wrongEmail || null };
    case "SET_LOADING":
      return { ...state, isLoading: action.isLoading };
    default:
      return state;
  }
}

export default function ConfirmSignUp() {
  const { translate } = useI18n("pages.confirm-signup");
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);

    // 1. Check if Supabase sent an error in the URL (Prevents "Database Error" hang)
    const urlError = queryParams.get("error_description") || queryParams.get("error");
    if (urlError) {
      dispatch({
        type: "FAILURE",
        error: "Login Failed: Please ensure you use your student email."
      });
      return;
    }

    const code = queryParams.get("code");
    if (!code) {
      dispatch({ type: "FAILURE", error: translate("errors.missing-token") });
      return;
    }

    // Clean URL to prevent re-runs
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, "", cleanUrl);

    handleOAuthCode(code);
  }, []);

  async function handleOAuthCode(code: string) {
    dispatch({ type: "SET_LOADING", isLoading: true });

    try {
      // Exchange code for session via your API
      const res = await fetch("/api/v1/auth/oauth/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      const user = data?.user;

      // 2. Client-Side Domain Enforcement
      if (!user?.email?.endsWith("@student.lvusd.org")) {
        // Log out immediately to clear local state
        await supabase.auth.signOut();
        await fetch("/api/v1/auth/signout", { method: "POST" });

        dispatch({
          type: "FAILURE",
          error: "Access Denied: You must use a @student.lvusd.org account.",
          wrongEmail: user?.email
        });
        return;
      }

      dispatch({ type: "SUCCESS" });
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Auth Error:", err);
      dispatch({ type: "FAILURE", error: err.message || "An unexpected error occurred." });
    }
  }

  const handleTryAgain = async () => {
    // Clear everything and send back to register/login
    await supabase.auth.signOut();
    router.push("/register");
  };

  if (state.isLoading) {
    return <div className="flex h-screen items-center justify-center"><Spinner /></div>;
  }

  if (state.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <div className="bg-red-50 border border-red-200 p-8 rounded-xl max-w-md shadow-sm">
          <h2 className="text-2xl font-bold text-red-700 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{state.error}</p>
          {state.wrongEmail && (
            <p className="text-sm text-gray-400 mb-6 italic">Logged in as: {state.wrongEmail}</p>
          )}
          {state.error.includes("flow state") ? (
            <a
              href="/dashboard"
              className="block w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-semibold text-center hover:bg-indigo-700 transition"
            >
              Reach Flow State (Dashboard)
            </a>
          ) : (
            <button
              onClick={handleTryAgain}
              className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Sign Out & Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-xl font-medium text-gray-900">Finalizing Sign In...</h2>
    </div>
  );
}