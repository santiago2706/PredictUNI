export default function Brand({ compact = false }) {
  return <span className="inline-flex items-center gap-2.5"><img src={import.meta.env.BASE_URL + 'predictuni.svg'} width={compact ? 32 : 42} height={compact ? 32 : 42} alt="" /><span className={compact ? 'text-lg font-bold text-white tracking-tight' : 'text-2xl font-bold text-white tracking-tight'}>Predict<span className="text-violet-300">UNI</span></span></span>;
}
