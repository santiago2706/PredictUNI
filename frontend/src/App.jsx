import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/dashboard/DashboardPage';
import CursosPage from './pages/dashboard/CursosPage';
import CalendarioPage from './pages/dashboard/CalendarioPage';

// 1. Creamos el "Guardia" para las rutas privadas
const ProtectedRoute = () => {
  // Buscamos el token que guardaremos cuando el login en FastAPI sea exitoso
  const isAuthenticated = localStorage.getItem('access_token') !== null;
  
  // Si está autenticado, renderiza las rutas hijas (<Outlet />). Si no, redirige al login.
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
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
