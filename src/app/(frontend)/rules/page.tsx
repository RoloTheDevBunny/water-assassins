// src/app/(frontend)/rules/page.tsx

export default function RulesPage() {
    const rules = [
        "Eliminations must be made with clean water only.",
        "Once you eliminate a target, you inherit their target.",
        "The game continues until only one player or team remains."
    ];

    return (
        <div className="flex flex-col gap-16">
            {/* 01. The Basics */}
            <section id="basics" className="scroll-mt-24">
                <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight mb-8">
                    Come back later
                </h1>
                
                {/* <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight mb-8">
                    01. The Basics
                </h2>
                <div className="space-y-6">
                    <p className="text-lg text-slate-700 font-medium leading-relaxed">
                        Water Assassins is a game of skill, stealth, and persistence. Every player is assigned a target.
                        Your goal is to eliminate your target using water while avoiding being eliminated by the player hunting you.
                    </p>
                    <div className="grid gap-4">
                        {rules.map((rule, i) => (
                            <div key={i} className="flex items-center gap-4 p-5 bg-white border-2 border-slate-300 rounded-2xl shadow-sm">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-900 text-white text-xs font-black flex items-center justify-center">
                                    {i + 1}
                                </span>
                                <span className="text-slate-800 font-bold">{rule}</span>
                            </div>
                        ))}
                    </div>
                </div> */}
            </section>

            {/* 02. Safe Zones */}
            {/* <section id="safe-zones" className="scroll-mt-24 pt-10 border-t-2 border-slate-300">
                <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight mb-8">
                    02. Safe Zones
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-8 bg-red-50 border-2 border-red-200 rounded-3xl">
                        <h4 className="font-black text-red-700 uppercase text-sm tracking-widest mb-4">Strictly Forbidden</h4>
                        <p className="text-slate-900 font-bold leading-relaxed">
                            Inside school buildings, places of worship, and moving vehicles are strictly off-limits.
                            Violation results in immediate disqualification.
                        </p>
                    </div>
                    <div className="p-8 bg-green-50 border-2 border-green-200 rounded-3xl">
                        <h4 className="font-black text-green-700 uppercase text-sm tracking-widest mb-4">Active Zones</h4>
                        <p className="text-slate-900 font-bold leading-relaxed">
                            Public parks, sidewalks, and residential driveways are fair game. Always remain aware of your surroundings.
                        </p>
                    </div>
                </div>
            </section> */}

            {/* 03. Conduct */}
            {/* <section id="conduct" className="scroll-mt-24 pt-10 border-t-2 border-slate-300">
                <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight mb-8">
                    03. Conduct
                </h2>
                <div className="bg-slate-900 text-slate-100 p-10 rounded-[40px] shadow-2xl border-b-8 border-slate-800">
                    <p className="text-2xl font-black italic mb-6 text-white uppercase tracking-tighter">
                        "Play hard, but don't be a jerk."
                    </p>
                    <p className="text-slate-400 font-medium leading-relaxed">
                        Safety is our absolute priority. Trespassing on private property (where you don't have permission),
                        reckless driving, or any form of harassment will result in an immediate lifetime ban.
                        Respect the community and the spirit of the game.
                    </p>
                </div>
            </section> */}
        </div>
    );
}