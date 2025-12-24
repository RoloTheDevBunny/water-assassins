import { SupabaseClient } from '@supabase/supabase-js';


type TeamData = {
    user_id: string;
    stripe_team_id: string;
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

    async updateTeamStatus(stripeTeamId: string, status: string): Promise<void> {
        const { error } = await this.supabase
            .from('teams')
            .update({ status })
            .eq('stripe_team_id', stripeTeamId);

        this.handleError(error);
    }

    async updateTeamPeriod(stripeTeamId: string, periodStart: Date, periodEnd: Date): Promise<void> {
        const { error } = await this.supabase
            .from('teams')
            .update({ current_period_start: periodStart, current_period_end: periodEnd })
            .eq('stripe_team_id', stripeTeamId);

        this.handleError(error);
    }

    async cancelTeam(stripeTeamId: string): Promise<void> {
        const { error } = await this.supabase
            .from('teams')
            .update({ status: 'canceled' })
            .eq('stripe_team_id', stripeTeamId);

        this.handleError(error);
    }

    private handleError(error: unknown): void {
        if (error) throw error;
    }
}