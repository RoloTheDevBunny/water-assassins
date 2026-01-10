"use client";

import { VideoCameraIcon, ClockIcon, CheckBadgeIcon, LockClosedIcon, XCircleIcon } from "@heroicons/react/24/outline";

interface TargetListProps {
    targets: any[];
    isMember: boolean;
}

export default function TargetList({ targets, isMember }: TargetListProps) {
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

    return (
        <div className="space-y-4">
            {targets.map((target) => {
                // Convert DB lowercase status to display case
                const rawStatus = target.status?.toLowerCase() || 'active';
                const displayStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);

                return (
                    <div key={target.id} className="p-6 bg-white border-2 border-slate-200 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm">
                        <div className="mb-4 md:mb-0 w-full">
                            <div className="flex items-center gap-3 mb-1">
                                {/* This displays the name passed from the formattedTargets in page.tsx */}
                                <div className="text-xl font-black text-slate-900 uppercase italic leading-none">
                                    {target.target_name}
                                </div>

                                <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-tighter ${rawStatus === 'active' ? 'bg-sky-50 text-sky-600 border-sky-200' :
                                    rawStatus === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                        rawStatus === 'confirmed' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' :
                                            rawStatus === 'claimed' ? 'bg-green-50 text-green-600 border-green-200' :
                                                'bg-red-50 text-red-600 border-red-200'
                                    }`}>
                                    {displayStatus}
                                </span>
                            </div>

                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Target</div>

                            {/* Status Icon and Description */}
                            <div className="mt-4 flex items-start gap-2">
                                {rawStatus === 'active' && (
                                    <>
                                        <VideoCameraIcon className="w-4 h-4 text-sky-500 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-slate-900">Status: Active</p>
                                            <p className="text-[10px] text-slate-500 font-bold mt-1">Target assigned. Submit your video proof for review.</p>
                                        </div>
                                    </>
                                )}
                                {rawStatus === 'pending' && (
                                    <>
                                        <ClockIcon className="w-4 h-4 text-amber-500 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-slate-900">Status: Pending</p>
                                            <p className="text-[10px] text-slate-500 font-bold mt-1">Proof uploaded. Waiting for admin confirmation.</p>
                                        </div>
                                    </>
                                )}
                                {rawStatus === 'confirmed' && (
                                    <>
                                        <CheckBadgeIcon className="w-4 h-4 text-indigo-500 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-slate-900">Status: Confirmed</p>
                                            <p className="text-[10px] text-slate-500 font-bold mt-1">Kill verified. You must survive to the next week to claim.</p>
                                        </div>
                                    </>
                                )}
                                {rawStatus === 'lost' && (
                                    <>
                                        <XCircleIcon className="w-4 h-4 text-red-500 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-slate-900">Status: Lost</p>
                                            <p className="text-[10px] text-slate-500 font-bold mt-1">Bounty lost. Try to survive next time.</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="w-full md:w-auto flex justify-end">
                            {rawStatus === 'active' && isMember ? (
                                <button onClick={() => handleUploadClick(target.id)} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase hover:bg-black transition-all">
                                    Upload Proof
                                </button>
                            ) : (
                                <div className="text-[10px] font-black text-slate-400 uppercase italic">No Action Required</div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}