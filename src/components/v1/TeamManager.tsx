"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/libs/supabase/client";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

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
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Find the player by email
      const { data: player, error: playerError } = await supabase
        .from("players")
        .select("id")
        .eq("email", inviteEmail)
        .single();

      if (playerError || !player) {
        alert("Player not found with that email.");
        return;
      }

      // 2. Insert into invitations table
      const { error: inviteError } = await supabase
        .from("invitations")
        .insert({
          team_id: teamId,
          invited_player_id: player.id,
          status: 'pending'
        });

      if (inviteError) throw inviteError;

      alert("Invite sent!");
      setInviteEmail("");
      setIsInviteOpen(false);
    } catch (err) {
      console.error(err);
      alert("Error sending invitation.");
    } finally {
      setLoading(false);
    }
  };

  const handleKick = async (memberId: string) => {
    if (!confirm("Remove this player from the team?")) return;
    await supabase.from("team_members").delete().eq("member_id", memberId).eq("team_id", teamId);
    await supabase.from("players").update({ team_id: null }).eq("id", memberId);
    setMembers(prev => prev.filter(m => m.member_id !== memberId));
  };

  return (
    <div className="relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Header with Plus Button */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Team Members</h3>
        {isOwner && (
          <button
            onClick={() => setIsInviteOpen(true)}
            className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Simple Invite Overlay */}
      {isInviteOpen && (
        <div className="absolute inset-0 z-20 bg-white p-6 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-slate-900">Invite Player</h4>
            <button onClick={() => setIsInviteOpen(false)}>
              <XMarkIcon className="w-6 h-6 text-slate-400" />
            </button>
          </div>
          <form onSubmit={handleInvite} className="space-y-4">
            <input
              type="email"
              placeholder="Player Email"
              required
              className="w-full p-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            <button
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Invitation"}
            </button>
          </form>
        </div>
      )}

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