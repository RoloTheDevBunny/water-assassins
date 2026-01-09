// src/app/rules/page.tsx

export default function RulesPage() {
    return (
        <div className="space-y-12">
            {/* Section 1: The Basics */}
            <section id="basics" className="scroll-mt-10">
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-6">
                    01. The Basics
                </h2>
                <div className="space-y-4 text-slate-700 font-medium leading-relaxed">
                    <p>
                        Water Assassins is a game of skill, stealth, and persistence. Every player is assigned a target.
                        Your goal is to eliminate your target using water while avoiding being eliminated by the player hunting you.
                    </p>
                    <ul className="list-none space-y-3">
                        {[
                            "Eliminations must be made with clean water only.",
                            "Once you eliminate a target, you inherit their target.",
                            "The game continues until only one player or team remains."
                        ].map((rule, i) => (
                            <li key={i} className="flex items-start gap-3 p-4 bg-white border-2 border-slate-300 rounded-2xl shadow-sm">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white text-[10px] font-black flex items-center justify-center">
                                    {i + 1}
                                </span>
                                {rule}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Section 2: Safe Zones */}
            <section id="safe-zones" className="scroll-mt-10 pt-6 border-t-2 border-slate-300">
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-6">
                    02. Safe Zones
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 bg-red-50 border-2 border-red-200 rounded-2xl">
                        <h4 className="font-black text-red-700 uppercase text-xs tracking-widest mb-2">Strictly Forbidden</h4>
                        <p className="text-sm text-red-900 font-bold">Inside school buildings, places of worship, and moving vehicles are strictly off-limits.</p>
                    </div>
                    <div className="p-6 bg-green-50 border-2 border-green-200 rounded-2xl">
                        <h4 className="font-black text-green-700 uppercase text-xs tracking-widest mb-2">Active Zones</h4>
                        <p className="text-sm text-green-900 font-bold">Public parks, sidewalks, and residential driveways are fair game.</p>
                    </div>
                </div>
            </section>

            {/* Section 3: Conduct */}
            <section id="conduct" className="scroll-mt-10 pt-6 border-t-2 border-slate-300">
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-6">
                    03. Conduct
                </h2>
                <div className="bg-slate-900 text-slate-100 p-8 rounded-3xl shadow-xl">
                    <p className="text-lg font-bold italic mb-4">"Play hard, but don't be a jerk."</p>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Safety is our priority. Trespassing, reckless driving, or harassment will result in an immediate
                        lifetime ban from all future seasons. Respect the community and the game.
                    </p>
                </div>
            </section>
        </div>
    );
}