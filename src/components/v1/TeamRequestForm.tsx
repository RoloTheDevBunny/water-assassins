"use client";

import { useState } from "react";
import { supabase } from "@/libs/supabase/client";

export default function TeamRequestForm() {
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase.from("team_requests").insert({
      user_id: user?.id,
      team_name: teamName,
    });

    if (error) alert(error.message);
    else {
      alert("Request submitted for approval!");
      setTeamName("");
      window.location.reload();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Desired Team Name"
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        required
      />
      <button 
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2 rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Request Team Creation"}
      </button>
    </form>
  );
}