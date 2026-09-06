import InputField from '../ui/InputField';

// Dentro de tu componente de formulario:
<InputField 
  label="Correo Institucional"
  id="email"
  type="email"
  placeholder="tu_correo@uni.pe"
  required
  error={formErrors.email} // Si hay error, se pinta rojo automáticamente
  onChange={handleChange}
/>