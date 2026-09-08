import React from 'react';

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-[#0D0614] flex items-center justify-center text-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#7B3FE4] mb-4">¡Bienvenido al Dashboard!</h1>
        <p className="text-gray-400">Si estás viendo esto, el JWT se guardó correctamente.</p>
      </div>
    </div>
  );
};

export default DashboardPage;
