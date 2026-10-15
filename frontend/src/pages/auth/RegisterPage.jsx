import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';
import { API_BASE } from '../../utils/api';
import { authErrors, apiError } from '../../utils/validation';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const pending = useRef(false);
  const location = useLocation();
  const [serverError, setServerError] = useState(location.state?.message || '');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => navigate('/login'), 1500);
    return () => clearTimeout(timer);
  }, [success, navigate]);
  const validate = (data) => authErrors(data, true);
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
    if (pending.current || success) return;
    const next = validate(formData);
    setErrors(next);
    setTouched(Object.fromEntries(Object.keys(formData).map(key => [key, true])));
    if (Object.keys(next).length) { document.getElementById(Object.keys(next)[0])?.focus(); return; }
    pending.current = true;
    setIsLoading(true);
    setServerError('');
    try {
      const response = await fetch(API_BASE + '/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name.trim(), email: formData.email, password: formData.password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(apiError(data.detail, 'No se pudo crear la cuenta. Revisa tus datos e inténtalo nuevamente.'));
      setSuccess(true);
    } catch (error) {
      setServerError(error instanceof TypeError ? 'No se pudo conectar con el servidor. Inténtalo nuevamente.' : error.message);
    } finally { pending.current = false; setIsLoading(false); }
  };
  return <AuthLayout title="Tu próximo ciclo empieza aquí." subtitle="Crea tu cuenta y empieza a organizar tu vida académica.">
    {success ? <div role="status" className="space-y-5"><p className="text-emerald-300">¡Cuenta creada exitosamente! Redirigiendo al inicio de sesión…</p><Link className="auth-success-link" to="/login">Ir a iniciar sesión <ArrowRight size={18} /></Link></div> : <form noValidate onSubmit={handleSubmit} className="space-y-5">
      <InputField label="Nombre completo" id="name" autoComplete="name" placeholder="Tu nombre completo" value={formData.name} onChange={handleChange} onBlur={blur} error={touched.name && errors.name} required />
      <InputField label="Correo electrónico" id="email" type="email" autoComplete="email" placeholder="nombre@ejemplo.com" value={formData.email} onChange={handleChange} onBlur={blur} error={touched.email && errors.email} required />
      <InputField label="Contraseña" id="password" type="password" autoComplete="new-password" placeholder="Crea una contraseña" hint="Al menos 8 caracteres. Puedes usar símbolos y espacios." value={formData.password} onChange={handleChange} onBlur={blur} error={touched.password && errors.password} required />
      <InputField label="Confirmar contraseña" id="confirmPassword" type="password" autoComplete="new-password" placeholder="Repite tu contraseña" value={formData.confirmPassword} onChange={handleChange} onBlur={blur} error={touched.confirmPassword && errors.confirmPassword} required />
      {serverError && <p role="alert" className="text-red-300 text-sm rounded-lg border border-red-400/25 bg-red-400/5 p-3">{serverError}</p>}
      <Button type="submit" isLoading={isLoading} className="auth-submit gap-3">Crear cuenta <ArrowRight size={18} /></Button>
      <p className="text-center text-sm text-gray-400 pt-2">¿Ya tienes cuenta? <Link to="/login" className="text-violet-300 font-semibold hover:text-violet-200 underline-offset-4 hover:underline">Inicia sesión</Link></p>
    </form>}
  </AuthLayout>;
}
