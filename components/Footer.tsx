import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white mt-auto py-4 border-t border-slate-200">
      <div className="container mx-auto px-4 text-center text-slate-500">
        <p>&copy; {new Date().getFullYear()} FitnessFlow Pro. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};