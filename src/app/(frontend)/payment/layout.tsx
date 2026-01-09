import Link from "next/link";
import { ReactNode } from "react";
import Navbar from "@/components/v1/Navbar";

export default function PaymentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#f9fafb]">
      {/* 1. Navbar at the very top */}
      <div className="sticky top-0 z-50 w-full">
        <Navbar />
      </div>

      <div className="flex flex-1">
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
        <Link href="/dashboard/settings" className="text-xs font-bold uppercase text-slate-500">Settings</Link>
      </div>
    </div>
  );
}