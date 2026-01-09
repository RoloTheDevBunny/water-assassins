import Link from "next/link";
import { ReactNode } from "react";
import Navbar from "@/components/v1/Navbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen bg-[#f9fafb]">
            {/* 1. Navbar at the very top */}
            <div className="sticky top-0 z-50 w-full">
                <Navbar />
            </div>

            <div className="flex flex-1">
                {/* 2. Sidebar (Adjusted top to account for Navbar height) */}
                <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-[calc(100vh-64px)] z-10">
                    <nav className="flex-1 px-4 py-4 space-y-1">
                        <Link
                            href="/dashboard"
                            className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-indigo-600 rounded-lg transition-colors"
                        >
                            Overview
                        </Link>
                        <Link
                            href="/dashboard/team"
                            className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-indigo-600 rounded-lg transition-colors"
                        >
                            Team
                        </Link>
                        <Link
                            href="/dashboard/settings"
                            className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-indigo-600 rounded-lg transition-colors"
                        >
                            Settings
                        </Link>
                    </nav>

                    <div className="p-4 border-t border-gray-100">
                        <button className="w-full text-left px-4 py-2 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors">
                            Sign Out
                        </button>
                    </div>
                </aside>

                {/* 3. Main Content Area */}
                {/* Added ml-64 to offset the fixed sidebar */}
                <main className="flex-1 ml-64 min-h-screen">
                    <div className="max-w-4xl mx-auto px-6 py-12">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}