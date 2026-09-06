import React from 'react';
import { cn } from '../../utils/cn';

const InputField = ({ label, id, error, className, ...props }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-200">
          {label} 
        </label>
      )}
      
      <input
        id={id}
        className={cn(
          // Clases base (siempre se aplican)
          "w-full px-4 py-3 bg-[#1A1025] border rounded-lg text-white placeholder-gray-500",
          "focus:outline-none focus:ring-2 transition-all duration-200",
          "border-gray-700 focus:ring-[#7B3FE4] focus:border-[#7B3FE4]",
          // Clases condicionales (solo si hay error, sobreescribiendo el borde normal)
          error && "border-red-500 focus:ring-red-500 focus:border-red-500",
          // Clases extra pasadas desde el padre (permiten customizar el input si se requiere)
          className
        )}
        {...props}
      />
      
      {error && (
        <span className="text-xs text-red-400 mt-1 font-medium animate-pulse">
          {error}
        </span>
      )}
    </div>
  );
};

export default InputField;
