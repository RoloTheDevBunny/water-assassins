"use client";

import { ROUTES } from "@/constants/routes-constants";
import { useI18n } from "@/contexts/i18nContext";

type FooterProps = {
  isDashboard?: boolean;
};

export default function Footer({ isDashboard }: FooterProps) {
  const { translate } = useI18n();

  return (
    <>
      {!isDashboard && (
        <footer id="footer" className="py-20 px-4 bg-indigo-600 text-white">
          {/* Top Section */}
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6">
              {translate("pages.home.footer.title")}
            </h2>
            <div className="flex justify-center space-x-4">
              <a
                href={ROUTES.dashboard}
                className="py-3 px-8 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition"
              >
                {translate("pages.home.footer.join")}
              </a>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-12 text-center border-t border-indigo-500 pt-8">
            <div className="flex justify-center space-x-6">
              <a
                href="/terms-and-privacy#privacy-policy"
                className="text-sm hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {translate("pages.home.footer.privacy")}
              </a>

              <a
                href="/terms-and-privacy#terms-of-service"
                className="text-sm hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {translate("pages.home.footer.terms")}
              </a>
            </div>

            <p className="mt-6 text-sm text-gray-300">
              {translate("pages.home.footer.copyright")}
            </p>
          </div>
        </footer>
      )}
    </>
  );
}
