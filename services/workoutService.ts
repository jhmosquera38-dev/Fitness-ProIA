import { supabase } from "../src/lib/supabaseClient";
import { UserProfile, WorkoutPlan } from '../types';

export interface SavedWorkoutPlan {
    id: string;
    user_id: string;
    name: string;
    plan_data: WorkoutPlan;
    criteria?: UserProfile;
    created_at: string;
}

export const workoutService = {
    async saveWorkoutPlan(plan: WorkoutPlan, criteria: UserProfile, name?: string): Promise<SavedWorkoutPlan> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuario no autenticado');

        const planName = name || `Rutina del ${new Date().toLocaleDateString()}`;

        const { data, error } = await supabase
            .from('workout_plans')
            .insert({
                user_id: user.id,
                name: planName,
                plan_data: plan,
                criteria: criteria // Save the input criteria
            })
            .select()
            .single();

        if (error) {
            console.error('Error saving workout plan:', error);
            throw error;
        }

        return data;
    },

    async getWorkoutPlans(): Promise<SavedWorkoutPlan[]> {
        const { data, error } = await supabase
            .from('workout_plans')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching workout plans:', error);
            throw error;
        }

        return data || [];
    },

    async deleteWorkoutPlan(id: string): Promise<void> {
        const { error } = await supabase
            .from('workout_plans')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting workout plan:', error);
            throw error;
        }
    }
};
