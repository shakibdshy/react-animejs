import { type ReactNode, useState } from "react";
import { Code, Play, RotateCcw } from "lucide-react";
import { CodeModal } from "@/blocks/components/CodeModal";

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
  const [isCodeOpen, setIsCodeOpen] = useState(false);

  return (
    <div
      className={`demo-example-card min-h-[32rem] w-full bg-landing-surface border border-landing-border rounded-2xl p-6 flex flex-col transition-all duration-500 hover:border-landing-accent/30 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] ${className}`}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
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
          {code ? (
            <button
              type="button"
              onClick={() => setIsCodeOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 landing-font-mono text-[10px] uppercase tracking-wider text-landing-muted transition-colors hover:bg-landing-border/50 hover:text-landing-accent"
              aria-label={`View ${title} code`}
            >
              <Code className="h-3.5 w-3.5" aria-hidden />
              Code
            </button>
          ) : null}
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

      {state?.progress !== undefined && (
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
        </div>
      )}
      {code ? (
        <CodeModal
          open={isCodeOpen}
          title={`${title}.tsx`}
          code={code}
          onClose={() => setIsCodeOpen(false)}
        />
      ) : null}
    </div>
  );
};
