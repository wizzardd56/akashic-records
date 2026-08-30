import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key'
);

export async function fetchUserProfile(userId: string) {
    if (!supabaseUrl || !supabaseAnonKey) return null;
    try {
        const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', userId)
            .single();
        if (error) return null;
        return data;
    } catch {
        return null;
    }
}

export async function syncUserProfile(profileData: {
    user_id: string;
    email?: string;
    competency_score?: number;
    active_gaps?: number;
    completed_milestones?: number;
}) {
    if (!supabaseUrl || !supabaseAnonKey) return;
    try {
        await supabase
            .from('user_profiles')
            .upsert({
                ...profileData,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });
    } catch (err) {
        console.error('Error syncing profile to Supabase:', err);
    }
}