import React, { type ReactNode } from "react";
import { Edit2, RotateCcw } from "lucide-react";

interface DemoCardProps {
  title: string;
  description?: string;
  children: ReactNode; // The canvas/animation area
  actions?: ReactNode; // Custom action buttons in header
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

/**
 * Standard card for individual demos with consistent styling,
 * controls, and progress indicators.
 */
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
      className={`w-full bg-[#1a1a24] rounded-3xl p-6 border border-[#2a2a3a] shadow-xl flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-[#ffd11a] font-bold text-xl lowercase">
            {title}
          </h4>
          {description && (
            <p className="text-xs text-slate-500 mt-1 mb-2 max-w-xs">
              {description}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {actions}
          {controls?.restart && (
            <button
              onClick={() => controls.restart?.()}
              className="p-1.5 hover:bg-white/5 rounded-md text-slate-400 hover:text-[#ffd11a] transition-colors"
              title="Restart"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          <button
            className="p-1.5 hover:bg-white/5 rounded-md text-slate-400 hover:text-[#ffd11a] transition-colors"
            title="View Code"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="bg-[#12121a] rounded-2xl p-8 relative min-h-[200px] flex items-center justify-center overflow-hidden border border-[#2a2a3a]/50 flex-1">
        {children}

        {/* Play Button Overlay */}
        {controls?.play &&
          !isPlaying &&
          (state?.progress === 0 || state?.completed) && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] cursor-pointer z-10 transition-all hover:bg-black/30"
              onClick={() => controls.play?.()}
            >
              <div className="w-14 h-14 bg-[#ffd11a] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,209,26,0.3)] hover:scale-110 transition-transform">
                <div className="translate-x-0.5 border-t-10 border-t-transparent border-b-10 border-b-transparent border-l-16 border-l-[#12121a]" />
              </div>
            </div>
          )}
      </div>

      {/* Progress Footer */}
      {(state?.progress !== undefined || code) && (
        <div className="mt-6 flex flex-col gap-3">
          {state?.progress !== undefined && (
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                <span>Progress</span>
                <span>{Math.round((state.progress || 0) * 100)}%</span>
              </div>
              <div className="h-1 bg-slate-800/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#ffd11a] shadow-[0_0_10px_rgba(255,209,26,0.5)] transition-all duration-100 ease-out"
                  style={{ width: `${(state.progress || 0) * 100}%` }}
                />
              </div>
            </div>
          )}

          {code && (
            <div className="text-[10px] text-slate-400 font-mono bg-black/30 p-2.5 rounded-lg border border-[#2a2a3a] overflow-x-auto whitespace-nowrap">
              <code className="text-[#ffd11a]/80">{code}</code>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
