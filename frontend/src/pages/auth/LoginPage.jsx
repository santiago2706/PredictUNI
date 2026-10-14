import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';
import { API_BASE, saveSession } from '../../utils/api';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState(location.state?.message || '');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setServerError('');
    
    try {
      // 1. Conexión con FastAPI
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Credenciales inválidas. Inténtalo nuevamente.');
      }

      // 2. Captura y almacenamiento del access_token + refresh_token
      saveSession(data);

      // 3. Redirección Automática al Dashboard
      navigate('/dashboard');

    } catch (error) {
      setServerError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Inicia sesión en tu cuenta" 
      subtitle="Anticípate a la sobrecarga académica"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <InputField 
          label="Correo Institucional"
          id="email"
          type="email"
          placeholder="tu_correo@uni.pe"
          required
          value={formData.email}
          onChange={handleChange}
        />
        
        <InputField 
          label="Contraseña"
          id="password"
          type="password"
          placeholder="••••••••"
          required
          minLength={8}
          value={formData.password}
          onChange={handleChange}
        />

        {serverError && (
          <p className="text-red-500 text-sm text-center font-medium">
            {serverError}
          </p>
        )}

        <Button type="submit" isLoading={isLoading}>
          Ingresar al Sistema
        </Button>
      </form>

      <p className="text-center text-sm text-gray-400 mt-4">
        ¿No tienes cuenta?{' '}
        <Link 
          to="/register"
          className="text-[#7B3FE4] hover:text-[#9b66f2] font-semibold transition-colors"
        >
          Regístrate aquí
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;