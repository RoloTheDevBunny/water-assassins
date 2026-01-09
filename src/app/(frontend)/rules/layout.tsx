// src/app/rules/layout.tsx
import { ReactNode } from "react";

export default function RulesLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-100 pb-20">
            {/* Rules Hero Header - Slate-900 for high impact */}
            <section className="bg-slate-900 text-white py-20 px-8 border-b-8 border-slate-300">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-6xl font-black tracking-tighter uppercase leading-none">
                                The Rules
                            </h1>
                            <p className="text-slate-400 font-bold text-xl mt-4 max-w-xl">
                                Official regulations for AHS Water Assassins. Read them, learn them, or get eliminated.
                            </p>
                        </div>
                        <div className="bg-slate-800 border-2 border-slate-700 p-4 rounded-2xl hidden md:block">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Season Status: <span className="text-green-400">Active</span>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

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
                                    Contact an Admin
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