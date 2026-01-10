"use client";

import { VideoCameraIcon, ClockIcon, CheckBadgeIcon, LockClosedIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { CurrencyDollarIcon } from "@heroicons/react/24/solid";

interface TargetListProps {
    targets: any[];
    isMember: boolean;
    week: number;
    compact: boolean;
}

export default function TargetList({ targets, isMember, week, compact }: TargetListProps) {
    const handleUploadClick = (id: string) => {
        if (!isMember) return;
        alert("Redirecting to video upload for target " + id);
    };

    if (!targets || targets.length === 0) {
        return (
            <div className="p-10 border-2 border-dashed border-slate-200 rounded-3xl text-center">
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest">No targets assigned.</p>
            </div>
        );
    }

    // Sort targets: Current week first, others (past/future) at the bottom
    const sortedTargets = [...targets].sort((a, b) => {
        if (a.week === week && b.week !== week) return -1;
        if (a.week !== week && b.week === week) return 1;
        return b.week - a.week; // Sort by most recent week otherwise
    });

    return (
        <div className="space-y-4">
            {sortedTargets.map((target) => {
                const rawStatus = target.status?.toLowerCase() || 'active';
                const displayStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);

                // Check if this box belongs to the current week
                const isCurrentWeek = target.week === week;

                return (
                    <div
                        key={target.id}
                        className={`p-6 border-2 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm transition-all
                            ${isCurrentWeek
                                ? 'bg-white border-slate-200'
                                : 'bg-slate-50/50 border-slate-100 opacity-60 grayscale-[0.5]'
                            }`}
                    >
                        <div className="mb-4 md:mb-0 w-full">
                            <div className="flex items-center gap-3 mb-1">
                                <div className={`text-xl font-black uppercase italic leading-none ${isCurrentWeek ? 'text-slate-900' : 'text-slate-400'}`}>
                                    {target.target_name}
                                </div>
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-tighter ${!isCurrentWeek ? 'bg-slate-100 text-slate-400 border-slate-200' :
                                        rawStatus === 'active' ? 'bg-sky-50 text-sky-600 border-sky-200' :
                                            rawStatus === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                                rawStatus === 'confirmed' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' :
                                                    rawStatus === 'claimed' ? 'bg-green-50 text-green-600 border-green-200' :
                                                        'bg-red-50 text-red-600 border-red-200'
                                    }`}>
                                    {displayStatus}
                                </span>
                            </div>

                            {!compact && (
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                    Week {target.week} Target {!isCurrentWeek && "(Inactive)"}
                                </div>
                            )}

                            {/* Status Icon and Description */}
                            {!compact && (
                                <div className="mt-4 flex items-start gap-2">
                                    {rawStatus === 'active' && (
                                        <>
                                            <VideoCameraIcon className={`w-4 h-4 mt-0.5 ${isCurrentWeek ? 'text-sky-500' : 'text-slate-300'}`} />
                                            <div>
                                                <p className={`text-[10px] font-black uppercase ${isCurrentWeek ? 'text-slate-900' : 'text-slate-400'}`}>Status: Active</p>
                                                <p className="text-[10px] text-slate-500 font-bold mt-1 leading-tight">Target assigned. Submit your video proof for review.</p>
                                            </div>
                                        </>
                                    )}
                                    {rawStatus === 'pending' && (
                                        <>
                                            <ClockIcon className={`w-4 h-4 mt-0.5 ${isCurrentWeek ? 'text-amber-500' : 'text-slate-300'}`} />
                                            <div>
                                                <p className={`text-[10px] font-black uppercase ${isCurrentWeek ? 'text-slate-900' : 'text-slate-400'}`}>Status: Pending</p>
                                                <p className="text-[10px] text-slate-500 font-bold mt-1 leading-tight">Proof uploaded. Waiting for admin confirmation.</p>
                                            </div>
                                        </>
                                    )}
                                    {rawStatus === 'confirmed' && (
                                        <>
                                            <CheckBadgeIcon className={`w-4 h-4 mt-0.5 ${isCurrentWeek ? 'text-indigo-500' : 'text-slate-300'}`} />
                                            <div>
                                                <p className={`text-[10px] font-black uppercase ${isCurrentWeek ? 'text-slate-900' : 'text-slate-400'}`}>Status: Confirmed</p>
                                                <p className="text-[10px] text-slate-500 font-bold mt-1 leading-tight">Kill verified. Survive to next week to claim.</p>
                                            </div>
                                        </>
                                    )}
                                    {rawStatus === 'claimed' && (
                                        <>
                                            <CurrencyDollarIcon className={`w-4 h-4 mt-0.5 ${isCurrentWeek ? 'text-green-500' : 'text-slate-300'}`} />
                                            <div>
                                                <p className={`text-[10px] font-black uppercase ${isCurrentWeek ? 'text-slate-900' : 'text-slate-400'}`}>Status: Claimed</p>
                                                <p className="text-[10px] text-slate-500 font-bold mt-1 leading-tight">Bounty claimed. You have received $5.</p>
                                            </div>
                                        </>
                                    )}
                                    {rawStatus === 'lost' && (
                                        <>
                                            <XCircleIcon className={`w-4 h-4 mt-0.5 ${isCurrentWeek ? 'text-red-500' : 'text-slate-300'}`} />
                                            <div>
                                                <p className={`text-[10px] font-black uppercase ${isCurrentWeek ? 'text-slate-900' : 'text-slate-400'}`}>Status: Lost</p>
                                                <p className="text-[10px] text-slate-500 font-bold mt-1 leading-tight">Bounty lost. Try to survive next time.</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {!compact && (
                            <div className="w-full md:w-auto flex justify-end">
                                {isCurrentWeek && rawStatus === 'active' && isMember ? (
                                    <button onClick={() => handleUploadClick(target.id)} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase hover:bg-black transition-all shadow-md active:scale-95">
                                        Upload Proof
                                    </button>
                                ) : (
                                    <div className="text-[10px] font-black text-slate-400 uppercase italic">
                                        {isCurrentWeek ? "No Action Required" : "Week Expired"}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}