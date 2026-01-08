"use client";

import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/solid";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/contexts/i18nContext";

export default function SignOutButton() {
    const { signOut } = useAuth();
    const { translate } = useI18n("components.dashboard.navbar.my-account");

    const handleSignOut = async () => {
        await signOut();
        window.location.href = "/"; // Better than reload for a clean exit
    };

    return (
        <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-red-100 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-colors shadow-sm"
        >
            <span>{translate("options.sign-out")}</span>
            <ArrowRightEndOnRectangleIcon className="h-5 w-5" />
        </button>
    );
}