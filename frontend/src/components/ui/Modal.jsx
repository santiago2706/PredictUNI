import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center overflow-y-auto p-4 bg-black/70"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md my-8 sm:my-0 max-h-[calc(100vh-4rem)] flex flex-col rounded-xl border border-gray-800 bg-[#150A21] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-5 shrink-0">
          <h2 className="text-white font-semibold text-lg">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 pb-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
