import { supabase } from './client';

// --- 1. Database Types ---
// Matches the schema from your diagram
export type Player = {
  id: number;
  user_id: string;
  team_id: number | null;
  name: string | null;
  email: string | null;
  is_member: boolean;
  created_at: string;
};

export type Team = {
  id: number;
  name: string;
  owner_id: string;
  targets: any;
  profit: number;
  created_at: string;
};

// --- 2. Core Service Functions ---

/**
 * Gets the current logged-in user's player profile and membership status.
 */
export const getMyProfile = async (): Promise<Player | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) return null;
  return data as Player;
};

/**
 * Searches for a player by email. 
 * Use this in your UI to find who to invite to a team.
 */
export const findPlayerByEmail = async (email: string): Promise<Player | null> => {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('email', email)
    .single();

  if (error) return null;
  return data as Player;
};

/**
 * Submits a request to create a team. 
 * You will manually approve this in the DB after they pay you directly.
 */
export const requestNewTeam = async (teamName: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Authentication required");

  const { error } = await supabase
    .from('team_requests')
    .insert([{ user_id: user.id, desired_team_name: teamName }]);

  if (error) throw error;
};

/**
 * Sends an invite from the Team Owner to another Player.
 */
export const sendInvite = async (teamId: number, playerToInviteId: number) => {
  const { error } = await supabase
    .from('invitations')
    .insert([{ 
      team_id: teamId, 
      invited_player_id: playerToInviteId 
    }]);

  if (error) throw error;
};

/**
 * Calls the Database RPC function to join a team.
 * Error will be thrown if the player's 'is_member' flag is false.
 */
export const acceptInvite = async (invitationId: number) => {
  const { error } = await supabase.rpc('accept_team_invite', {
    invitation_id: invitationId
  });

  if (error) throw new Error(error.message);
};

/**
 * Fetches all pending invites for the current logged-in user.
 */
export const getMyInvites = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Get the player's internal ID first
  const { data: player } = await supabase
    .from('players')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!player) return [];

  const { data, error } = await supabase
    .from('invitations')
    .select(`
      id,
      status,
      teams ( id, name )
    `)
    .eq('invited_player_id', player.id)
    .eq('status', 'pending');

  if (error) throw error;
  return data;
};