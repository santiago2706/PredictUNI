import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, RefreshCw, Clock } from 'lucide-react';
import CourseForm from '../../components/courses/CourseForm';
import { formatSessionSummary } from '../../utils/schedule';
import { authFetch, clearSession, SESSION_EXPIRED_MESSAGE } from '../../utils/api';

const DIFFICULTY_LABELS = { 1: 'Baja', 2: 'Media', 3: 'Alta' };

const CursosPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSessionExpired = useCallback(() => {
    clearSession();
    navigate('/login', { replace: true, state: { message: SESSION_EXPIRED_MESSAGE } });
  }, [navigate]);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authFetch('/courses/');

      if (response.status === 401) return handleSessionExpired();
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

      const data = await response.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar los cursos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [handleSessionExpired]);

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
                className="rounded-lg border border-gray-800 bg-[#1A1025] px-4 py-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-white text-sm font-medium">{course.name}</p>
                    <p className="text-gray-500 text-xs">
                      {course.code} · {course.credits} créditos
                    </p>
                  </div>
                  <span className="text-xs font-medium text-[#9b66f2] bg-[#7B3FE4]/15 px-2 py-1 rounded-md shrink-0">
                    {DIFFICULTY_LABELS[course.difficulty_weight] ?? '—'}
                  </span>
                </div>

                {course.schedule && (
                  <div className="mt-2.5 pt-2.5 border-t border-gray-800/80 flex items-start gap-2">
                    <Clock size={13} className="text-gray-500 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      {course.schedule.sessions?.length > 0 ? (
                        <p className="text-xs text-gray-400">
                          {course.schedule.sessions.map((s, idx) => (
                            <span key={idx}>
                              {formatSessionSummary(s)}
                              {s.type ? ` (${s.type})` : ''}
                              {idx < course.schedule.sessions.length - 1 ? ' · ' : ''}
                            </span>
                          ))}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-500">Sin sesiones semanales definidas</p>
                      )}
                      <p className="text-[11px] text-gray-600 mt-0.5">
                        Ciclo: {course.schedule.term_start} — {course.schedule.term_end}
                      </p>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CursosPage;
