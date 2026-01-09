import { Poppins } from "next/font/google";

import Toast from "@/components/v1/Toast";
import { DatadogProvider } from "@/contexts/DatadogContext";
import { I18nProvider } from "@/contexts/i18nContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { loadTranslationsSSR } from "@/utils/loadTranslationsSSR";

import Navbar from "@/components/v1/Navbar";

import "@/styles/globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export async function generateStaticParams() {
  return [{ locale: "en-US" }];
}

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const { translate, translations, locale } = await loadTranslationsSSR();

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <title>Water Assassins Dashboard</title>
      </head>
      <body className={poppins.className}>
        {/* Providers */}
        <I18nProvider locale={locale} translations={translations}>
          <DatadogProvider>
            <ToastProvider>
              {children}
              <Toast />
            </ToastProvider>
          </DatadogProvider>
        </I18nProvider>

        {/* Make the privacy link visible for bots that don’t execute JS */}
        <noscript>
          <div style={{ position: "absolute", top: 0, left: 0 }}>
            <a href="https://ahswaterassassins.com/terms-and-privacy#privacy-policy">
              Privacy Policy
            </a>
          </div>
        </noscript>
      </body>
    </html>
  );
}



