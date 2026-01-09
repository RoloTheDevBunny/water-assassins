"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/libs/supabase/client";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface RosterItem {
  id: string; // member_id or invite_id
  name: string;
  email: string;
  role: string;
  status: 'active' | 'invited';
}

export default function TeamManager({ teamId, isOwner }: { teamId: string, isOwner: boolean }) {
  const [roster, setRoster] = useState<RosterItem[]>([]);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchRoster = async () => {
    // Fetch actual members and pending invites in parallel
    const [membersRes, invitesRes] = await Promise.all([
      supabase.from("team_members").select(`is_owner, member_id, players:member_id ( name, email )`).eq("team_id", teamId),
      supabase.from("invitations").select(`id, invited_player_id, players:invited_player_id ( name, email )`).eq("team_id", teamId).eq("status", "pending")
    ]);

    const formattedMembers: RosterItem[] = (membersRes.data || []).map((m: any) => ({
      id: m.member_id,
      name: m.players?.name,
      email: m.players?.email,
      role: m.is_owner ? 'LEADER' : 'MEMBER',
      status: 'active'
    }));

    const formattedInvites: RosterItem[] = (invitesRes.data || []).map((i: any) => ({
      id: i.id,
      name: i.players?.name || "Pending Account",
      email: i.players?.email,
      role: 'INVITED',
      status: 'invited'
    }));

    setRoster([...formattedMembers, ...formattedInvites]);
  };

  useEffect(() => { fetchRoster(); }, [teamId]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const emailClean = inviteEmail.trim().toLowerCase();

      // 1. Find the player
      const { data: player } = await supabase.from("players").select("id, team_id").eq("email", emailClean).maybeSingle();

      if (!player) return alert("Player not found.");
      if (player.team_id) return alert("Player is already on a team.");

      // 2. Prevent Duplicate Invites
      const { data: existingInvite } = await supabase
        .from("invitations")
        .select("id")
        .eq("team_id", teamId)
        .eq("invited_player_id", player.id)
        .eq("status", "pending")
        .maybeSingle();

      if (existingInvite) return alert("An invite has already been sent to this player.");

      // 3. Send Invite
      await supabase.from("invitations").insert({
        team_id: teamId,
        invited_player_id: player.id,
        status: 'pending'
      });

      setIsInviteOpen(false);
      setInviteEmail("");
      fetchRoster(); // Refresh list to show "Invited" status
    } catch (err) {
      alert("Error sending invite: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
        <h3 className="text-xs font-black text-slate-900 uppercase">Roster</h3>
        {isOwner && (
          <button onClick={() => setIsInviteOpen(true)} className="p-1.5 bg-indigo-600 text-white rounded-lg">
            <PlusIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {isInviteOpen && (
        <div className="absolute inset-0 z-30 bg-white p-6 flex flex-col justify-center">
          {/* ... Form Logic Same as Previous Response ... */}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <tbody className="divide-y divide-gray-200">
            {roster.map((person) => (
              <tr key={person.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-black text-gray-900">{person.name}</div>
                  <div className="text-[10px] text-gray-400">{person.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-0.5 text-[9px] font-black rounded border ${person.status === 'invited' ? 'bg-slate-100 text-slate-500 border-slate-200' :
                    person.role === 'LEADER' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                    {person.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}