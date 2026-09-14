import React, { useState, useEffect, useCallback } from 'react';
import { BookOpen, RefreshCw } from 'lucide-react';
import CourseForm from '../../components/courses/CourseForm';

const API_BASE = 'http://localhost:8000';

const DIFFICULTY_LABELS = { 1: 'Baja', 2: 'Media', 3: 'Alta' };

const CursosPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE}/courses/`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

      const data = await response.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar los cursos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-2 rounded-xl border border-gray-800 bg-[#150A21] p-6">
        <h2 className="text-white font-semibold mb-4">Registrar curso</h2>
        <CourseForm onCourseCreated={(course) => setCourses((prev) => [...prev, course])} />
      </div>

      <div className="lg:col-span-3 rounded-xl border border-gray-800 bg-[#150A21] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">Tus cursos</h2>
          <button
            onClick={fetchCourses}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs font-medium text-[#9b66f2] hover:text-white transition-colors disabled:opacity-50"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Actualizar
          </button>
        </div>

        {loading && (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-14 rounded-lg bg-gray-700/30 animate-pulse" />
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="py-12 text-center">
            <p className="text-red-400 text-sm font-medium">No se pudo conectar con el servidor</p>
            <p className="text-gray-500 text-xs mt-1">{error}</p>
            <button
              onClick={fetchCourses}
              className="mt-4 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30 transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && courses.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-12 text-gray-500">
            <BookOpen size={28} className="mb-3 opacity-60" />
            <p className="text-sm">Aún no tienes cursos registrados.</p>
          </div>
        )}

        {!loading && !error && courses.length > 0 && (
          <ul className="space-y-2">
            {courses.map((course, i) => (
              <li
                key={course.id ?? `${course.code}-${i}`}
                className="flex items-center justify-between rounded-lg border border-gray-800 bg-[#1A1025] px-4 py-3"
              >
                <div>
                  <p className="text-white text-sm font-medium">{course.name}</p>
                  <p className="text-gray-500 text-xs">
                    {course.code} · {course.credits} créditos
                  </p>
                </div>
                <span className="text-xs font-medium text-[#9b66f2] bg-[#7B3FE4]/15 px-2 py-1 rounded-md">
                  {DIFFICULTY_LABELS[course.difficulty_weight] ?? '—'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CursosPage;
