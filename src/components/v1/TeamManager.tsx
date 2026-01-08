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
        .select(`is_owner, member_id, players:member_id ( name, email )`)
        .eq("team_id", teamId);
      if (data) setMembers(data as any);
    };
    fetchMembers();
  }, [teamId]);

  const handleKick = async (memberId: string) => {
    if (!confirm("Remove this player from the team?")) return;
    await supabase.from("team_members").delete().eq("member_id", memberId).eq("team_id", teamId);
    await supabase.from("players").update({ team_id: null }).eq("id", memberId);
    setMembers(prev => prev.filter(m => m.member_id !== memberId));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Player</th>
            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
            {isOwner && <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {members.map((m) => (
            <tr key={m.member_id}>
              <td className="px-6 py-4">
                <div className="text-sm font-bold text-gray-900">{m.players?.name}</div>
                <div className="text-xs text-gray-500">{m.players?.email}</div>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex px-2 py-1 text-[10px] font-bold rounded-md ${m.is_owner ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                  {m.is_owner ? 'LEADER' : 'MEMBER'}
                </span>
              </td>
              {isOwner && (
                <td className="px-6 py-4 text-right">
                  {!m.is_owner && (
                    <button onClick={() => handleKick(m.member_id)} className="text-xs font-bold text-red-600 hover:text-red-800">
                      Remove
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