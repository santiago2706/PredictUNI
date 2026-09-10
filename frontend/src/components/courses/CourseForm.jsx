import React, { useState } from 'react';
import InputField from '../ui/InputField';
import Select from '../ui/Select';
import Button from '../ui/Button';

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

  const handleChange = (e) => {
    const { id, value } = e.target;

    // Créditos: solo dígitos
    if (id === 'credits' && value !== '' && !/^\d+$/.test(value)) return;

    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: undefined }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate() || isLoading) return;

    setIsLoading(true);

    // Payload listo para S1-07 (POST /courses); por ahora se simula la petición
    // hasta que la integración real (S1-09) esté disponible.
    const payload = {
      name: formData.name.trim(),
      code: formData.code.trim(),
      credits: Number(formData.credits),
      difficulty_weight: Number(formData.difficulty),
    };
    console.log('Payload de Curso listo:', payload);

    setTimeout(() => {
      onCourseCreated?.(payload);
      setFormData(INITIAL_STATE);
      setIsLoading(false);
    }, 1000);
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

      <Button type="submit" isLoading={isLoading}>
        Agregar curso
      </Button>
    </form>
  );
};

export default CourseForm;
