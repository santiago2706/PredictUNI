import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import CourseForm from '../../components/courses/CourseForm';

const DIFFICULTY_LABELS = { 1: 'Baja', 2: 'Media', 3: 'Alta' };

const CursosPage = () => {
  const [courses, setCourses] = useState([]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-2 rounded-xl border border-gray-800 bg-[#150A21] p-6">
        <h2 className="text-white font-semibold mb-4">Registrar curso</h2>
        <CourseForm onCourseCreated={(course) => setCourses((prev) => [...prev, course])} />
      </div>

      <div className="lg:col-span-3 rounded-xl border border-gray-800 bg-[#150A21] p-6">
        <h2 className="text-white font-semibold mb-4">Tus cursos</h2>

        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12 text-gray-500">
            <BookOpen size={28} className="mb-3 opacity-60" />
            <p className="text-sm">Aún no tienes cursos registrados.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {courses.map((course, i) => (
              <li
                key={`${course.code}-${i}`}
                className="flex items-center justify-between rounded-lg border border-gray-800 bg-[#1A1025] px-4 py-3"
              >
                <div>
                  <p className="text-white text-sm font-medium">{course.name}</p>
                  <p className="text-gray-500 text-xs">
                    {course.code} · {course.credits} créditos
                  </p>
                </div>
                <span className="text-xs font-medium text-[#9b66f2] bg-[#7B3FE4]/15 px-2 py-1 rounded-md">
                  {DIFFICULTY_LABELS[course.difficulty_weight]}
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
