"use client";

import { supabase } from "@/libs/supabase/client";

interface TargetListProps {
    targets: any[];
    isMember: boolean;
}

export default function TargetList({ targets, isMember }: TargetListProps) {
    const handleAccept = async (id: string) => {
        if (!isMember) return;
        const { error } = await supabase.rpc('accept_team_invite', { invitation_id: id });
        if (error) alert(error.message);
        else window.location.reload();
    };

    if (!targets || targets.length === 0) {
        return (
            <div className="p-6 border border-gray-200 rounded-xl bg-gray-50 text-center">
                <p className="text-gray-400 text-sm italic">No active targets.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {targets.map((target) => (
                <div key={target.id} className="p-4 bg-white border border-gray-200 rounded-xl flex justify-between items-center shadow-sm">
                    <div>
                        <div className="text-sm font-bold text-gray-900">{target.name}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Target</div>
                    </div>
                    <button
                        onClick={() => handleAccept(target.id)}
                        disabled={!isMember}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${isMember ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm' : 'bg-gray-100 text-gray-400'
                            }`}
                    >
                        {isMember ? "Join Team" : "Locked"}
                    </button>
                </div>
            ))}
        </div>
    );
}