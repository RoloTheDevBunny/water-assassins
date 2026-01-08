"use client";

import { useState } from "react";
import { supabase } from "@/libs/supabase/client";

interface TeamRequestFormProps {
  isMember: boolean;
}

export default function TeamRequestForm({ isMember }: TeamRequestFormProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMember) return;
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("team_requests").insert({
      user_id: user?.id,
      team_name: name,
    });

    if (error) alert(error.message);
    else {
      alert("Registration request sent.");
      window.location.reload();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Team Name</label>
        <input
          type="text"
          disabled={!isMember}
          placeholder={isMember ? "Enter a name" : "Membership required"}
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-50 disabled:text-gray-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        disabled={!isMember || loading}
        className={`w-full py-2.5 rounded-lg text-sm font-bold transition-all ${isMember ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
      >
        {loading ? "Submitting..." : isMember ? "Submit Registration" : "Payment Required"}
      </button>
    </form>
  );
}