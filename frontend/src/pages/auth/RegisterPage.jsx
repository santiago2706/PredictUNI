import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setError(''); // Limpiamos el error al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación de negocio en el frontend
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const response = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Error al registrar el usuario');
      }

      setSuccessMessage('¡Cuenta creada exitosamente! Redirigiendo al login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Crea tu cuenta" 
      subtitle="Protege tu matrícula desde el primer día"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <InputField 
          label="Nombre Completo"
          id="name"
          type="text"
          placeholder="Juan Pérez"
          required
          value={formData.name}
          onChange={handleChange}
        />

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

        <InputField 
          label="Confirmar Contraseña"
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          required
          minLength={8}
          value={formData.confirmPassword}
          onChange={handleChange}
          error={error}
        />

        {successMessage && (
          <p className="text-green-400 text-sm text-center font-medium">
            {successMessage}
          </p>
        )}

        <Button type="submit" isLoading={isLoading}>
          Crear Cuenta
        </Button>

        <p className="text-center text-sm text-gray-400 mt-4">
          ¿Ya tienes cuenta?{' '}
          <Link 
            to="/login"
            className="text-[#7B3FE4] hover:text-[#9b66f2] font-semibold transition-colors"
          >
            Inicia sesión
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;