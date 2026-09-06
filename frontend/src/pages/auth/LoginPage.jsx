import React, { useState } from 'react';
import AuthLayout from '../../layouts/AuthLayout';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulación de petición al backend de FastAPI
    console.log("Payload listo para S1-08:", formData);
    
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
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
    </AuthLayout>
  );
};

export default LoginPage;