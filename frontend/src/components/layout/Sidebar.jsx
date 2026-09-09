import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Calendar, ClipboardList, X } from 'lucide-react';
import { cn } from '../../utils/cn';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/cursos', label: 'Cursos', icon: BookOpen },
  { to: '/actividades', label: 'Actividades', icon: ClipboardList },
  { to: '/calendario', label: 'Calendario', icon: Calendar },
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 flex flex-col bg-[#150A21] border-r border-gray-800',
          'transition-transform duration-200 ease-in-out lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#7B3FE4] rounded-lg flex items-center justify-center font-bold text-white text-sm">
              P
            </div>
            <span className="text-lg font-bold text-white tracking-tight">PredictUNI</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white"
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[#7B3FE4]/15 text-[#9b66f2]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-gray-800 text-xs text-gray-500">
          Anticípate a la sobrecarga académica
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
