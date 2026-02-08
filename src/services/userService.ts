import { supabase } from '../lib/supabaseClient';
import { DailyCheckin } from '../types';

export interface UserProgressLog {
    id?: number;
    date: string;
    weight_kg: number;
    body_fat_percentage?: number;
    notes?: string;
}

export const userService = {
    // ==========================================
    // PERFIL y DETALLES
    // ==========================================

    async fetchUserProfile() {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        if (!user) return null;

        const { data, error } = await supabase
            .from('profiles')
            .select('*, user_details(*), gym_details(*), coach_details(*)')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error("Error fetching profile:", error);
            return null; // Handle gracefully
        }
        return data;
    },


    async createProfile(user: any, accountType: string = 'user') {
        const profileData = {
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
            role: accountType,
            plan: 'premium', // Default trial plan (Premium)
            subscription_status: 'trial',
            trial_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            has_completed_onboarding: false,
            is_gym_member: false
        };

        const { error } = await supabase.from('profiles').upsert(profileData);
        if (error) {
            console.error("Error creating profile:", error);
            throw error;
        }


        // Create default empty details to prevent dashboard crashes
        if (accountType === 'gym') {
            await supabase.from('gym_details').insert({
                profile_id: user.id,
                gym_name: profileData.full_name, // Default to name
                nit: `PENDIENTE-${Date.now()}`, // Avoid unique constraint error
                address: 'Pendiente'
            });
        } else if (accountType === 'entrenador') {
            await supabase.from('coach_details').insert({
                profile_id: user.id,
                profession: 'Entrenador', // Placeholder
                description: 'Perfil en construcción',
                phone: '',
                address: ''
            });
        }

        return profileData;
    },


    async completeOnboarding() {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        if (!user) throw new Error("No autenticado");

        const { error } = await supabase.from('profiles').update({ has_completed_onboarding: true }).eq('id', user.id);
        if (error) throw error;
    },

    async updateUserGoals(goals: { goal: string, level: string, days_per_week: number }) {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        if (!user) throw new Error("No autenticado");

        // Upsert user_details
        const { data, error } = await supabase
            .from('user_details')
            .upsert({ profile_id: user.id, ...goals })
            .select();

        if (error) throw error;
        return data;
    },

    // ==========================================
    // PROGRESO
    // ==========================================

    async fetchProgressLogs(): Promise<UserProgressLog[]> {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        if (!user) return [];

        const { data, error } = await supabase
            .from('progress_logs')
            .select('*')
            .eq('user_id', user.id)
            .order('date', { ascending: false });

        if (error) throw error;
        return data;
    },

    async logProgress(entry: UserProgressLog) {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        if (!user) throw new Error("No autenticado");

        const { data, error } = await supabase
            .from('progress_logs')
            .insert([{ ...entry, user_id: user.id }])
            .select();

        if (error) throw error;
        return data[0];
    },

    // ==========================================
    // CHECK-INS DIARIOS
    // ==========================================

    async fetchTodayCheckin(): Promise<DailyCheckin | null> {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        if (!user) return null;

        const today = new Date().toISOString().split('T')[0];

        const { data, error } = await supabase
            .from('daily_checkins')
            .select('*')
            .eq('user_id', user.id)
            .eq('date', today)
            .maybeSingle();

        if (error) throw error;
        if (!data) return null;

        // Map snake_case to camelCase
        return {
            date: data.date,
            energyLevel: data.energy_level,
            sleepQuality: data.sleep_quality as DailyCheckin['sleepQuality'],
            soreness: data.soreness as DailyCheckin['soreness'],
            mood: data.mood as DailyCheckin['mood']
        };
    },

    async fetchCheckinHistory(limit: number = 7): Promise<DailyCheckin[]> {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        if (!user) return [];

        const { data, error } = await supabase
            .from('daily_checkins')
            .select('*')
            .eq('user_id', user.id)
            .order('date', { ascending: false })
            .limit(limit);

        if (error) throw error;

        return data.map(d => ({
            date: d.date,
            energyLevel: d.energy_level,
            sleepQuality: d.sleep_quality,
            soreness: d.soreness,
            mood: d.mood
        }));
    },

    async logDailyCheckin(checkin: Omit<DailyCheckin, 'date'>) {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        if (!user) throw new Error("No autenticado");

        const today = new Date().toISOString().split('T')[0];

        // Map camelCase to snake_case
        const dbCheckin = {
            user_id: user.id,
            date: today,
            energy_level: checkin.energyLevel,
            sleep_quality: checkin.sleepQuality,
            soreness: checkin.soreness,
            mood: checkin.mood
        };

        // Check if checkin exists to update it to avoid duplicates (since no unique constraint on user_id, date)
        const existing = await userService.fetchTodayCheckin();

        let result;
        if (existing) {
            const { data: updated, error: updateError } = await supabase
                .from('daily_checkins')
                .update(dbCheckin)
                .eq('user_id', user.id)
                .eq('date', today)
                .select();
            if (updateError) throw updateError;
            result = updated;
        } else {
            const { data: inserted, error: insertError } = await supabase
                .from('daily_checkins')
                .insert([dbCheckin])
                .select();
            if (insertError) throw insertError;
            result = inserted;
        }

        return result ? result[0] : null;
    },

    // ==========================================
    // ESTADÍSTICAS AVANZADAS (MyProgress)
    // ==========================================

    async fetchPersonalRecords() {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        if (!user) return [];

        const { data, error } = await supabase
            .from('personal_records')
            .select('*')
            .eq('user_id', user.id)
            .order('record_date', { ascending: false });

        if (error) throw error;

        // Transform to frontend format if needed
        return data.map(pr => ({
            exercise: pr.exercise_name,
            weight: pr.weight_kg,
            date: pr.record_date
        }));
    },

    async fetchAchievements() {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        if (!user) return { unlocked: [], locked: [] };

        // Get all achievements
        const { data: allAchievements, error: achError } = await supabase
            .from('achievements')
            .select('*');

        if (achError) throw achError;

        // Get user unlocked achievements
        const { data: userAchievements, error: userAchError } = await supabase
            .from('user_achievements')
            .select('achievement_id, unlocked_at')
            .eq('user_id', user.id);

        if (userAchError) throw userAchError;

        const unlockedIds = new Set(userAchievements?.map(ua => ua.achievement_id));

        const formattedAchievements = allAchievements?.map(a => ({
            id: a.id,
            name: a.name,
            description: a.description,
            icon: a.icon,
            unlocked: unlockedIds.has(a.id),
            dateUnlocked: userAchievements?.find(ua => ua.achievement_id === a.id)?.unlocked_at
        })) || [];

        return {
            unlocked: formattedAchievements.filter(a => a.unlocked),
            locked: formattedAchievements.filter(a => !a.unlocked)
        };
    },

    // ==========================================
    // ESTADÍSTICAS GLOBALES
    // ==========================================

    async fetchUserStats() {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        if (!user) return { totalWorkouts: 0, timeInvestedMinutes: 0, caloriesBurned: 0 };

        const { data, error } = await supabase
            .from('workout_logs')
            .select('duration_minutes, calories_burned')
            .eq('user_id', user.id);

        if (error) throw error;

        const totalWorkouts = data.length;
        const timeInvestedMinutes = data.reduce((acc, curr) => acc + (curr.duration_minutes || 0), 0);
        const caloriesBurned = data.reduce((acc, curr) => acc + (curr.calories_burned || 0), 0);

        return {
            totalWorkouts,
            timeInvestedMinutes,
            caloriesBurned
        };
    },

    async logWorkoutSession(workoutSession: { plan_name: string, duration_minutes: number, calories_burned: number, focus?: string }) {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        if (!user) throw new Error("No autenticado");

        // 1. Log the workout
        const { plan_name, duration_minutes, calories_burned } = workoutSession;
        const { data, error } = await supabase
            .from('workout_logs')
            .insert([{ plan_name, duration_minutes, calories_burned, user_id: user.id }])
            .select();

        if (error) throw error;

        // 2. Create a social activity automatically
        await supabase.from('social_activities').insert([{
            user_id: user.id,
            type: 'workout',
            content: `completó el entrenamiento: ${workoutSession.plan_name}`,
            likes: 0
        }]);

        return data[0];
    },

    // ==========================================
    // ANÁLISIS DE PROGRESO (GRÁFICOS)
    // ==========================================

    async fetchWeeklyStats() {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        if (!user) return [];

        const now = new Date();
        const startOfCurrentWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Sunday
        startOfCurrentWeek.setHours(0, 0, 0, 0);

        const startOfPreviousWeek = new Date(startOfCurrentWeek);
        startOfPreviousWeek.setDate(startOfPreviousWeek.getDate() - 7);

        const { data: currentLogs } = await supabase
            .from('workout_logs')
            .select('duration_minutes, calories_burned')
            .eq('user_id', user.id)
            .gte('created_at', startOfCurrentWeek.toISOString());

        const { data: previousLogs } = await supabase
            .from('workout_logs')
            .select('duration_minutes, calories_burned')
            .eq('user_id', user.id)
            .gte('created_at', startOfPreviousWeek.toISOString())
            .lt('created_at', startOfCurrentWeek.toISOString());

        const sum = (arr: any[], key: string) => arr?.reduce((acc, curr) => acc + (curr[key] || 0), 0) || 0;

        const currentVol = sum(currentLogs || [], 'duration_minutes');
        const prevVol = sum(previousLogs || [], 'duration_minutes');

        const currentCount = currentLogs?.length || 0;
        const prevCount = previousLogs?.length || 0;

        const currentCals = sum(currentLogs || [], 'calories_burned');
        const prevCals = sum(previousLogs || [], 'calories_burned');

        return [
            { label: 'Volumen Semanal', current: currentVol, previous: prevVol, unit: 'min' },
            { label: 'Entrenamientos', current: currentCount, previous: prevCount, unit: 'sesiones' },
            { label: 'Calorías', current: currentCals, previous: prevCals, unit: 'kcal' }
        ];
    },

    async fetchMuscleFocusStats() {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        if (!user) return [];

        // Fetch logs from last 30 days - parse plan_name for focus
        const { data } = await supabase
            .from('workout_logs')
            .select('plan_name')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(50);

        if (!data) return [];

        const focusMap: Record<string, number> = {};
        data.forEach((log: any) => {
            if (log.plan_name && log.plan_name.includes(' - ')) {
                const focus = log.plan_name.split(' - ')[1];
                if (focus) {
                    focusMap[focus] = (focusMap[focus] || 0) + 1;
                }
            }
        });

        return Object.entries(focusMap).map(([name, value]) => ({ name, value }));
    },

    // ==========================================
    // SOCIAL & LEADERBOARD
    // ==========================================

    async fetchLeaderboard() {
        const { data, error } = await supabase.rpc('get_leaderboard');
        if (error) throw error;

        // Map to format expected by UI
        return data.map((entry: any, index: number) => ({
            rank: index + 1,
            userName: entry.full_name || 'Usuario',
            avatar: entry.avatar_url || '👤',
            xp: parseInt(entry.workout_count) * 100, // XP Simulado basado en workouts
            trend: 'same' // Placeholder
        }));
    },

    async fetchSocialFeed() {
        // Fetch last 20 activities with user profile
        const { data, error } = await supabase
            .from('social_activities')
            .select('*, profiles(full_name, avatar_url)')
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) throw error;

        return data.map((activity: any) => ({
            id: activity.id.toString(),
            user: activity.profiles?.full_name || 'Usuario',
            action: activity.content,
            timeAgo: new Date(activity.created_at).toLocaleDateString(),
            type: activity.type,
            likes: activity.likes
        }));
    },

    async postComment(activityId: string, content: string) {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        if (!user) throw new Error("No autenticado");

        const { error } = await supabase
            .from('comments')
            .insert([{
                activity_id: activityId, // Supabase handles string -> bigint if valid
                user_id: user.id,
                content: content
            }]);

        if (error) throw error;
    },

    async fetchMyEvaluation() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from('coach_client_evaluations')
            .select('*')
            .eq('client_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }
};
