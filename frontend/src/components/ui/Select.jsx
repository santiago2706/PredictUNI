import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

const Select = ({ label, id, error, options, placeholder, className, ...props }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-200">
          {label}
        </label>
      )}

      <div className="relative">
        <select
          id={id}
          className={cn(
            'w-full appearance-none px-4 py-3 pr-10 bg-[#1A1025] border rounded-lg text-white',
            'focus:outline-none focus:ring-2 transition-all duration-200',
            'border-gray-700 focus:ring-[#7B3FE4] focus:border-[#7B3FE4]',
            !props.value && 'text-gray-500',
            error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
            className
          )}
          {...props}
        >
          <option value="" disabled hidden>
            {placeholder ?? 'Selecciona una opción'}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-white bg-[#1A1025]">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={18}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
      </div>

      {error && (
        <span className="text-xs text-red-400 mt-1 font-medium animate-pulse">{error}</span>
      )}
    </div>
  );
};

export default Select;
