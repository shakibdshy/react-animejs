import { cn } from './utils';

export function StatBlock({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl border border-landing-border bg-landing-bg/60">
      <span className="landing-font-mono text-[9px] tracking-[0.2em] uppercase text-landing-muted">
        {label}
      </span>
      <span
        className={cn(
          'landing-font-mono text-2xl font-bold',
          accent ? 'text-landing-accent' : 'text-landing-fg'
        )}
      >
        {value}
      </span>
    </div>
  );
}

export function DemoButton({
  children,
  onClick,
  variant = 'ghost',
  disabled,
  small,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'ghost' | 'accent' | 'surface';
  disabled?: boolean;
  small?: boolean;
}) {
  const base = cn(
    'rounded-lg font-medium transition-all duration-200 cursor-pointer select-none',
    small ? 'px-3 py-1.5 text-[11px]' : 'px-4 py-2 text-xs',
    disabled && 'opacity-30 cursor-not-allowed',
    variant === 'accent' && 'bg-landing-accent text-landing-bg hover:brightness-110',
    variant === 'surface' &&
      'bg-landing-surface border border-landing-border text-landing-fg hover:border-landing-accent/40 hover:text-landing-accent',
    variant === 'ghost' &&
      'text-landing-muted hover:text-landing-accent border border-landing-border hover:border-landing-accent/30'
  );
  return (
    <button onClick={onClick} disabled={disabled} className={base}>
      {children}
    </button>
  );
}

export function PreviewCard({
  title,
  description,
  children,
  controls,
  overflow = 'hidden',
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  controls?: React.ReactNode;
  /** Override the default overflow-hidden (e.g. for dropdowns that extend past the card). */
  overflow?: 'hidden' | 'visible';
}) {
  return (
    <div
      className={`bg-landing-bg/80 border border-landing-border rounded-xl ${overflow === 'visible' ? 'overflow-visible' : 'overflow-hidden'}`}
    >
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-landing-border">
        <div>
          <span className="landing-font-display text-sm text-landing-fg">{title}</span>
          {description && (
            <span className="ml-2 text-[11px] text-landing-muted">{description}</span>
          )}
        </div>
        {controls && <div className="flex gap-1.5">{controls}</div>}
      </div>
      <div className="p-5 flex items-center justify-center min-h-40">{children}</div>
    </div>
  );
}
