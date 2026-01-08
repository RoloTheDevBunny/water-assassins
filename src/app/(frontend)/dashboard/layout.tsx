// src/app/dashboard/layout.tsx
import Link from "next/link";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Persistent Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full">
        <div className="p-8">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-indigo-600">
            ASSASSINS
          </h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <Link 
            href="/dashboard" 
            className="block px-4 py-3 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
          >
            Overview
          </Link>
          <Link 
            href="/dashboard/team" 
            className="block px-4 py-3 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
          >
            My Team
          </Link>
          <Link 
            href="/dashboard/settings" 
            className="block px-4 py-3 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
          >
            Settings
          </Link>
        </nav>

        <div className="p-6 border-t border-gray-100">
           <button className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600">
             Abort Mission (Sign Out)
           </button>
        </div>
      </aside>

      {/* Main Page Content */}
      <main className="flex-1 ml-64 p-10">
        {children}
      </main>
    </div>
  );
}