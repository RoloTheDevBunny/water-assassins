"use client";
import { supabase } from "@/libs/supabase/client";

export function InviteList({ invitations, isMember }: { invitations: any[], isMember: boolean }) {
  const handleAccept = async (inviteId: string) => {
    if (!isMember) {
      alert("You must pay your membership fee before joining a team.");
      return;
    }

    const { error } = await supabase.rpc('accept_team_invite', { invitation_id: inviteId });

    if (error) alert(error.message);
    else window.location.reload();
  };

  if (invitations.length === 0) return <p className="text-gray-400 text-sm">No invites found.</p>;

  return (
    <div className="space-y-3">
      {invitations.map((inv) => (
        <div key={inv.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="font-semibold text-sm">{inv.teams.name}</span>
          <button 
            onClick={() => handleAccept(inv.id)}
            className="bg-indigo-600 text-white px-4 py-1 rounded text-xs font-bold hover:bg-indigo-700"
          >
            ACCEPT
          </button>
        </div>
      ))}
    </div>
  );
}