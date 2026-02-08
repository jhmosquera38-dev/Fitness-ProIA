
// ============================================================================
// GESTIÓN DE MIEMBROS (MembersManagement.tsx)
// ============================================================================
import React, { useState, useMemo, useEffect } from 'react';
import { gymService, GymMember } from '../services/gymService';
import { AddMemberModal } from '../components/AddMemberModal';
import { EditMemberModal } from '../components/EditMemberModal';
import { DeleteMemberModal } from '../components/DeleteMemberModal';
import { LEADERBOARD_DATA, LEVEL_TITLES } from '../data/gamification';

const statusColors: { [key: string]: string } = {
    'Al día': 'bg-green-100 text-green-800',
    'Vencido': 'bg-red-100 text-red-800',
};

const planColors: { [key: string]: string } = {
    'básico': 'bg-blue-100 text-blue-800',
    'premium': 'bg-yellow-100 text-yellow-800',
    'gratis': 'bg-gray-100 text-gray-800',
};

interface NewMemberData {
    name: string;
    email: string;
    password: string;
    plan: 'básico' | 'premium';
    joinDate: string;
    firstPaymentDate: string;
    amount?: number;
}

interface MembersManagementProps {
    onNavigate: (page: string) => void;
}

const getGamificationDetails = (memberName: string) => {
    const entry = LEADERBOARD_DATA.find(d => memberName.includes(d.userName) || d.userName.includes(memberName.split(' ')[0]));
    if (entry) {
        const levelInfo = [...LEVEL_TITLES].reverse().find(l => entry.xp >= l.minXP) || LEVEL_TITLES[0];
        return { level: levelInfo.level, title: levelInfo.title, xp: entry.xp };
    }
    return { level: 1, title: 'Novato', xp: 0 };
};

export const MembersManagement: React.FC<MembersManagementProps> = () => {
    const [members, setMembers] = useState<GymMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [memberToEdit, setMemberToEdit] = useState<GymMember | null>(null);
    const [memberToDelete, setMemberToDelete] = useState<GymMember | null>(null);

    useEffect(() => {
        loadMembers();
    }, []);

    const loadMembers = async () => {
        setIsLoading(true);
        try {
            const data = await gymService.fetchMembers();
            setMembers(data);
        } catch (err) {
            console.error("Error loading members:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredMembers = useMemo(() => {
        return members.filter(member => {
            const nameMatch = member.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
            const statusMatch = statusFilter === 'Todos' || member.status === statusFilter;
            return nameMatch && statusMatch;
        });
    }, [members, searchTerm, statusFilter]);

    const handleAddMember = async (newMemberData: NewMemberData) => {
        try {
            await gymService.createMember({
                name: newMemberData.name,
                email: newMemberData.email,
                plan: newMemberData.plan,
                joinDate: newMemberData.joinDate,
                firstPaymentDate: newMemberData.firstPaymentDate,
                amount: newMemberData.amount
            });
            setIsAddModalOpen(false);
            loadMembers();
        } catch (error) {
            console.error(error);
            alert("Error al registrar miembro: " + (error as any).message);
        }
    };

    const handleUpdateMember = async (updatedMember: GymMember) => {
        try {
            await gymService.updateMember(updatedMember.id, {
                full_name: updatedMember.full_name,
                plan: updatedMember.plan,
            });
            await loadMembers();
            setMemberToEdit(null);
        } catch (err) {
            console.error("Failed to update member", err);
            alert("Error al actualizar miembro");
        }
    };

    const handleDeleteMember = async () => {
        if (memberToDelete) {
            try {
                await gymService.deleteMember(memberToDelete.id);
                setMembers(prevMembers =>
                    prevMembers.filter(member => member.id !== memberToDelete.id)
                );
                setMemberToDelete(null);
            } catch (error) {
                console.error("Error deleting member:", error);
                alert("Error al eliminar el miembro.");
            }
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-slate-500">Cargando miembros...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">Gestión de Miembros</h1>
                    <p className="mt-2 text-lg text-slate-600">Administra, busca y filtra los miembros de tu gimnasio.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-secondary transition-colors flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Añadir Miembro
                </button>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Buscar miembro por nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none bg-white"
                    >
                        <option value="Todos">Todos los estados</option>
                        <option value="Al día">Al día</option>
                        <option value="Vencido">Vencido</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-sm text-slate-600">
                            <tr>
                                <th className="p-4 font-semibold">ID</th>
                                <th className="p-4 font-semibold">Nombre</th>
                                <th className="p-4 font-semibold">Correo</th>
                                <th className="p-4 font-semibold text-center">Nivel</th>
                                <th className="p-4 font-semibold text-center">Plan</th>
                                <th className="p-4 font-semibold text-center">Estado</th>
                                <th className="p-4 font-semibold">Mensualidad</th>
                                <th className="p-4 font-semibold">Último Pago</th>
                                <th className="p-4 font-semibold">Fecha de Ingreso</th>
                                <th className="p-4 font-semibold text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMembers.map(member => (
                                <tr key={member.id} className="border-t border-slate-200 hover:bg-slate-50">
                                    <td className="p-4 text-slate-500 text-xs">{member.id}</td>
                                    <td className="p-4 font-medium text-slate-800">{member.full_name}</td>
                                    <td className="p-4 text-slate-700">{member.email}</td>
                                    <td className="p-4 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="font-bold text-slate-800 bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs">Lvl {getGamificationDetails(member.full_name).level}</span>
                                            <span className="text-[10px] text-slate-500">{getGamificationDetails(member.full_name).title}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${planColors[member.plan]}`}>
                                            {member.plan}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[member.status]}`}>
                                            {member.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-700">
                                        {member.monthly_fee ? `$${member.monthly_fee.toLocaleString()}` : '-'}
                                    </td>
                                    <td className="p-4 text-slate-700">{member.last_payment_date || '-'}</td>
                                    <td className="p-4 text-slate-700">{new Date(member.join_date).toLocaleDateString()}</td>
                                    <td className="p-4 text-center space-x-2">
                                        <button onClick={() => setMemberToEdit(member)} className="text-slate-500 hover:text-brand-primary p-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg></button>
                                        <button onClick={() => setMemberToDelete(member)} className="text-slate-500 hover:text-red-500 p-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isAddModalOpen && (
                <AddMemberModal
                    onClose={() => setIsAddModalOpen(false)}
                    onAddMember={handleAddMember}
                />
            )}

            {memberToEdit && (
                <EditMemberModal
                    member={memberToEdit}
                    onClose={() => setMemberToEdit(null)}
                    onUpdateMember={handleUpdateMember}
                />
            )}

            {memberToDelete && (
                <DeleteMemberModal
                    member={memberToDelete}
                    onClose={() => setMemberToDelete(null)}
                    onConfirmDelete={handleDeleteMember}
                />
            )}
        </div>
    );
};
