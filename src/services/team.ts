import { SupabaseClient } from '@supabase/supabase-js';


type TeamData = {
    user_id: string;
    plan: string;
    status: string;
    current_period_start: Date;
    current_period_end: Date;
};

export default class TeamService {
    constructor(private supabase: SupabaseClient) { }

    async getTeamByUserId(userId: string): Promise<TeamData | null> {
        const { data, error } = await this.supabase
            .from('teams')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(1);

        this.handleError(error);
        return data?.[0] || null;
    }

    async upsertTeam(teamData: TeamData): Promise<void> {
        const { error } = await this.supabase
            .from('teams')
            .upsert(teamData);

        this.handleError(error);
    }

    private handleError(error: unknown): void {
        if (error) throw error;
    }
}