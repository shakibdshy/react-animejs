import { ArrowDown } from 'lucide-react';

export function ScrollHint({ label = 'Scroll inside the panel below' }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-demo-text-muted">
      <ArrowDown className="h-3.5 w-3.5 text-demo-accent" />
      {label}
    </div>
  );
}

export function Panel({
  children,
  containerRef,
  className = '',
}: {
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
}) {
  return (
    <div
      ref={containerRef}
      className={`relative h-72 overflow-y-auto rounded-2xl border border-demo-border bg-linear-to-b from-[#09090e] via-[#0d0d15] to-[#09090e] ${className}`}
    >
      {children}
    </div>
  );
}

export function MetricPill({
  label,
  value,
  tone = 'text-slate-200',
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/20 px-3 py-2 text-[10px] font-mono uppercase tracking-[0.2em] text-demo-text-muted">
      {label} <span className={tone}>{value}</span>
    </div>
  );
}
