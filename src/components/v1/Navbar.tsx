"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { GetMeBridge } from "@/bridges/getMe";
import { useI18n } from "@/contexts/i18nContext";
import Spinner from "./Spinner";

export default function Navbar() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const { translate } = useI18n();

  useEffect(() => {
    const getUserSession = async () => {
      const getMeBridge = new GetMeBridge();
      const response = await getMeBridge.execute();
      setIsLoading(false);
      setIsLogged(!!response.id);
    };
    getUserSession();
  }, []);

  return (
    <header className="bg-slate-50 border-b-2 border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-5 px-8">

        {/* Logo Section */}
        <div className="flex items-center shrink-0">
          <a href="/" className="flex items-center gap-3 group">
            <div className="p-1 bg-slate-200 rounded-lg border border-slate-300 group-hover:border-slate-400 transition-colors">
              <Image
                src="/logo.ico"
                alt="Logo"
                className="rounded-md"
                width={32}
                height={32}
              />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900 uppercase hidden sm:block">
              Water Assassins
            </span>
          </a>
        </div>

        {/* Spread Navigation Links */}
        <nav className="hidden md:flex items-center space-x-10">
          <a href="/#pricing" className="text-sm font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">
            {translate("components.navbar.pricing")}
          </a>
          <a href="/#faq" className="text-sm font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">
            {translate("components.navbar.faq")}
          </a>
          {/* Added an extra link to show "spread" */}
          <a href="/rules" className="text-sm font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">
            Rules
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-6">
          {isLoading ? (
            <Spinner />
          ) : !isLogged ? (
            <a
              href="/register"
              className="py-2.5 px-6 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-md active:scale-95"
            >
              {translate("components.navbar.try")}
            </a>
          ) : (
            <a
              href="/dashboard"
              className="py-2.5 px-6 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-md active:scale-95 border-2 border-slate-700"
            >
              {translate("components.navbar.dashboard")}
            </a>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 bg-slate-200 border-2 border-slate-300 rounded-lg text-slate-900"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu - High Contrast Style */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-100 border-b-4 border-slate-300 animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col space-y-4 p-8">
            <a href="#pricing" onClick={() => setIsMenuOpen(false)} className="text-lg font-black uppercase tracking-widest text-slate-900">
              {translate("components.navbar.pricing")}
            </a>
            <a href="#faq" onClick={() => setIsMenuOpen(false)} className="text-lg font-black uppercase tracking-widest text-slate-900">
              {translate("components.navbar.faq")}
            </a>
            <hr className="border-slate-300" />
            <div className="pt-2">
              {isLoading ? (
                <Spinner />
              ) : (
                <a
                  href={isLogged ? "/dashboard" : "/register"}
                  className="block w-full text-center py-4 bg-slate-900 text-white font-black uppercase tracking-widest rounded-2xl shadow-lg"
                >
                  {isLogged ? translate("components.navbar.dashboard") : translate("components.navbar.try")}
                </a>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}