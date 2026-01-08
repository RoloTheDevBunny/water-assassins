"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/libs/supabase/client";

export default function TeamManager({ teamId, isOwner }: { teamId: string, isOwner: boolean }) {
  const [members, setMembers] = useState<any[]>([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchMembers = async () => {
      const { data } = await supabase
        .from("players")
        .select("name, email, user_id")
        .eq("team_id", teamId);
      setMembers(data || []);
    };
    fetchMembers();
  }, [teamId]);

  const handleInvite = async () => {
    // 1. Find the player's internal ID via email
    const { data: player } = await supabase.from("players").select("id").eq("email", email).single();
    
    if (!player) {
      alert("No player found with that school email.");
      return;
    }

    // 2. Insert invitation
    const { error } = await supabase.from("invitations").insert({
      team_id: teamId,
      invited_player_id: player.id
    });

    if (error) alert(error.message);
    else {
      alert("Invite sent!");
      setEmail("");
    }
  };

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50 text-xs font-bold uppercase text-gray-400">
          <tr>
            <th className="p-4">Player</th>
            <th className="p-4">Role</th>
            {isOwner && <th className="p-4 text-right">Action</th>}
          </tr>
        </thead>
        <tbody className="divide-y">
          {members.map((m) => (
            <tr key={m.user_id}>
              <td className="p-4 font-medium">{m.name}</td>
              <td className="p-4 text-sm text-gray-500">Member</td>
              {isOwner && (
                <td className="p-4 text-right text-red-500 font-bold cursor-pointer hover:underline text-xs">KICK</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {isOwner && (
        <div className="p-4 bg-indigo-50 border-t flex gap-2">
          <input 
            className="flex-1 p-2 text-sm border rounded" 
            placeholder="Invite by student email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleInvite} className="bg-indigo-600 text-white px-4 py-2 rounded text-xs font-bold">
            SEND INVITE
          </button>
        </div>
      )}
    </div>
  );
}