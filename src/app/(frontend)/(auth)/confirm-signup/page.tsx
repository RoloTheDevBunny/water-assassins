"use client";

import { useRouter } from "next/navigation";
import { useEffect, useReducer } from "react";

import BackLink from "@/components/v1/BackLink";
import Spinner from "@/components/v1/Spinner";
import { useI18n } from "@/contexts/i18nContext";
import { supabase } from "@/libs/supabase/client";

type State = {
  isLoading: boolean;
  error: string | null;
};

const initialState: State = {
  isLoading: true,
  error: null,
};

type Action =
  | { type: "SUCCESS" }
  | { type: "FAILURE"; error: string }
  | { type: "SET_LOADING"; isLoading: boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SUCCESS":
      return { ...state, isLoading: false, error: null };
    case "FAILURE":
      return { ...state, isLoading: false, error: action.error };
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
    const code = queryParams.get("code");

    if (code) {
      handleOAuthCode(code);
    } else {
      dispatch({
        type: "FAILURE",
        error: translate("errors.missing-token"),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleOAuthCode(code: string) {
    dispatch({ type: "SET_LOADING", isLoading: true });

    try {
      // Exchange the code for a session on the backend
      const res = await fetch("/api/v1/auth/oauth/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      console.log("OAuth callback response:", data);

      const user = data?.user;

      // Log all user info for debugging
      console.log("Full user object:", user);

      if (!user?.email) {
        throw new Error("Could not determine user email from OAuth response");
      }

      // Domain restriction
      if (!user.email.endsWith("@student.lvusd.org")) {
        // Fully clear client session
        await supabase.auth.signOut();

        // Optionally call backend signout if needed
        await fetch("/api/v1/auth/signout", { method: "POST" });

        throw new Error(
          "Please sign in with an @student.lvusd.org account. Your email is: " +
          user.email
        );
      }

      dispatch({ type: "SUCCESS" });
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("ConfirmSignUp error:", err);
        dispatch({ type: "FAILURE", error: err.message });
      } else {
        dispatch({ type: "FAILURE", error: translate("errors.unexpected") });
      }
    }
  }

  const { isLoading, error } = state;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <SuccessMessage />
      )}
    </div>
  );
}

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="text-red-600 text-center">
    <h2 className="text-2xl font-semibold">{message}</h2>
  </div>
);

const SuccessMessage = () => {
  const { translate } = useI18n("pages.confirm-signup");
  return (
    <div className="text-center">
      <BackLink href="/dashboard" label={translate("actions.dashboard")} />
      <h2 className="text-2xl font-semibold text-gray-900 mt-4">
        {translate("messages.success.title")}
      </h2>
      <p className="text-sm text-gray-600 mt-2">
        {translate("messages.success.description")}
      </p>
    </div>
  );
};
