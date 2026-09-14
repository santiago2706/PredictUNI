import React, { useState } from 'react';
import InputField from '../ui/InputField';
import Select from '../ui/Select';
import Button from '../ui/Button';

const API_BASE = 'http://localhost:8000';

const DIFFICULTY_OPTIONS = [
  { value: '1', label: 'Baja' },
  { value: '2', label: 'Media' },
  { value: '3', label: 'Alta' },
];

const INITIAL_STATE = { name: '', code: '', credits: '', difficulty: '' };

const CourseForm = ({ onCourseCreated }) => {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;

  // Créditos: 1 dígito del 1 al 9, con hasta 1 decimal opcional (ej. 4, 4.5)
    if (id === 'credits' && value !== '' && !/^[1-9]?(\.\d?)?$/.test(value)) return;

    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: undefined }));
  };
  const handleCreditsBlur = () => {
    const val = formData.credits;
    if (!val) return;
    if (!val.includes('.')) {
      setFormData((prev) => ({ ...prev, credits: `${val}.0` }));
    } else if (val.endsWith('.')) {
      setFormData((prev) => ({ ...prev, credits: `${val}0` }));
    }
  };
  const validate = () => {
    const next = {};
    if (!formData.name.trim()) next.name = 'Ingresa el nombre del curso';
    if (!formData.code.trim()) next.code = 'Ingresa el código del curso';
    if (!formData.credits) next.credits = 'Ingresa los créditos';
    if (!formData.difficulty) next.difficulty = 'Selecciona la dificultad';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || isLoading) return;

    setIsLoading(true);
    setServerError('');

    const payload = {
      name: formData.name.trim(),
      code: formData.code.trim(),
      credits: Number(formData.credits),
      difficulty_weight: Number(formData.difficulty),
    };

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE}/courses/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'No se pudo registrar el curso. Inténtalo nuevamente.');
      }

      onCourseCreated?.(data);
      setFormData(INITIAL_STATE);
    } catch (error) {
      setServerError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <InputField
        label="Nombre del curso"
        id="name"
        type="text"
        placeholder="Cálculo I"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField
          label="Código"
          id="code"
          type="text"
          placeholder="MA-101"
          value={formData.code}
          onChange={handleChange}
          onBlur={handleCreditsBlur}
          error={errors.code}
        />

        <InputField
          label="Créditos"
          id="credits"
          type="text"
          inputMode="numeric"
          placeholder="4"
          value={formData.credits}
          onChange={handleChange}
          error={errors.credits}
        />
      </div>

      <Select
        label="Dificultad"
        id="difficulty"
        placeholder="Selecciona la dificultad"
        options={DIFFICULTY_OPTIONS}
        value={formData.difficulty}
        onChange={handleChange}
        error={errors.difficulty}
      />

      {serverError && (
        <p className="text-red-400 text-sm text-center font-medium">{serverError}</p>
      )}

      <Button type="submit" isLoading={isLoading}>
        Agregar curso
      </Button>
    </form>
  );
};

export default CourseForm;
