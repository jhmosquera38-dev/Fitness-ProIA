import { supabase } from '../src/lib/supabaseClient';
import { GroupClass } from '../types';

export const groupClassService = {
    /**
     * Obtiene todas las clases grupales disponibles.
     * En el futuro se puede filtrar por gimnasio o ubicación.
     */
    async fetchClasses(): Promise<GroupClass[]> {
        const { data, error } = await supabase
            .from('gym_classes')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching classes:', error);
            throw error;
        }

        // Mapear campos de snake_case a camelCase si es necesario, 
        // pero si Types.ts usa nombres coincidentes, podemos retornarlo directo.
        // Nuestra interfaz GroupClass usa camelCase (coach, imageUrl, etc).
        // La DB usa snake_case (coach_name, image_url).
        // Necesitamos mapear.

        return (data || []).map((item: any) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            imageUrl: item.image_url,
            videoUrl: item.video_url,
            difficulty: item.difficulty,
            category: item.category,
            coach: item.coach_name,
            capacity: item.capacity,
            duration: 60, // Default o agregar columna
            schedule: item.schedule || [],
            price: item.price,
            locationType: item.location_type as any,
            gymId: item.gym_id
        }));
    },

    /**
     * Obtiene solo las clases creadas por el usuario actual (Entrenador/Gym).
     */
    async fetchMyClasses(): Promise<GroupClass[]> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('gym_classes')
            .select('*')
            .eq('gym_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching my classes:', error);
            throw error;
        }

        return (data || []).map((item: any) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            imageUrl: item.image_url,
            videoUrl: item.video_url,
            difficulty: item.difficulty,
            category: item.category,
            coach: item.coach_name,
            capacity: item.capacity,
            duration: 60,
            schedule: item.schedule || [],
            price: item.price,
            locationType: item.location_type as any,
            gymId: item.gym_id
        }));
    },

    /**
     * Crea una nueva clase grupal.
     * Solo para usuarios tipo Gym o Entrenador.
     */
    async createClass(classData: Omit<GroupClass, 'id'>) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuario no autenticado');

        // Mapear a snake_case para DB
        const dbData = {
            name: classData.name,
            description: classData.description,
            image_url: classData.imageUrl,
            video_url: classData.videoUrl,
            difficulty: classData.difficulty,
            category: classData.category,
            coach_name: classData.coach,
            capacity: classData.capacity,
            schedule: classData.schedule,
            price: classData.price,
            location_type: classData.locationType,
            gym_id: user.id // Asignar al usuario creador
        };

        const { data, error } = await supabase
            .from('gym_classes')
            .insert(dbData)
            .select()
            .single();

        if (error) {
            console.error('Error creating class:', error);
            throw error;
        }

        return data;
    },

    /**
     * Reserva un cupo en la clase.
     */
    async bookClass(classId: number) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Debes iniciar sesión para reservar');

        // 1. Verificar si ya existe reserva
        const { data: existingBooking } = await supabase
            .from('bookings')
            .select('id')
            .eq('class_id', classId)
            .eq('user_id', user.id)
            .maybeSingle();

        if (existingBooking) throw new Error('Ya tienes una reserva para esta clase.');

        // 2. Verificar cupos (Opcional: Si queremos ser estrictos, contar bookings actuales)
        // Por simplicidad, asumimos que el frontend valida visualmente, pero idealmente aquí haríamos un count.

        // 3. Crear reserva
        const { error } = await supabase
            .from('bookings')
            .insert({
                user_id: user.id,
                class_id: classId,
                status: 'pending_confirmation'
            });

        if (error) {
            console.error('Error booking class:', error);
            throw error;
        }

        return true;
    },

    /**
     * Obtiene los asistentes de una clase.
     * Requiere que el usuario sea el dueño de la clase (Gym/Entrenador).
     */
    async getAttendees(classId: number) {
        const { data, error } = await supabase
            .from('bookings')
            .select(`
                id,
                status,
                created_at,
                user:user_id (
                    email,
                    raw_user_meta_data
                ),
                profiles:user_id (
                    full_name,
                    avatar_url
                )
            `)
            .eq('class_id', classId);

        if (error) throw error;

        // Mapear resultado para facilitar uso en frontend
        return data.map((b: any) => ({
            id: b.id,
            status: b.status,
            joinedAt: b.created_at,
            user: {
                email: b.user?.email,
                name: b.profiles?.full_name || b.user?.raw_user_meta_data?.full_name || 'Usuario',
                avatar: b.profiles?.avatar_url
            }
        }));
    },

    /**
     * Cancela una reserva.
     */
    async cancelBooking(bookingId: string) {
        const { error } = await supabase
            .from('bookings')
            .delete() // O update status = 'cancelled'
            .eq('id', bookingId);
        if (error) throw error;
    },

    async updateClass(id: number, updates: any) {
        const { error } = await supabase
            .from('gym_classes')
            .update(updates)
            .eq('id', id);
        if (error) throw error;
    },

    async deleteClass(id: number) {
        const { error } = await supabase
            .from('gym_classes')
            .delete()
            .eq('id', id);
        if (error) throw error;
    }
};
