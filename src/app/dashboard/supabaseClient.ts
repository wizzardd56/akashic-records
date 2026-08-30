import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabaseUrl = (rawUrl && rawUrl.startsWith('http'))
    ? rawUrl
    : 'https://awpcumychzzayvbvfejl.supabase.co';

const supabaseAnonKey = (rawKey && rawKey.length > 10)
    ? rawKey
    : 'sb_publishable_42x4UJSjPio01EdPkPPMQQ_g-HWU-Ue';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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