"use client";

import { LockClosedIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

import { useI18n } from "@/contexts/i18nContext";
import { useModal } from "@/contexts/ModalContext";
import { getMyInvites } from "@/libs/supabase/services"; // Import the service

type Tab = {
    name: string;
    href: string;
    requiredPlan: "global" | "member" | "team";
};

const tabs: Tab[] = [
    { name: "Global", href: "/Global", requiredPlan: "global" },
    { name: "Individual", href: "/Individual", requiredPlan: "member" },
    { name: "Team", href: "/Team", requiredPlan: "team" },
];

type MenuProps = {
    activePlan: "global" | "member" | "team";
    onTabChange: (activeTab: string) => void;
};

export function Menu({ activePlan, onTabChange }: MenuProps) {
    const [activeTab, setActiveTab] = useState("");
    const [inviteCount, setInviteCount] = useState(0); // State for the badge
    const { openModal } = useModal();
    const { translate } = useI18n();

    const isTabAvailable = (requiredPlan: string): boolean => {
        const levels = ["global", "member", "team"];
        const userLevelIndex = levels.indexOf(activePlan);
        const requiredIndex = levels.indexOf(requiredPlan);
        return userLevelIndex >= requiredIndex;
    };

    const availableTabs = tabs.filter((tab) => isTabAvailable(tab.requiredPlan));

    // 1. Fetch Invite Count on Load
    useEffect(() => {
        const fetchInvites = async () => {
            try {
                const invites = await getMyInvites();
                setInviteCount(invites.length);
            } catch (err) {
                console.error("Failed to fetch invites:", err);
            }
        };
        fetchInvites();
    }, []);

    useEffect(() => {
        if (availableTabs.length > 0 && !activeTab) {
            setActiveTab(availableTabs[0].href);
        } else if (availableTabs.length === 0) {
            openModal();
        }
    }, [availableTabs, activeTab, openModal]);

    useEffect(() => {
        if (activeTab) {
            onTabChange(activeTab);
        }
    }, [activeTab, onTabChange]);

    return (
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="flex justify-center space-x-8 py-4 items-center">
                {tabs.map((tab) => {
                    const available = isTabAvailable(tab.requiredPlan);
                    const isTeamTab = tab.name === "Team";

                    return (
                        <li key={tab.name} className="relative group">
                            <button
                                onClick={() => available && setActiveTab(tab.href)}
                                className="flex items-center rounded-md relative"
                                disabled={!available}
                            >
                                <p
                                    className={`text-sm font-medium rounded-md transition ${activeTab === tab.href ? "text-indigo-600 font-extrabold" : "text-gray-700"} ${!available ? "cursor-not-allowed opacity-50" : ""}`}
                                >
                                    {translate(tab.name)}
                                </p>

                                {/* 2. Notification Badge for Team Invites */}
                                {isTeamTab && inviteCount > 0 && (
                                    <span className="absolute -top-2 -right-3 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                        {inviteCount}
                                    </span>
                                )}

                                {!available && (
                                    <LockClosedIcon
                                        className="h-5 w-5 ml-2 text-gray-500" // Moved ml-2 to the right of text
                                        aria-hidden="true"
                                    />
                                )}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}