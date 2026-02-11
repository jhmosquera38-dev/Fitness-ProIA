import { supabase } from '../lib/supabaseClient';

// TIPO: Definición flexible para el Dashboard basada en la tabla Profiles
export interface GymMember {
    id: string; // UUID
    email: string;
    full_name: string;
    role: string;
    plan: 'gratis' | 'básico' | 'premium';
    status: 'Al día' | 'Vencido'; // Mapped from subscription_status
    last_payment_date?: string; // Mapped from metadata or calculated
    join_date: string;
    is_gym_member: boolean;
    monthly_fee?: number;
    notes?: string;
}

export interface EquipmentItem {
    id: number;
    item_name: string;
    category: string;
    quantity: number;
    status: 'Operativo' | 'En Mantenimiento' | 'Fuera de Servicio';
    brand?: string;
    serial_number?: string;
    last_maintenance?: string;
    image_url?: string;
}

export interface ProductItem {
    id: number;
    name: string;
    category: string;
    price: number;
    stock_quantity: number;
    sku?: string;
    brand?: string;
    expiration_date?: string;
    min_stock_level?: number;
    image_url?: string;
}

export const gymService = {
    // ==========================================
    // NOTIFICACIONES
    // ==========================================
    async fetchNotifications(): Promise<any[]> {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    async createNotification(userId: string | null = null, message: string, type: 'info' | 'warning' | 'success' | 'payment' = 'info') {
        let targetId = userId;

        // Si no se provee ID, usar el del usuario actual (Admin)
        if (!targetId) {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) targetId = user.id;
            else return; // No se puede crear notificación sin usuario
        }

        const { error } = await supabase
            .from('notifications')
            .insert([{
                user_id: targetId,
                message: message,
                type: type
            }]);
        if (error) console.error('Error creating notification', error);
    },

    // ==========================================
    // MIEMBROS
    // ==========================================

    // ==========================================
    // MIEMBROS (CRM - gym_members)
    // ==========================================

    // Obtener todos los miembros
    async fetchMembers(): Promise<GymMember[]> {
        const { data, error } = await supabase
            .from('gym_members')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Mapeo directo
        return data.map((m: any) => ({
            id: m.id.toString(), // gym_members uses bigint, convert to string for frontend interface
            email: m.email || '',
            full_name: m.full_name,
            role: 'user', // Default role for display
            plan: m.plan as any,
            status: m.status as any,
            join_date: m.join_date,
            is_gym_member: true,
            end_date: m.end_date,
            notes: m.notes,
            monthly_fee: m.monthly_fee
        }));
    },

    // Crear nuevo miembro (CRM)
    async createMember(memberData: any) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Usuario no autenticado");

        // 1. Insertar en gym_members
        const { data: newMember, error } = await supabase
            .from('gym_members')
            .insert([{
                gym_id: user.id,
                full_name: memberData.name,
                email: memberData.email,
                plan: memberData.plan,
                join_date: memberData.joinDate,
                // Calcular end_date inicial + 1 mes
                end_date: new Date(new Date(memberData.joinDate).setMonth(new Date(memberData.joinDate).getMonth() + 1)).toISOString(),
                status: 'Al día',
                monthly_fee: memberData.amount || (memberData.plan === 'premium' ? 50000 : 30000)
            }])
            .select()
            .single();

        if (error) throw error;

        // 2. Registrar transacción inicial si aplica
        if (memberData.firstPaymentDate) {
            const amount = memberData.amount || (memberData.plan === 'premium' ? 50000 : 30000); // Use provided amount or default
            await this.addTransaction({
                amount: amount,
                type: 'Ingreso',
                category: 'Suscripciones',
                description: `Suscripción Mensual - ${memberData.name}`,
                date: memberData.firstPaymentDate,
                member_id: newMember.id
            });
        }

        return newMember;
    },

    // Actualizar un miembro
    async updateMember(id: string, updates: Partial<GymMember>) {
        const dbUpdates: any = {};
        if (updates.full_name) dbUpdates.full_name = updates.full_name;
        if (updates.plan) dbUpdates.plan = updates.plan;
        if (updates.status) dbUpdates.status = updates.status;

        const { data, error } = await supabase
            .from('gym_members')
            .update(dbUpdates)
            .eq('id', id)
            .select();

        if (error) throw error;
        return data;
    },

    // Eliminar miembro
    async deleteMember(id: string) {
        const { error } = await supabase
            .from('gym_members')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // ==========================================
    // INVENTARIO
    // ==========================================

    // ==========================================
    // INVENTARIO DE EQUIPOS (Gym Equipment)
    // ==========================================

    async fetchEquipment(): Promise<any[]> {
        const { data, error } = await supabase
            .from('gym_equipment')
            .select('*')
            .order('item_name', { ascending: true });

        if (error) throw error;
        return data;
    },

    async addEquipment(item: any) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Usuario no autenticado");

        const { data, error } = await supabase
            .from('gym_equipment')
            .insert([{ ...item, gym_id: user.id }])
            .select();

        if (error) throw error;
        return data[0];
    },

    async updateEquipment(id: number, updates: any) {
        const { data, error } = await supabase
            .from('gym_equipment')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) throw error;
        return data[0];
    },

    async deleteEquipment(id: number) {
        const { error } = await supabase
            .from('gym_equipment')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // ==========================================
    // INVENTARIO DE PRODUCTOS (Gym Products)
    // ==========================================

    async fetchProducts(): Promise<any[]> {
        const { data, error } = await supabase
            .from('gym_products')
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;
        return data;
    },

    async addProduct(item: any) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Usuario no autenticado");

        const { data, error } = await supabase
            .from('gym_products')
            .insert([{ ...item, gym_id: user.id }])
            .select();

        if (error) throw error;

        // REGISTRO FINANCIERO: Log the purchase/addition
        await this.addTransaction({
            type: 'Gasto',
            category: 'Inventario',
            amount: item.cost * item.stock_quantity,
            description: `Compra inicial: ${item.name} (x${item.stock_quantity})`,
            date: new Date().toISOString().split('T')[0]
        });

        return data[0];
    },

    async updateProduct(id: number, updates: any) {
        const { data, error } = await supabase
            .from('gym_products')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) throw error;

        // If stock increased, log as expense. If sold, we'd ideally log as income, 
        // but for now we log audit updates.
        return data[0];
    },

    async deleteProduct(id: number) {
        const { error } = await supabase
            .from('gym_products')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // ==========================================
    // FINANZAS
    // ==========================================

    async fetchTransactions(): Promise<any[]> {
        const { data, error } = await supabase
            .from('finance_transactions')
            .select('*')
            .order('date', { ascending: false }); // Más recientes primero

        if (error) throw error;
        return data;
    },

    async addTransaction(transaction: any) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Usuario no autenticado");

        const { data, error } = await supabase
            .from('finance_transactions')
            .insert([{ ...transaction, gym_id: user.id }])
            .select();

        if (error) throw error;
        return data[0];
    },
    // ==========================================
    // RETOS (GAMIFICATION)
    // ==========================================

    async fetchActiveChallenges(): Promise<any[]> {
        const { data, error } = await supabase
            .from('challenges')
            .select('*')
            .gte('deadline', new Date().toISOString().split('T')[0])
            .order('deadline', { ascending: true });

        if (error) throw error;
        return data;
    },

    async createChallenge(challenge: any) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Usuario no autenticado");

        const { data, error } = await supabase
            .from('challenges')
            .insert([{ ...challenge, gym_id: user.id }])
            .select();

        if (error) throw error;
        return data[0];
    },

    async deleteChallenge(id: number) {
        const { error } = await supabase
            .from('challenges')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
