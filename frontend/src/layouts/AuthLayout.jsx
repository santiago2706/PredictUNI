import React from 'react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-[#0D0614] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Aquí iría el logo de PredictUNI si lo tienes como SVG/IMG */}
        <div className="flex justify-center items-center gap-2 mb-6">
          <div className="w-10 h-10 bg-[#7B3FE4] rounded-lg flex items-center justify-center font-bold text-white text-xl">P</div>
          <span className="text-2xl font-bold text-white tracking-tight">PredictUNI</span>
        </div>
        
        <h2 className="mt-2 text-3xl font-extrabold text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-sm text-gray-400">
            {subtitle}
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#150A21] py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10 border border-gray-800">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;