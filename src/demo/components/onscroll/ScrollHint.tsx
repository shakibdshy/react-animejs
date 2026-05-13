import { ArrowDown } from 'lucide-react';

export function ScrollHint() {
  return (
    <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-demo-text-muted">
      <ArrowDown className="h-3.5 w-3.5 text-demo-accent" />
      Scroll the inner panel
    </div>
  );
}
