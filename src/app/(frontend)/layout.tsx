import Link from "next/link";
import { ReactNode } from "react";
// Import the provider from the context file seen in your search results
import { I18nProvider } from "@/contexts/i18nContext";

// You should import your translation JSON files here
// Example: import en from "@/locales/en.json";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // Define default values or fetch them based on user settings
  const defaultLocale = "en";
  const translations = {}; // Replace with your actual translation object/file

  return (
    <I18nProvider locale={defaultLocale} translations={translations}>
      <div className="flex min-h-screen bg-[#F9FAFB]">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full">
          <div className="p-6">
            <h2 className="text-xl font-bold tracking-tight text-gray-900">
              Water Assassins
            </h2>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 rounded-lg transition-colors"
            >
              Overview
            </Link>
            <Link
              href="/dashboard/team"
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 rounded-lg transition-colors"
            >
              Team
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 rounded-lg transition-colors"
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

        {/* Main Content */}
        <main className="flex-1 ml-64 min-h-screen">
          <div className="p-8 max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </I18nProvider>
  );
}