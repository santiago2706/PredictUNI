import React from 'react';
import { cn } from '../../utils/cn';

const Button = ({ children, isLoading, className, ...props }) => {
  return (
    <button
      disabled={isLoading}
      className={cn(
        "w-full flex justify-center items-center py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200",
        "bg-[#7B3FE4] hover:bg-[#6A32C9] focus:ring-2 focus:ring-offset-2 focus:ring-[#7B3FE4] focus:ring-offset-[#0D0614]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;