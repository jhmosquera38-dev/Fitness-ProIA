
// ============================================================================
// DATOS DE GIMNASIO (Data Mock)
// ============================================================================
// Define las estructuras y datos de prueba para la gestión administrativa del gimnasio.
// Incluye miembros, transacciones financieras y resumenes para gráficos.
// ============================================================================

export interface GymMember {
    id: number;
    name: string;
    email: string;
    password: string;
    plan: 'básico' | 'premium';
    status: 'Al día' | 'Vencido';
    lastPayment: string;
    joinDate: string;
    paymentHistory: string[];
}

export interface Transaction {
    id: number;
    date: string; // "YYYY-MM-DD"
    description: string;
    type: 'Ingreso' | 'Gasto' | 'Comisión' | 'Fianza';
    amount: number;
    category: string;
}

// Lista de miembros simulada para la tabla de "Gestión de Miembros"
export const mockMembers: GymMember[] = [
    { id: 101, name: 'Ana García', email: 'ana.garcia@email.com', password: 'password123', plan: 'premium', status: 'Al día', lastPayment: '2024-07-01', joinDate: '2023-01-15', paymentHistory: ['2024-07-01', '2024-06-01', '2024-05-01'] },
    { id: 102, name: 'Carlos Rodríguez', email: 'carlos.rodriguez@email.com', password: 'password123', plan: 'básico', status: 'Al día', lastPayment: '2024-07-03', joinDate: '2023-03-22', paymentHistory: ['2024-07-03', '2024-06-03', '2024-05-03'] },
    { id: 103, name: 'Luisa Martinez', email: 'luisa.martinez@email.com', password: 'password123', plan: 'premium', status: 'Vencido', lastPayment: '2024-05-28', joinDate: '2022-11-10', paymentHistory: ['2024-05-28', '2024-04-28', '2024-03-28'] },
    { id: 104, name: 'Javier Pérez', email: 'javier.perez@email.com', password: 'password123', plan: 'básico', status: 'Al día', lastPayment: '2024-06-25', joinDate: '2024-02-01', paymentHistory: ['2024-06-25', '2024-05-25'] },
    { id: 105, name: 'Sofia Gómez', email: 'sofia.gomez@email.com', password: 'password123', plan: 'premium', status: 'Al día', lastPayment: '2024-07-05', joinDate: '2023-08-19', paymentHistory: ['2024-07-05', '2024-06-05', '2024-05-05'] },
    { id: 106, name: 'Mateo Hernandez', email: 'mateo.hernandez@email.com', password: 'password123', plan: 'básico', status: 'Vencido', lastPayment: '2024-05-15', joinDate: '2024-01-11', paymentHistory: ['2024-05-15', '2024-04-15', '2024-03-15'] },
    { id: 107, name: 'Valentina Diaz', email: 'valentina.diaz@email.com', password: 'password123', plan: 'premium', status: 'Al día', lastPayment: '2024-06-30', joinDate: '2021-07-07', paymentHistory: ['2024-06-30', '2024-05-30', '2024-04-30'] },
];

// Transacciones financieras para el "Dashboard Financiero"
export const mockTransactions: Transaction[] = [
    { id: 1, date: '2024-07-15', description: 'Pago de membresía - Ana García', type: 'Ingreso', amount: 20000, category: 'Membresías' },
    { id: 2, date: '2024-07-15', description: 'Pago de servicios públicos (EPM)', type: 'Gasto', amount: 350000, category: 'Servicios Públicos' },
    { id: 3, date: '2024-07-14', description: 'Venta de proteína en polvo', type: 'Ingreso', amount: 150000, category: 'Venta de Productos' },
    { id: 4, date: '2024-07-12', description: 'Pago de membresía - Carlos Rodríguez', type: 'Ingreso', amount: 15000, category: 'Membresías' },
    { id: 5, date: '2024-07-10', description: 'Mantenimiento de caminadora #3', type: 'Gasto', amount: 80000, category: 'Mantenimiento' },
    { id: 6, date: '2024-07-05', description: 'Pago de nómina - Entrenadores', type: 'Gasto', amount: 1200000, category: 'Salarios' },
    { id: 7, date: '2024-07-03', description: 'Venta de bebidas energéticas', type: 'Ingreso', amount: 45000, category: 'Venta de Productos' },
    { id: 8, date: '2024-07-01', description: 'Pago arriendo del local', type: 'Gasto', amount: 2500000, category: 'Arriendo' },
];

// Resumen financiero para gráficos
export const financialSummary = {
    monthlyIncome: 1850000,
    monthlyExpenses: 650000,
    netProfit: 1200000,
    chartData: [
        { name: 'Feb', income: 1500, expenses: 700 },
        { name: 'Mar', income: 1600, expenses: 750 },
        { name: 'Abr', income: 1750, expenses: 800 },
        { name: 'May', income: 1700, expenses: 780 },
        { name: 'Jun', income: 1900, expenses: 850 },
        { name: 'Jul', income: 1850, expenses: 650 },
    ]
}