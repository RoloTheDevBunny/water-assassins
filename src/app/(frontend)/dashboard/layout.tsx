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
        {/* 2. Sidebar: hidden on mobile (hidden), shown on tablet/desktop (md:flex) */}
        <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col fixed h-[calc(100vh-64px)] z-10">
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
              href="/dashboard/targets"
              className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-indigo-600 rounded-lg transition-colors"
            >
              Targets
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
        {/* Changed ml-64 to md:ml-64 so it only offsets on larger screens */}
        <main className="flex-1 md:ml-64 min-h-screen w-full overflow-x-hidden">
          <div className="max-w-5xl mx-auto px-4 py-8 md:px-8 md:py-12">
            {children}
          </div>
        </main>
      </div>

      {/* 4. Mobile Bottom Navigation (Optional but recommended for mobile UX) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-around z-50">
        <Link href="/dashboard" className="text-xs font-bold uppercase text-slate-500">Overview</Link>
        <Link href="/dashboard/team" className="text-xs font-bold uppercase text-slate-500">Team</Link>
        <Link href="/dashboard/targets" className="text-xs font-bold uppercase text-slate-500">Targets</Link>
        <Link href="/dashboard/settings" className="text-xs font-bold uppercase text-slate-500">Settings</Link>
      </div>
    </div>
  );
}