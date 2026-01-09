"use client";

import { ROUTES } from "@/constants/routes-constants";
import { useI18n } from "@/contexts/i18nContext";

export default function Footer({ isDashboard }: { isDashboard?: boolean }) {
  const { translate } = useI18n();

  if (isDashboard) return null;

  return (
    <footer className="bg-white pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Links */}
        <div className="mt-16 flex flex-col md:flex-row justify-between items-center border-t border-slate-100 pt-8 gap-6">
          <div className="flex space-x-8">
            <a href="https://ahswaterassassins.com/terms-and-privacy#privacy-policy" className="text-sm font-semibold text-slate-400 hover:text-indigo-600">Privacy</a>
            <a href="https://ahswaterassassins.com/terms-and-privacy#terms-of-service" className="text-sm font-semibold text-slate-400 hover:text-indigo-600">Terms</a>
          </div>
          <p className="text-sm font-semibold text-slate-300">
            {translate("pages.home.footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}