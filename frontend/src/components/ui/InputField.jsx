import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function InputField({ label, id, error, hint, className, type = 'text', ...props }) {
  const [visible, setVisible] = useState(false);
  const password = type === 'password';
  return <div className="flex flex-col gap-1 w-full">
    {label && <label htmlFor={id} className="text-sm font-medium text-gray-200">{label}</label>}
    <div className="relative">
      <input {...props} id={id} name={id} type={password && visible ? 'text' : type}
        aria-invalid={!!error || props['aria-invalid']} aria-describedby={[error && id + '-error', hint && id + '-hint', props['aria-describedby']].filter(Boolean).join(' ') || undefined}
        className={cn('w-full px-4 py-3 bg-[#1A1025] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 border-gray-700 focus:ring-[#7B3FE4] focus:border-[#7B3FE4]', password && 'pr-14', error && 'border-red-500 focus:ring-red-500 focus:border-red-500', className)} />
      {password && <button type="button" aria-label={(visible ? 'Ocultar ' : 'Mostrar ') + label.toLowerCase()} aria-pressed={visible} onClick={() => setVisible(!visible)} className="absolute right-1 top-1 rounded-md p-3 text-gray-400 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-400">{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button>}
    </div>
    {hint && <p id={id + '-hint'} className="text-xs text-gray-400 mt-1">{hint}</p>}
    {error && <p id={id + '-error'} role="alert" className="text-xs text-red-400 mt-1 font-medium">{error}</p>}
  </div>;
}
