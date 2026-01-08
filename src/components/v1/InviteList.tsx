"use client";

import { supabase } from "@/libs/supabase/client";

// Define the shape of the props explicitly
interface InviteListProps {
  invitations: any[];
  isMember: boolean;
}

export default function InviteList({ invitations, isMember }: InviteListProps) {
  const handleAccept = async (invitationId: string) => {
    // Safety check: block execution if not a member
    if (!isMember) return;

    try {
      // Standardized UUID call to the database function
      const { error } = await supabase.rpc('accept_team_invite', { 
        invitation_id: invitationId 
      });

      if (error) throw error;
      window.location.reload();
    } catch (err: any) {
      alert(err.message || "Failed to join team.");
    }
  };

  if (!invitations || invitations.length === 0) {
    return (
      <div className="p-10 border-2 border-dashed border-gray-200 rounded-xl text-center">
        <p className="text-gray-400 text-sm font-medium italic">No invites found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {invitations.map((inv) => (
        <div key={inv.id} className="p-4 bg-white border border-gray-100 rounded-xl flex justify-between items-center shadow-sm">
          <div>
            <p className="font-bold text-gray-900 text-lg">{inv.teams?.name}</p>
            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest text-wrap">Recruitment Offer</p>
          </div>
          <button 
            onClick={() => handleAccept(inv.id)}
            disabled={!isMember}
            className={`px-6 py-2 rounded-lg text-xs font-black uppercase transition-all ${
              isMember 
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isMember ? "Join Team" : "Locked"}
          </button>
        </div>
      ))}
    </div>
  );
}