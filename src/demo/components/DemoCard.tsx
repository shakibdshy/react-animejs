import { type ReactNode } from "react";
import { RotateCcw } from "lucide-react";

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
  isPlaying,
  className = "",
  code,
}) => {
  return (
    <div
      className={`w-full bg-demo-card rounded-2xl p-5 border border-demo-border flex flex-col transition-all duration-300 hover:border-demo-border-hover hover:shadow-[0_8px_32px_rgba(0,0,0,0.15)] ${className}`}
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="text-demo-accent landing-font-display text-base font-medium tracking-tight">
            {title}
          </h4>
          {description && (
            <p className="text-xs text-demo-text-secondary mt-1 max-w-xs leading-relaxed">
              {description}
            </p>
          )}
        </div>
        <div className="flex gap-1.5">
          {actions}
          {controls?.restart && (
            <button
              onClick={() => controls.restart?.()}
              className="p-1.5 hover:bg-demo-border/40 rounded-lg text-demo-text-secondary hover:text-demo-accent transition-colors duration-200 cursor-pointer"
              title="Restart"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="bg-demo-bg rounded-xl p-6 relative min-h-45 flex items-center justify-center overflow-hidden border border-demo-border/40 flex-1">
        {children}

        {controls?.play &&
          !isPlaying &&
          (state?.progress === 0 || state?.completed) && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-demo-bg/60 backdrop-blur-[2px] cursor-pointer z-10 transition-all hover:bg-demo-bg/40"
              onClick={() => controls.play?.()}
            >
              <div className="w-12 h-12 bg-demo-accent rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
                <div className="ml-0.5 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-12 border-l-demo-bg" />
              </div>
            </div>
          )}
      </div>

      {(state?.progress !== undefined || code) && (
        <div className="mt-4 flex flex-col gap-2.5">
          {state?.progress !== undefined && (
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[10px] landing-font-mono text-demo-text-muted uppercase tracking-widest">
                <span>Progress</span>
                <span>{Math.round((state.progress || 0) * 100)}%</span>
              </div>
              <div className="h-1 bg-demo-border/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-demo-accent transition-all duration-100 ease-out"
                  style={{ width: `${(state.progress || 0) * 100}%` }}
                />
              </div>
            </div>
          )}

          {code && (
            <div className="text-[11px] text-demo-text-secondary landing-font-mono bg-demo-surface p-3 rounded-lg border border-demo-border/40 overflow-x-auto whitespace-nowrap">
              <code className="text-demo-accent/80">{code}</code>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
