import { supabase } from '../lib/supabaseClient';
import { CoachService, Client } from '../types';
export type { CoachService, Client };

export const coachService = {
    // ==========================================
    // SERVICIOS DEL ENTRENADOR
    // ==========================================

    async fetchMyServices(): Promise<CoachService[]> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("No autenticado");

        const { data, error } = await supabase
            .from('coach_services')
            .select('*')
            .eq('coach_id', user.id);

        if (error) throw error;

        return (data || []).map((item: any) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            duration: item.duration_min,
            activeClients: item.active_clients || 0,
            imageUrl: item.image_url,
            videoUrl: item.video_url,
            locationType: item.location_type
        }));
    },

    async createService(service: Omit<CoachService, 'id' | 'coach' | 'activeClients'>) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("No autenticado");

        const dbData = {
            coach_id: user.id,
            name: service.name,
            description: service.description,
            price: service.price,
            duration_min: service.duration,
            image_url: service.imageUrl,
            video_url: service.videoUrl,
            location_type: service.locationType,
            active_clients: 0
        };

        const { data, error } = await supabase
            .from('coach_services')
            .insert([dbData])
            .select()
            .single();

        if (error) throw error;

        // Map back to interface
        return {
            id: data.id,
            name: data.name,
            description: data.description,
            price: data.price,
            duration: data.duration_min,
            imageUrl: data.image_url,
            videoUrl: data.video_url,
            locationType: data.location_type,
            activeClients: data.active_clients
        } as CoachService;
    },

    async updateService(id: number, updates: Partial<CoachService>) {
        // Map updates to snake_case
        const dbUpdates: any = {};
        if (updates.name) dbUpdates.name = updates.name;
        if (updates.description) dbUpdates.description = updates.description;
        if (updates.price) dbUpdates.price = updates.price;
        if (updates.duration) dbUpdates.duration_min = updates.duration;
        if (updates.imageUrl) dbUpdates.image_url = updates.imageUrl;
        if (updates.videoUrl) dbUpdates.video_url = updates.videoUrl;
        if (updates.locationType) dbUpdates.location_type = updates.locationType;

        const { data, error } = await supabase
            .from('coach_services')
            .update(dbUpdates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return {
            id: data.id,
            name: data.name,
            description: data.description,
            price: data.price,
            duration: data.duration_min,
            imageUrl: data.image_url,
            videoUrl: data.video_url,
            locationType: data.location_type,
            activeClients: data.active_clients
        } as CoachService;
    },

    async deleteService(id: number) {
        const { error } = await supabase
            .from('coach_services')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    async fetchMyClients() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        // 1. Fetch My Services (Personal Training)
        const { data: myServices } = await supabase
            .from('coach_services')
            .select('id')
            .eq('coach_id', user.id);
        const serviceIds = myServices?.map(s => s.id) || [];

        // 2. Fetch My Classes (Group Classes)
        const { data: myClasses } = await supabase
            .from('gym_classes')
            .select('id')
            .eq('gym_id', user.id);
        const classIds = myClasses?.map(c => c.id) || [];

        if (serviceIds.length === 0 && classIds.length === 0) return [];

        // 3. Fetch Bookings for Services
        let serviceBookings: any[] = [];
        if (serviceIds.length > 0) {
            const { data } = await supabase
                .from('bookings')
                .select('user_id, booking_date, status')
                .in('service_id', serviceIds)
                .in('status', ['confirmed']); // Only confirmed to separate Requests from Active Clients
            serviceBookings = data || [];
        }

        // 4. Fetch Bookings for Classes
        let classBookings: any[] = [];
        if (classIds.length > 0) {
            const { data } = await supabase
                .from('bookings')
                .select('user_id, booking_date, status')
                .in('class_id', classIds); // Classes implies 'confirmed' usually, or filter by confirmed?
            classBookings = data || [];
        }

        // Merge and Sort by Date Descending (using booking_date)
        const allBookings = [...serviceBookings, ...classBookings].sort((a, b) =>
            new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime()
        );

        const uniqueUserIds = [...new Set(allBookings.map(b => b.user_id))];

        if (uniqueUserIds.length === 0) return [];

        // 5. Fetch Profiles
        const { data: profiles } = await supabase
            .from('profiles')
            .select('*')
            .in('id', uniqueUserIds);

        // 6. Fetch Latest Notes
        const { data: notes } = await supabase
            .from('coach_client_notes')
            .select('*')
            .eq('coach_id', user.id)
            .in('client_id', uniqueUserIds)
            .order('created_at', { ascending: false });

        // Map in order of uniqueUserIds (Recency)
        const sortedProfiles = uniqueUserIds.map(id => profiles?.find(p => p.id === id)).filter(Boolean);

        return sortedProfiles.map(p => {
            if (!p) return null;
            const clientNotes = notes?.filter(n => n.client_id === p.id).map(n => n.note) || [];

            // Determine Source Type
            const hasService = serviceBookings.some(b => b.user_id === p.id);
            const hasClass = classBookings.some(b => b.user_id === p.id);
            let sourceType = 'service';
            if (hasService && hasClass) sourceType = 'both';
            else if (hasClass) sourceType = 'class';

            return {
                id: p.id,
                name: p.full_name || 'Cliente',
                email: 'cliente@email.com',
                phone: p.phone || '',
                joinDate: p.created_at,
                objective: sourceType === 'class' ? 'Clase Grupal' : 'Entrenamiento Personal',
                memberships: 'Activo',
                lastVisit: 'Hoy',
                status: 'active',
                avatar: p.avatar_url,
                progress: 50,
                goal: 'General',
                notes: clientNotes,
                source: sourceType as any
            } as Client;
        }).filter((c): c is Client => c !== null);
    },

    // Nueva función para agregar notas
    async addClientNote(clientId: string, note: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("No autenticado");

        const { error } = await supabase
            .from('coach_client_notes')
            .insert({
                coach_id: user.id,
                client_id: clientId,
                note: note
            });

        if (error) throw error;
    },

    // Fetch Unified Schedule (Clases + Servicios)
    async fetchSchedule() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        // 1. Fetch Service Bookings (Your Services)
        const { data: serviceBookings, error: serviceError } = await supabase
            .from('bookings')
            .select(`
                id, status, booking_date,
                service:coach_services!inner(name, coach_id),
                user:profiles(full_name)
            `)
            .eq('coach_services.coach_id', user.id);

        if (serviceError) console.error("Error fetching service bookings:", serviceError);

        // 2. Fetch Class Bookings (Your Classes)
        // Find classes owned by Gym/Coach
        // Then find bookings for those classes
        const { data: myClasses } = await supabase
            .from('gym_classes')
            .select('id, name')
            .eq('gym_id', user.id);

        const classIds = myClasses?.map(c => c.id) || [];

        let classBookings: any[] = [];
        if (classIds.length > 0) {
            const { data: cbData, error: cbError } = await supabase
                .from('bookings')
                .select(`
                    id, status, booking_date, class_id,
                    user:profiles(full_name)
                `)
                .in('class_id', classIds);

            if (cbError) console.error("Error fetching class bookings:", cbError);

            // Enrich with class name manually since we have myClasses
            classBookings = (cbData || []).map(b => ({
                ...b,
                isClass: true,
                service: { name: myClasses?.find(c => c.id === b.class_id)?.name || 'Clase' }
            }));
        }

        const allBookings = [...(serviceBookings || []), ...classBookings];

        // Transform to GroupClass/Schedule format
        return allBookings.map((b: any) => ({
            id: b.id,
            name: b.service.name,
            bookedBy: b.user?.full_name || 'Usuario',
            status: b.status,
            schedule: [{
                day: new Date(b.booking_date).toLocaleDateString(),
                time: new Date(b.booking_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }],
            clientAddress: 'No especificada', // Notes column pending migration
            rawDate: b.booking_date,
            category: b.isClass ? 'Clase' : 'Personalizado',
            coach: 'Yo' // Implicit
        }));
    },

    async updateBookingStatus(bookingId: number, status: string) {
        const { error } = await supabase
            .from('bookings')
            .update({ status })
            .eq('id', bookingId);

        if (error) throw error;
    },

    async fetchReviews() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('coach_reviews')
            .select('*, client:client_id (full_name)')
            .eq('coach_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5);

        if (error) {
            console.error('Error fetching reviews:', error);
            return [];
        }

        return data.map(r => ({
            id: r.id,
            client: r.client?.full_name || 'Usuario',
            rating: r.rating,
            comment: r.comment,
            date: new Date(r.created_at).toLocaleDateString()
        }));
    },

    async getStats() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { income: 0, rating: 0, clients: 0 };

        // 1. Calculate Income (Bookings * Service Price)
        const myServices = await this.fetchMyServices();
        const serviceIds = myServices.map(s => s.id);

        let income = 0;
        if (serviceIds.length > 0) {
            const { data: bookings } = await supabase
                .from('bookings')
                .select('service_id, status')
                .in('service_id', serviceIds)
                .eq('status', 'confirmed');

            if (bookings) {
                bookings.forEach(b => {
                    const service = myServices.find(s => s.id === b.service_id);
                    if (service) {
                        income += Number(service.price || 0);
                    }
                });
            }
        }

        // 2. Average Rating
        const { data: reviews } = await supabase
            .from('coach_reviews')
            .select('rating')
            .eq('coach_id', user.id);

        const totalRating = reviews?.reduce((acc, curr) => acc + curr.rating, 0) || 0;
        const avgRating = reviews && reviews.length > 0 ? totalRating / reviews.length : 0;

        // 3. Total Clients
        const clients = await this.fetchMyClients();

        return {
            income,
            rating: avgRating,
            clients: clients.length
        };
    },

    // ==========================================
    // MÉTODOS PÚBLICOS (PARA USUARIOS)
    // ==========================================

    async fetchAllServices(): Promise<CoachService[]> {
        const { data, error } = await supabase
            .from('coach_services')
            .select('*');

        if (error) throw error;

        return (data || []).map((item: any) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            duration: item.duration_min,
            activeClients: item.active_clients || 0,
            imageUrl: item.image_url,
            videoUrl: item.video_url,
            locationType: item.location_type,
            availability: item.availability // Added availability mapping
        }));
    },

    async bookService(serviceId: number, date: string, time: string, address?: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Debes iniciar sesión para reservar.");

        // 1. Get Service details to know the Coach ID
        const { data: service, error: serviceError } = await supabase
            .from('coach_services')
            .select('coach_id, name')
            .eq('id', serviceId)
            .single();

        if (serviceError || !service) throw new Error("Servicio no encontrado.");

        // 2. Create booking
        const appointmentDateTime = new Date(`${date}T${time}`);

        const { error: bookingError } = await supabase
            .from('bookings')
            .insert([{
                user_id: user.id,
                service_id: serviceId,
                booking_date: appointmentDateTime.toISOString(),
                status: 'pending_confirmation',
                notes: address ? `Dirección Cliente: ${address}` : ''
            }]);

        if (bookingError) throw bookingError;

        // 3. Create Notification for the Coach
        const { error: notifError } = await supabase
            .from('notifications')
            .insert([{
                user_id: service.coach_id, // Notify the coach
                message: `Nueva reserva: ${user.user_metadata?.full_name || user.email} ha reservado "${service.name}" para el ${date} a las ${time}.`,
                type: 'booking',
                read: false,
                created_at: new Date().toISOString()
            }]);

        if (notifError) console.error("Error creating notification:", notifError);

        if (notifError) console.error("Error creating notification:", notifError);
    },

    // ==========================================
    // EVALUACIONES DE CLIENTES (NUEVO)
    // ==========================================

    async saveClientEvaluation(evaluation: {
        client_id: string;
        service_id?: number;
        rating: number;
        feedback: string;
        recommendations: string;
        observations: string;
        general_valuation: string;
    }) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("No autenticado");

        // Check if evaluation exists to update or insert
        // Simplification: Insert always (log) or upsert? Let's use upsert on client_id + coach_id effectively implies one active valuation? 
        // Or history? The requirement says "Control Center". Let's simply insert a new record for history 
        // OR update the latest one if we want a "current state". 
        // User requirements imply "Control Center... provide detailed feedback... track progress".
        // Let's assume we maintain a history but the dashboard shows the latest.
        // Actually, let's just Insert for now to track history.

        const { error } = await supabase
            .from('coach_client_evaluations')
            .insert([{
                ...evaluation,
                coach_id: user.id
            }]);

        if (error) throw error;
    },

    async getClientEvaluation(clientId: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from('coach_client_evaluations')
            .select('*')
            .eq('coach_id', user.id)
            .eq('client_id', clientId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // Ignore not found
        return data;
    },

    // ==========================================
    // GESTIÓN DE DISPONIBILIDAD (AGENDA)
    // ==========================================

    async fetchAvailability() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('coach_details')
            .select('availability')
            .eq('profile_id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;

        // Return structured availability or empty default
        return (data?.availability as { day: string; hours: string[] }[]) || [];
    },

    async updateAvailability(availability: { day: string; hours: string[] }[]) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("No autenticado");

        // Upsert coach_details with new availability
        const { error } = await supabase
            .from('coach_details')
            .upsert({
                profile_id: user.id,
                availability: availability
            });

        if (error) throw error;
    },

    async blockTime(date: string, time: string, _note?: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("No autenticado");

        const dateTime = new Date(`${date}T${time}`); // Local to ISO handled by Date
        // Actually, best to store timezone aware or just ISO string. 
        // Our bookings table uses TIMESTAMPTZ.

        const { error } = await supabase
            .from('bookings')
            .insert([{
                user_id: user.id, // Self-booking
                service_id: null, // Not a service
                class_id: null,   // Not a class
                booking_date: dateTime.toISOString(),
                status: 'blocked'
                // notes: note // Column missing pending migration
            }]);

        if (error) throw error;
    },

    async unblockTime(bookingId: number) {
        const { error } = await supabase
            .from('bookings')
            .delete()
            .eq('id', bookingId)
            .eq('status', 'blocked'); // Safety check

        if (error) throw error;
    },

    // Fetch specifically blocked slots for current coach
    async fetchBlockedTimes() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('bookings')
            .select('id, booking_date')
            .eq('user_id', user.id) // Self bookings
            .eq('status', 'blocked');

        if (error) throw error;

        return data.map(b => ({
            id: b.id,
            date: new Date(b.booking_date).toLocaleDateString(), // Or raw ISO
            time: new Date(b.booking_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            fullDate: b.booking_date,
            note: 'Bloqueado' // Fallback
        }));
    }

};

