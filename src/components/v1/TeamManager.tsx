"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/libs/supabase/client";

interface Member {
  member_id: string;
  is_owner: boolean;
  players: {
    name: string;
    email: string;
  };
}

export default function TeamManager({ teamId, isOwner }: { teamId: string, isOwner: boolean }) {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const { data } = await supabase
        .from("team_members")
        .select(`
          is_owner,
          member_id,
          players:member_id ( name, email )
        `)
        .eq("team_id", teamId);
      
      if (data) setMembers(data as any);
    };
    fetchMembers();
  }, [teamId]);

  const handleKick = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this player?")) return;

    // 1. Remove from junction
    await supabase.from("team_members").delete().eq("member_id", memberId).eq("team_id", teamId);
    // 2. Clear player's current team
    await supabase.from("players").update({ team_id: null }).eq("id", memberId);
    
    setMembers(prev => prev.filter(m => m.member_id !== memberId));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="p-4 text-xs font-black uppercase text-gray-400 tracking-widest">Player</th>
            <th className="p-4 text-xs font-black uppercase text-gray-400 tracking-widest">Role</th>
            {isOwner && <th className="p-4 text-right text-xs font-black uppercase text-gray-400 tracking-widest">Admin</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {members.map((m) => (
            <tr key={m.member_id} className="hover:bg-gray-50 transition-colors">
              <td className="p-4 font-bold text-gray-800">
                {m.players?.name || "Anonymous Assassin"}
                <p className="text-[10px] font-medium text-gray-400 lowercase">{m.players?.email}</p>
              </td>
              <td className="p-4">
                <span className={`text-[10px] font-black px-2 py-1 rounded tracking-tighter ${m.is_owner ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                  {m.is_owner ? 'CAPTAIN' : 'OPERATIVE'}
                </span>
              </td>
              {isOwner && (
                <td className="p-4 text-right">
                  {!m.is_owner && (
                    <button 
                      onClick={() => handleKick(m.member_id)}
                      className="text-red-500 hover:text-red-700 text-[10px] font-black uppercase tracking-tighter"
                    >
                      Kick
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}