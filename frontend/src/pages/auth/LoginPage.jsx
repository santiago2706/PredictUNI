import { useState } from 'react';
import AuthLayout from '../../layouts/AuthLayout';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = ({ onSwitchView }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const navigate = useNavigate();

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
      // 1. Conexión con FastAPI.
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // 4. Manejo de Errores (Edge Cases)
      if (!response.ok) {
        // FastAPI suele devolver el error en la propiedad 'detail'
        throw new Error(data.detail || 'Credenciales inválidas. Inténtalo nuevamente.');
      }

      // 2. Captura y Almacenamiento del JWT
      // OJO: Asegúrate de que FastAPI devuelve el token en data.access_token o data.token
      const token = data.access_token || data.token; 
      localStorage.setItem('token', token);

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

        <Button type="submit" isLoading={isLoading}>
          Ingresar al Sistema
        </Button>
      </form>
      <p className="text-center text-sm text-gray-400 mt-4">
          ¿No tienes cuenta?{' '}
          <button 
            type="button" 
            onClick={onSwitchView}
            className="text-[#7B3FE4] hover:text-[#9b66f2] font-semibold transition-colors"
          >
            Regístrate aquí
          </button>
        </p>
    </AuthLayout>
  );
};

export default LoginPage;