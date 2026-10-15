import { activityErrors, apiError, localDate } from '../../utils/validation';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../ui/InputField';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { authFetch, clearSession, SESSION_EXPIRED_MESSAGE } from '../../utils/api';

const TIPO_OPTIONS = [
  { value: 'Examen', label: 'Examen' },
  { value: 'Trabajo', label: 'Trabajo' },
  { value: 'Exposición', label: 'Exposición' },
  { value: 'Práctica', label: 'Práctica' },
  { value: 'Otro', label: 'Otro' },
];

const DIFICULTAD_OPTIONS = [
  { value: '1', label: 'Baja' },
  { value: '2', label: 'Media' },
  { value: '3', label: 'Alta' },
];

const PRIORIDAD_OPTIONS = [
  { value: 'Baja', label: 'Baja' },
  { value: 'Media', label: 'Media' },
  { value: 'Alta', label: 'Alta' },
];

const todayISO = () => localDate();
const maxDateISO = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return localDate(d);
};

const INITIAL_STATE = {
  curso_id: '',
  nombre: '',
  tipo: '',
  tipo_otro: '',
  fecha_entrega: '',
  horas_estimadas: '',
  peso_dificultad: '',
  prioridad: '',
};

const ActivityForm = ({ onActivityCreated }) => {
  const navigate = useNavigate();
  const pending = useRef(false);
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  const handleSessionExpired = useCallback(() => {
    clearSession();
    navigate('/login', { replace: true, state: { message: SESSION_EXPIRED_MESSAGE } });
  }, [navigate]);

  useEffect(() => {
    const fetchCourses = async () => {
      setCoursesLoading(true);
      try {
        const res = await authFetch('/courses/');

        if (res.status === 401) return handleSessionExpired();
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

        const data = await res.json().catch(() => ({}));
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        setServerError('No se pudieron cargar los cursos. Vuelve a abrir el formulario. ' + err.message);
      } finally {
        setCoursesLoading(false);
      }
    };
    fetchCourses();
  }, [handleSessionExpired]);

  const courseOptions = courses.map((c) => ({ value: c.id, label: `${c.name}${c.code ? ` (${c.code})` : ''}` }));

  const handleChange = (e) => {
    const { id, value } = e.target;


    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors(activityErrors({ ...formData, [id]: value }, courses, todayISO(), maxDateISO()));
  };

  const validate = () => {
    const next = activityErrors(formData, courses, todayISO(), maxDateISO());
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pending.current) return;
    if (!validate() || isLoading) return;

    pending.current = true;
    setIsLoading(true);
    setServerError('');

    const payload = {
      course_id: formData.curso_id,
      name: formData.nombre.trim(),
      type: formData.tipo === 'Otro' ? formData.tipo_otro.trim() : formData.tipo,
      due_date: formData.fecha_entrega,
      estimated_hours: Number(formData.horas_estimadas),
      difficulty: Number(formData.peso_dificultad),
      priority: formData.prioridad,
    };

    try {
      const res = await authFetch('/activities/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.status === 401) return handleSessionExpired();

      const data = await res.json();
      if (!res.ok) throw new Error(apiError(data.detail, 'No se pudo registrar la actividad.'));

      onActivityCreated?.(data);
      setFormData(INITIAL_STATE);
    } catch (error) {
      setServerError(error.message);
    } finally {
      pending.current = false;
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate onBlur={validate}>
      {!coursesLoading && courses.length === 0 ? (
        <p className="text-sm text-gray-400 bg-black/20 rounded-lg px-3 py-2">
          Todavía no tienes cursos registrados. Registra uno primero en la sección Cursos.
        </p>
      ) : (
        <Select
          label="Curso"
          id="curso_id"
          placeholder={coursesLoading ? 'Cargando cursos...' : 'Selecciona el curso'}
          options={courseOptions}
          value={formData.curso_id}
          onChange={handleChange}
          error={errors.curso_id}
          disabled={coursesLoading}
        />
      )}

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
        error={errors.fecha_entrega}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField
          label="Horas estimadas"
          id="horas_estimadas"
          type="text"
          inputMode="numeric"
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

      {serverError && (
        <p role="alert" className="text-red-400 text-sm text-center font-medium">{serverError}</p>
      )}

      <Button type="submit" isLoading={isLoading} disabled={coursesLoading || !courses.length}>
        Registrar actividad
      </Button>
    </form>
  );
};

export default ActivityForm;
