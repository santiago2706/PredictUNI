import React, { useState } from 'react';
import InputField from '../ui/InputField';
import Select from '../ui/Select';
import Button from '../ui/Button';

const TIPO_OPTIONS = [
  { value: 'Examen', label: 'Examen' },
  { value: 'Trabajo', label: 'Trabajo' },
  { value: 'Exposición', label: 'Exposición' },
  { value: 'Práctica', label: 'Práctica' },
  { value: 'Otro', label: 'Otro' },
];

const DIFICULTAD_OPTIONS = [
  { value: '1', label: 'Baja' },
  { value: '1.2', label: 'Media' },
  { value: '1.5', label: 'Alta' },
];

const PRIORIDAD_OPTIONS = [
  { value: 'Baja', label: 'Baja' },
  { value: 'Media', label: 'Media' },
  { value: 'Alta', label: 'Alta' },
];

const todayISO = () => new Date().toISOString().split('T')[0];
const maxDateISO = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split('T')[0];
};

const INITIAL_STATE = {
  nombre: '',
  tipo: '',
  tipo_otro: '',
  fecha_entrega: '',
  horas_estimadas: '',
  peso_dificultad: '',
  prioridad: '',
};

const ActivityForm = ({ onActivityCreated }) => {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

const MAX_HORAS = 100;

const handleChange = (e) => {
    const { id, value } = e.target;

    if (id === 'horas_estimadas') {
      if (value !== '' && !/^\d*\.?\d*$/.test(value)) return;
      if (value !== '' && Number(value) > MAX_HORAS) return;
    }

    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: undefined }));
  };

  const handleDateBlur = () => {
    if (!formData.fecha_entrega) return;
    if (formData.fecha_entrega < todayISO()) {
      setFormData((prev) => ({ ...prev, fecha_entrega: todayISO() }));
    } else if (formData.fecha_entrega > maxDateISO()) {
      setFormData((prev) => ({ ...prev, fecha_entrega: maxDateISO() }));
    }
  };

  const validate = () => {
    const next = {};
    if (!formData.nombre.trim()) next.nombre = 'Ingresa el nombre de la actividad';
    if (!formData.tipo) next.tipo = 'Selecciona el tipo';
    if (formData.tipo === 'Otro' && !formData.tipo_otro.trim()) {
      next.tipo_otro = 'Especifica el tipo de actividad';
    } 
    if (!formData.fecha_entrega) {
      next.fecha_entrega = 'Selecciona la fecha de entrega';
      next.fecha_entrega = 'La fecha debe ser hoy o futura';
    } else if (formData.fecha_entrega > maxDateISO()) {
      next.fecha_entrega = 'La fecha es demasiado lejana';
    } else if (formData.fecha_entrega < todayISO()) {
      next.fecha_entrega = 'La fecha debe ser hoy o futura';
    }
    if (!formData.horas_estimadas || Number(formData.horas_estimadas) <= 0) {
      next.horas_estimadas = 'Ingresa horas estimadas mayores a 0';
    }
    if (!formData.peso_dificultad) next.peso_dificultad = 'Selecciona la dificultad';
    if (!formData.prioridad) next.prioridad = 'Selecciona la prioridad';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate() || isLoading) return;

    setIsLoading(true);

    // Payload listo para POST /activities (S2-01); por ahora se simula
    // hasta que el endpoint real esté disponible.
    const payload = {
      nombre: formData.nombre.trim(),
      tipo: formData.tipo === 'Otro' ? formData.tipo_otro.trim() : formData.tipo,
      fecha_entrega: formData.fecha_entrega,
      horas_estimadas: Number(formData.horas_estimadas),
      peso_dificultad: Number(formData.peso_dificultad),
      prioridad: formData.prioridad,
    };
    console.log('Payload de Actividad listo:', payload);

    setTimeout(() => {
      onActivityCreated?.(payload);
      setFormData(INITIAL_STATE);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <InputField
        label="Nombre de la actividad"
        id="nombre"
        type="text"
        placeholder="Examen Cálculo I"
        value={formData.nombre}
        onChange={handleChange}
        error={errors.nombre}
      />

      <Select
        label="Tipo"
        id="tipo"
        placeholder="Selecciona el tipo"
        options={TIPO_OPTIONS}
        value={formData.tipo}
        onChange={handleChange}
        error={errors.tipo}
      />
      {formData.tipo === 'Otro' && (
        <InputField
          label="Especifica el tipo"
          id="tipo_otro"
          type="text"
          placeholder="Ej. Laboratorio, Reunion, etc."
          value={formData.tipo_otro}
          onChange={handleChange}
          error={errors.tipo_otro}
        />
      )}      
      <InputField
        label="Fecha de entrega"
        id="fecha_entrega"
        type="date"
        min={todayISO()}
        max={maxDateISO()}
        value={formData.fecha_entrega}
        onChange={handleChange}
        onBlur={handleDateBlur}
        error={errors.fecha_entrega}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField
          label="Horas estimadas"
          id="horas_estimadas"
          type="text"
          inputMode="decimal"
          placeholder="6"
          value={formData.horas_estimadas}
          onChange={handleChange}
          error={errors.horas_estimadas}
        />

        <Select
          label="Dificultad"
          id="peso_dificultad"
          placeholder="Selecciona"
          options={DIFICULTAD_OPTIONS}
          value={formData.peso_dificultad}
          onChange={handleChange}
          error={errors.peso_dificultad}
        />
      </div>

      <Select
        label="Prioridad"
        id="prioridad"
        placeholder="Selecciona la prioridad"
        options={PRIORIDAD_OPTIONS}
        value={formData.prioridad}
        onChange={handleChange}
        error={errors.prioridad}
      />

      <Button type="submit" isLoading={isLoading}>
        Registrar actividad
      </Button>
    </form>
  );
};

export default ActivityForm;
