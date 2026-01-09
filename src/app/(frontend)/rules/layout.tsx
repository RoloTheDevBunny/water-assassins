// src/app/rules/layout.tsx
import { ReactNode } from "react";
import Navbar from "@/components/v1/Navbar";

export default function RulesLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-100 pb-20">
            <Navbar />

            <div className="max-w-6xl mx-auto mt-12 px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Sidebar - Spans 3 columns */}
                    <aside className="lg:col-span-3">
                        <div className="bg-slate-200 p-6 rounded-3xl border-2 border-slate-300 shadow-sm sticky top-8">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6 px-2">
                                Table of Contents
                            </h3>
                            <nav className="flex flex-col gap-3">
                                <a href="#basics" className="group flex items-center justify-between px-4 py-3 rounded-xl bg-white border-2 border-slate-300 text-xs font-black uppercase tracking-widest text-slate-900 hover:border-slate-400 transition-all shadow-sm">
                                    The Basics <span>→</span>
                                </a>
                                <a href="#safe-zones" className="group flex items-center justify-between px-4 py-3 rounded-xl bg-slate-100 border-2 border-transparent text-xs font-black uppercase tracking-widest text-slate-500 hover:border-slate-300 hover:text-slate-900 transition-all">
                                    Safe Zones <span>→</span>
                                </a>
                                <a href="#eliminations" className="group flex items-center justify-between px-4 py-3 rounded-xl bg-slate-100 border-2 border-transparent text-xs font-black uppercase tracking-widest text-slate-500 hover:border-slate-300 hover:text-slate-900 transition-all">
                                    Eliminations <span>→</span>
                                </a>
                                <a href="#conduct" className="group flex items-center justify-between px-4 py-3 rounded-xl bg-slate-100 border-2 border-transparent text-xs font-black uppercase tracking-widest text-slate-500 hover:border-slate-300 hover:text-slate-900 transition-all">
                                    Conduct <span>→</span>
                                </a>
                            </nav>

                            <div className="mt-10 p-4 bg-slate-300/50 rounded-2xl border-2 border-slate-300 border-dashed">
                                <p className="text-[10px] font-black text-slate-600 uppercase leading-relaxed text-center">
                                    Questions? <br />
                                    Email alec@ahswaterassassins.com
                                </p>
                            </div>
                        </div>
                    </aside>

                    {/* Rules Content - Spans 9 columns */}
                    <main className="lg:col-span-9">
                        <div className="bg-slate-200 p-10 md:p-16 rounded-[40px] border-2 border-slate-300 shadow-sm text-slate-900">
                            <div className="prose prose-slate prose-xl max-w-none">
                                {children}
                            </div>
                        </div>
                    </main>

                </div>
            </div>
        </div>
    );
}