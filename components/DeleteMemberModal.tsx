import React from 'react';
import type { GymMember } from '../services/gymService';

interface DeleteMemberModalProps {
  member: GymMember;
  onClose: () => void;
  onConfirmDelete: () => void;
}

export const DeleteMemberModal: React.FC<DeleteMemberModalProps> = ({ member, onClose, onConfirmDelete }) => {
  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-member-modal-title"
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex-shrink-0 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h2 id="delete-member-modal-title" className="text-xl font-bold text-slate-800">Eliminar Miembro</h2>
              <p className="mt-2 text-slate-600">
                ¿Estás seguro de que deseas eliminar a <span className="font-bold text-slate-900">{member.full_name}</span>? Esta acción no se puede deshacer.
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirmDelete}
            className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};