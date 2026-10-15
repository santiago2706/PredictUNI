import { BookOpen, ChartNoAxesCombined, CalendarClock, ArrowUpRight } from 'lucide-react';
import Brand from '../components/ui/Brand';
import './auth.css';

export default function AuthLayout({ children, title, subtitle }) {
  return <main className="auth-shell">
    <section className="auth-entry">
      <header><Brand /><span className="auth-eyebrow">TU CICLO, CON PERSPECTIVA</span></header>
      <div className="auth-form-wrap"><div className="auth-heading"><span className="auth-kicker">PLANIFICA HOY. ANTICÍPATE A MAÑANA.</span><h1>{title}</h1><p>{subtitle}</p></div>{children}</div>
      <footer>PredictUNI <span>Organización académica con intención.</span></footer>
    </section>
    <aside className="auth-story">
      <div className="auth-story-top"><span className="auth-pill"><span /> Gestión académica preventiva</span><ArrowUpRight size={22} /></div>
      <div className="auth-story-content"><p className="auth-kicker">MÁS CLARIDAD. MEJOR EQUILIBRIO.</p><h2>Un paso adelante<br />de tu <em>carga académica.</em></h2><p className="auth-description">Conecta tus cursos, tus pendientes y tu tiempo disponible. Toma decisiones antes de que todo se acumule.</p>
        <div className="auth-orbit" aria-hidden="true"><div className="orbit-ring" /><div className="orbit-ring inner" /><img src={import.meta.env.BASE_URL + 'predictuni.svg'} alt="" /><span className="orbit-label label-one"><BookOpen size={16} /> Tus cursos</span><span className="orbit-label label-two"><CalendarClock size={16} /> Tu tiempo</span><span className="orbit-label label-three"><ChartNoAxesCombined size={16} /> Tu perspectiva</span></div>
        <div className="auth-features"><div><span>01</span><strong>Organiza</strong><p>Cursos y actividades en un solo lugar.</p></div><div><span>02</span><strong>Anticipa</strong><p>Identifica semanas de mayor carga.</p></div><div><span>03</span><strong>Decide</strong><p>Explora escenarios para planificar.</p></div></div>
      </div><footer>Diseñado para una vida universitaria en equilibrio.</footer>
    </aside>
  </main>;
}
