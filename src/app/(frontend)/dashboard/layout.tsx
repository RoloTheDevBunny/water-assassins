// src/app/dashboard/layout.tsx
import Link from "next/link";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold tracking-tight text-gray-900">
            Water Assassins
          </h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Link 
            href="/dashboard/team" 
            className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-indigo-600 rounded-lg transition-colors"
          >
            My Team
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

      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}