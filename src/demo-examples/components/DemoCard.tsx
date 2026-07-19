import { type ReactNode } from "react";
import { Play, RotateCcw } from "lucide-react";

interface DemoCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  controls?: {
    play?: () => void;
    pause?: () => void;
    restart?: () => void;
    reset?: () => void;
  };
  state?: {
    progress?: number;
    completed?: boolean;
  };
  isPlaying?: boolean;
  className?: string;
  code?: string;
}

export const DemoCard: React.FC<DemoCardProps> = ({
  title,
  description,
  children,
  actions,
  controls,
  state,
  className = "",
  code,
}) => {
  return (
    <div
      className={`w-full bg-landing-surface border border-landing-border rounded-2xl p-6 flex flex-col transition-all duration-500 hover:border-landing-accent/30 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] ${className}`}
    >
      <div className="flex justify-between items-center mb-5">
        <div>
          <h4 className="text-landing-accent landing-font-display text-lg font-bold tracking-tight">
            {title}
          </h4>
          {description && (
            <p className="text-xs text-landing-muted mt-1.5 max-w-xs leading-relaxed">
              {description}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {actions}
          {controls?.play && (
            <button
              onClick={() => controls.play?.()}
              className="p-1.5 hover:bg-landing-border/50 rounded-lg text-landing-muted hover:text-landing-accent transition-colors duration-200 cursor-pointer"
              title="Play Sequence"
            >
              <Play className="w-4 h-4" />
            </button>
          )}
          {controls?.restart && (
            <button
              onClick={() => controls.restart?.()}
              className="p-1.5 hover:bg-landing-border/50 rounded-lg text-landing-muted hover:text-landing-accent transition-colors duration-200 cursor-pointer"
              title="Restart / Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="bg-landing-bg/50 rounded-xl p-6 relative min-h-48 flex items-center justify-center overflow-hidden border border-landing-border/40 flex-1">
        {children}
      </div>

      {(state?.progress !== undefined || code) && (
        <div className="mt-5 flex flex-col gap-3">
          {state?.progress !== undefined && (
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[10px] landing-font-mono text-landing-muted uppercase tracking-widest">
                <span>Progress</span>
                <span>{Math.round((state.progress || 0) * 100)}%</span>
              </div>
              <div className="h-1 bg-landing-border/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-landing-accent transition-all duration-100 ease-out"
                  style={{ width: `${(state.progress || 0) * 100}%` }}
                />
              </div>
            </div>
          )}

          {code && (
            <div className="text-[11px] text-landing-muted landing-font-mono bg-landing-bg p-3.5 rounded-xl border border-landing-border/40 overflow-x-auto whitespace-nowrap">
              <code className="text-landing-accent">{code}</code>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
