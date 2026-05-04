import React, { useRef, useState } from "react";
import {
  stagger,
  useAnimatable,
  useAnimatableEvent,
  utils,
} from "@/lib/react-animejs";
import { DemoCard } from "../DemoCard";

export const AnimatableRevertDemo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(true);

  const { animatable, revert } = useAnimatable(
    {
      x: stagger(50, { from: "center", start: 100 }),
      y: stagger(200, { from: "center", start: 200 }),
      ease: "out(4)",
    },
    ".circle-revert",
  );

  useAnimatableEvent(
    containerRef,
    "mousemove",
    (e: MouseEvent) => {
      if (!animatable || !isActive) return;

      const bounds = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const hw = bounds.width / 2;
      const hh = bounds.height / 2;
      const x = utils.clamp(e.clientX - bounds.left - hw, -hw + 40, hw - 40);
      const y = utils.clamp(e.clientY - bounds.top - hh, -hh + 40, hh - 40);

      (animatable as any).x?.(x);
      (animatable as any).y?.(y);
    },
    { capture: false }, // Options should be a boolean or AddEventListenerOptions
  );

  const handleRevert = () => {
    setIsActive(false);
    revert();
    setTimeout(() => setIsActive(true), 1500);
  };

  return (
    <DemoCard
      title="revert()"
      description="Cleanly remove all generated styles and revert elements to their original state."
      code="const { revert } = useAnimatable(...)"
    >
      <div
        ref={containerRef}
        className="w-full h-full min-h-[160px] bg-[#1a1a24]/50 rounded-2xl border border-white/5 relative flex items-center justify-center flex-col gap-8 group overflow-hidden"
      >
        <div className="flex gap-2 relative z-10 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="circle-revert w-6 h-6 rounded-full bg-[#ffd11a] opacity-90 shadow-lg shadow-[#ffd11a]/20"
            />
          ))}
        </div>

        <button
          onClick={handleRevert}
          disabled={!isActive}
          className={`
            relative z-20 px-6 py-2 rounded-xl font-bold text-[10px] tracking-widest uppercase transition-all
            ${
              isActive
                ? "bg-[#ffd11a] text-[#12121a] hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(255,209,26,0.2)]"
                : "bg-slate-800 text-slate-500 cursor-not-allowed opacity-50"
            }
          `}
        >
          {isActive ? "REVERT STYLES" : "REVERTED"}
        </button>
      </div>
    </DemoCard>
  );
};
