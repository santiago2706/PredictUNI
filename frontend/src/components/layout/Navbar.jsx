import React from 'react';
import { Menu } from 'lucide-react';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/cursos': 'Cursos',
  '/calendario': 'Calendario',
};

const Navbar = ({ onMenuClick, pathname }) => {
  const title = PAGE_TITLES[pathname] ?? 'PredictUNI';

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-gray-800 bg-[#0D0614]">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-400 hover:text-white"
          aria-label="Abrir menú"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-white font-semibold text-lg">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-full bg-[#7B3FE4]/20 border border-[#7B3FE4]/40 flex items-center justify-center text-sm font-semibold text-[#9b66f2]">
          M
        </div>
      </div>
    </header>
  );
};

export default Navbar;
