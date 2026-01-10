"use client";

import { supabase } from "@/libs/supabase/client";
import { VideoCameraIcon, ClockIcon, CheckBadgeIcon, LockClosedIcon } from "@heroicons/react/24/outline";

interface TargetListProps {
    targets: any[];
    isMember: boolean;
}

export default function TargetList({ targets, isMember }: TargetListProps) {

    const handleUploadClick = (id: string) => {
        if (!isMember) return;
        // Logic to open your video upload modal or redirect to a form
        alert("Redirecting to video upload for target " + id);
    };

    if (!targets || targets.length === 0) {
        return (
            <div className="p-10 border-2 border-dashed border-slate-200 rounded-3xl text-center">
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest">No targets assigned for this week.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {targets.map((target) => {
                const status = target.status || 'Active';

                return (
                    <div key={target.id} className="p-6 bg-white border-2 border-slate-200 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm transition-all hover:border-slate-300">
                        <div className="mb-4 md:mb-0">
                            <div className="flex items-center gap-2">
                                <div className="text-lg font-black text-slate-900 uppercase italic leading-none">{target.target_name || target.name}</div>

                                {/* Status Badges */}
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-tighter ${status === 'Active' ? 'bg-sky-50 text-sky-600 border-sky-200' :
                                    status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                        status === 'Confirmed' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' :
                                            status === 'Claimed' ? 'bg-green-50 text-green-600 border-green-200' :
                                                'bg-red-50 text-red-600 border-red-200'
                                    }`}>
                                    {status}
                                </span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Current Objective</div>

                            {/* Detailed Status Text beneath target info */}
                            <div className="mt-4 flex items-start gap-2 max-w-xs">
                                {status === 'Active' && (
                                    <>
                                        <VideoCameraIcon className="w-4 h-4 text-sky-500 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-slate-900 leading-none">Status: Active</p>
                                            <p className="text-[10px] text-slate-500 font-bold mt-1">Target assigned. Submit your video proof for review.</p>
                                        </div>
                                    </>
                                )}
                                {status === 'Pending' && (
                                    <>
                                        <ClockIcon className="w-4 h-4 text-amber-500 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-slate-900 leading-none">Status: Pending</p>
                                            <p className="text-[10px] text-slate-500 font-bold mt-1">Proof uploaded. Waiting for admin confirmation.</p>
                                        </div>
                                    </>
                                )}
                                {status === 'Confirmed' && (
                                    <>
                                        <CheckBadgeIcon className="w-4 h-4 text-indigo-500 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-slate-900 leading-none">Status: Confirmed</p>
                                            <p className="text-[10px] text-slate-500 font-bold mt-1">Kill verified. You must survive to the next week.</p>
                                        </div>
                                    </>
                                )}
                                {status === 'Claimed' && (
                                    <>
                                        <CheckBadgeIcon className="w-4 h-4 text-green-500 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-slate-900 leading-none">Status: Claimed</p>
                                            <p className="text-[10px] text-slate-500 font-bold mt-1">Mission complete. You have advanced.</p>
                                        </div>
                                    </>
                                )}
                                {status === 'Lost' && (
                                    <>
                                        <XCircleIcon className="w-4 h-4 text-red-500 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-slate-900 leading-none">Status: Lost</p>
                                            <p className="text-[10px] text-slate-500 font-bold mt-1">Eliminated. Mission failed.</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="w-full md:w-auto">
                            {!isMember ? (
                                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase">
                                    <LockClosedIcon className="w-4 h-4" /> Locked
                                </div>
                            ) : (
                                <>
                                    {/* ACTIVE: Show Upload Button */}
                                    {status === 'Active' && (
                                        <button
                                            onClick={() => handleUploadClick(target.id)}
                                            className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-tight hover:bg-black transition-all shadow-md active:scale-95"
                                        >
                                            <VideoCameraIcon className="w-4 h-4" />
                                            Upload Kill Video
                                        </button>
                                    )}

                                    {/* All other states show as disabled/status indicators on the right */}
                                    {status !== 'Active' && (
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                                            No Action Required
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function XCircleIcon({ className }: { className?: string }) {
    return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}