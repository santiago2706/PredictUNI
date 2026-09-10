import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/dashboard/DashboardPage';
import CursosPage from './pages/dashboard/CursosPage';
import ActividadesPage from './pages/dashboard/ActividadesPage';
import CalendarioPage from './pages/dashboard/CalendarioPage';

// Guardián de rutas validando estrictamente 'access_token'
const ProtectedRoute = () => {
  const token = localStorage.getItem('access_token');
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rutas Privadas: Envolvemos el DashboardLayout con nuestro ProtectedRoute */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/cursos" element={<CursosPage />} />
            <Route path="/actividades" element={<ActividadesPage />} />
            <Route path="/calendario" element={<CalendarioPage />} />
          </Route>
        </Route>

        {/* Catch-all: Cualquier ruta no definida va al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
