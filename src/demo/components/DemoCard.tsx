import { type ReactNode } from "react";
import { Edit2, RotateCcw } from "lucide-react";

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
      className={`w-full bg-demo-card rounded-3xl p-6 border border-demo-border shadow-xl flex flex-col ${className}`}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-demo-accent font-bold text-xl lowercase">
            {title}
          </h4>
          {description && (
            <p className="text-xs text-demo-text-secondary mt-1 mb-2 max-w-xs">
              {description}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {actions}
          {controls?.restart && (
            <button
              onClick={() => controls.restart?.()}
              className="p-1.5 hover:bg-white/5 rounded-md text-demo-text-secondary hover:text-demo-accent transition-colors duration-200 cursor-pointer"
              title="Restart"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          <button
            className="p-1.5 hover:bg-white/5 rounded-md text-demo-text-secondary hover:text-demo-accent transition-colors duration-200 cursor-pointer"
            title="View Code"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-demo-bg rounded-2xl p-8 relative min-h-[200px] flex items-center justify-center overflow-hidden border border-demo-border/50 flex-1">
        {children}

        {controls?.play &&
          !isPlaying &&
          (state?.progress === 0 || state?.completed) && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] cursor-pointer z-10 transition-all hover:bg-black/30"
              onClick={() => controls.play?.()}
            >
              <div className="w-14 h-14 bg-demo-accent rounded-full flex items-center justify-center shadow-[0_0_20px_var(--demo-accent)/0.3] hover:scale-110 transition-transform cursor-pointer">
                <div className="ml-0.5 w-0 h-0 border-t-10 border-t-transparent border-b-10 border-b-transparent border-l-16 border-l-demo-bg" />
              </div>
            </div>
          )}
      </div>

      {(state?.progress !== undefined || code) && (
        <div className="mt-6 flex flex-col gap-3">
          {state?.progress !== undefined && (
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[10px] font-mono text-demo-text-muted uppercase tracking-widest">
                <span>Progress</span>
                <span>{Math.round((state.progress || 0) * 100)}%</span>
              </div>
              <div className="h-1 bg-demo-border/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-demo-accent shadow-[0_0_10px_var(--demo-accent)/0.5] transition-all duration-100 ease-out"
                  style={{ width: `${(state.progress || 0) * 100}%` }}
                />
              </div>
            </div>
          )}

          {code && (
            <div className="text-[10px] text-demo-text-secondary font-mono bg-black/30 p-2.5 rounded-lg border border-demo-border overflow-x-auto whitespace-nowrap">
              <code className="text-demo-accent/80">{code}</code>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
