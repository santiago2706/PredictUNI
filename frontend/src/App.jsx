import React from 'react';
import './App.css'
import LoginPage from './pages/auth/LoginPage';

function App() {
  return (
    // Temporalmente montamos LoginPage directo.
    // Más adelante aquí irá React Router (ej. <Route path="/login" element={<LoginPage />} />)
    <LoginPage />
  );
}

export default App;