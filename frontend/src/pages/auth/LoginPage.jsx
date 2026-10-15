import { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';
import { API_BASE, saveSession } from '../../utils/api';
import { authErrors, apiError } from '../../utils/validation';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const pending = useRef(false);
  const location = useLocation();
  const [serverError, setServerError] = useState(location.state?.message || '');

  const navigate = useNavigate();
  const validate = (data) => authErrors(data, false);
  const handleChange = ({ target: { id, value } }) => {
    const next = { ...formData, [id]: value };
    setFormData(next);
    if (touched[id]) setErrors(validate(next));
    setServerError('');
  };
  const blur = ({ target: { id } }) => {
    setTouched(prev => ({ ...prev, [id]: true }));
    setErrors(validate(formData));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (pending.current) return;
    const next = validate(formData);
    setErrors(next);
    setTouched(Object.fromEntries(Object.keys(formData).map(key => [key, true])));
    if (Object.keys(next).length) { document.getElementById(Object.keys(next)[0])?.focus(); return; }
    pending.current = true;
    setIsLoading(true);
    setServerError('');
    try {
      const response = await fetch(API_BASE + '/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(apiError(data.detail, 'No se pudo iniciar sesión. Revisa tu correo y contraseña.'));
      saveSession(data);
      navigate('/dashboard');
    } catch (error) {
      setServerError(error instanceof TypeError ? 'No se pudo conectar con el servidor. Inténtalo nuevamente.' : error.message);
    } finally { pending.current = false; setIsLoading(false); }
  };
  return <AuthLayout title="Qué bueno tenerte de vuelta." subtitle="Ingresa a tu espacio de planificación académica.">
    <form noValidate onSubmit={handleSubmit} className="space-y-5">

      <InputField label="Correo electrónico" id="email" type="email" autoComplete="email" placeholder="nombre@ejemplo.com" value={formData.email} onChange={handleChange} onBlur={blur} error={touched.email && errors.email} required />
      <InputField label="Contraseña" id="password" type="password" autoComplete="current-password" placeholder="Ingresa tu contraseña"  value={formData.password} onChange={handleChange} onBlur={blur} error={touched.password && errors.password} required />

      {serverError && <p role="alert" className="text-red-300 text-sm rounded-lg border border-red-400/25 bg-red-400/5 p-3">{serverError}</p>}
      <Button type="submit" isLoading={isLoading} className="auth-submit gap-3">Iniciar sesión <ArrowRight size={18} /></Button>
      <p className="text-center text-sm text-gray-400 pt-2">¿Aún no tienes cuenta? <Link to="/register" className="text-violet-300 font-semibold hover:text-violet-200 underline-offset-4 hover:underline">Crea tu cuenta</Link></p>
    </form>
  </AuthLayout>;
}
