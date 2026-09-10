import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, LogOut } from 'lucide-react';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/cursos': 'Cursos',
  '/actividades': 'Actividades',
  '/calendario': 'Calendario',
};

const Navbar = ({ onMenuClick, pathname }) => {
  const title = PAGE_TITLES[pathname] ?? 'PredictUNI';
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

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

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="w-9 h-9 rounded-full bg-[#7B3FE4]/20 border border-[#7B3FE4]/40 flex items-center justify-center text-sm font-semibold text-[#9b66f2] hover:border-[#7B3FE4] transition-colors"
          aria-label="Cuenta"
        >
          M
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-44 rounded-lg border border-gray-800 bg-[#150A21] shadow-xl py-1 z-50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <LogOut size={16} />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
