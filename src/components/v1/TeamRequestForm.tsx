"use client";

import { useState } from "react";
import { supabase } from "@/libs/supabase/client";

// Define the shape of the props explicitly
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

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Matches the schema in image_bb8912.png where user_id is the UUID
      const { error } = await supabase.from("team_requests").insert({
        user_id: user?.id,
        team_name: name,
      });

      if (error) throw error;

      alert("Request submitted! We will verify your payment and approve the name.");
      window.location.reload();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm space-y-4">
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          Proposed Team Name
        </label>
        <input
          type="text"
          disabled={!isMember}
          placeholder={isMember ? "e.g. Delta Force" : "Pay membership to unlock"}
          className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
      <button 
        type="submit"
        disabled={!isMember || loading}
        className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all shadow-lg ${
          isMember 
            ? 'bg-black text-white hover:bg-gray-800' 
            : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
        }`}
      >
        {loading ? "PROCESSING..." : isMember ? "SUBMIT REQUEST" : "PAYMENT REQUIRED"}
      </button>
    </form>
  );
}