"use client";

import { supabase } from "@/libs/supabase/client";

interface InviteListProps {
  invitations: any[];
  isMember: boolean;
}

export default function InviteList({ invitations, isMember }: InviteListProps) {
  const handleAccept = async (id: string) => {
    if (!isMember) return;

    // Calls the RPC with the specific named argument 'invitation_id'
    const { error } = await supabase.rpc('accept_team_invite', {
      invitation_id: id
    });

    if (error) {
      alert("Error: " + error.message);
    } else {
      // Replaces reload with a more modern feel if you want, 
      // though reload is the safest way to reset all server state
      window.location.reload();
    }
  };

  if (!invitations || invitations.length === 0) {
    return (
      <div className="py-6 text-center">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No active invitations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 w-full">
      {invitations.map((inv) => (
        <div key={inv.id} className="p-5 bg-white border border-slate-200 rounded-2xl flex justify-between items-center shadow-sm">
          <div className="text-left">
            <div className="text-sm font-black text-slate-900 uppercase leading-none">{inv.teams?.name}</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Pending Invitation</div>
          </div>
          <button
            onClick={() => handleAccept(inv.id)}
            disabled={!isMember}
            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all ${isMember
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md active:scale-95'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
          >
            {isMember ? "Join Team" : "Pay to Join"}
          </button>
        </div>
      ))}
    </div>
  );
}