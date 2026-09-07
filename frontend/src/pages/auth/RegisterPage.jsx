import { useState } from 'react';
import AuthLayout from '../../layouts/AuthLayout';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';

const RegisterPage = ({ onSwitchView }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setError(''); // Limpiamos el error al escribir
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación de negocio en el frontend
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);
    
    // Simulación del payload para S1-08 (POST /auth/register)
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password
    };
    console.log("Payload de Registro listo:", payload);
    
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
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
          error={error} // Aquí inyectamos el error visual si no coinciden
        />

        <Button type="submit" isLoading={isLoading}>
          Crear Cuenta
        </Button>

        <p className="text-center text-sm text-gray-400 mt-4">
          ¿Ya tienes cuenta?{' '}
          <button 
            type="button" 
            onClick={onSwitchView}
            className="text-[#7B3FE4] hover:text-[#9b66f2] font-semibold transition-colors"
          >
            Inicia sesión
          </button>
        </p>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;