import React, { useRef } from "react";
import {
  stagger,
  useAnimatable,
  useAnimatableEvent,
  utils,
} from "../../../index";
import { DemoCard } from "../DemoCard";

export const AnimatableDurationDemo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { animatable } = useAnimatable(
    {
      x: 0,
      y: stagger(200, { from: "center", start: 200 }),
      ease: "out(4)",
    },
    ".circle-duration",
  );

  useAnimatableEvent(containerRef, "mousemove", (e: MouseEvent) => {
    if (!animatable) return;

    const bounds = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const hw = bounds.width / 2;
    const hh = bounds.height / 2;

    const x = utils.clamp(e.clientX - bounds.left - hw, -hw + 40, hw - 40);
    const y = utils.clamp(e.clientY - bounds.top - hh, -hh + 40, hh - 40);

    (animatable as any).x?.(x);
    (animatable as any).y?.(y);
  });

  return (
    <DemoCard
      title="staggered lag"
      description="Using stagger() to create a following tail effect with different durations per element."
      code="y: stagger(200, { from: 'center' })"
    >
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center cursor-crosshair relative overflow-hidden"
      >
        <div className="flex gap-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="circle-duration w-4 h-4 rounded-full bg-[#ffd11a] shadow-[0_0_15px_rgba(255,209,26,0.3)]"
              style={{ opacity: 1 - i * 0.15 }}
            />
          ))}
        </div>
        <div className="absolute bottom-4 text-[10px] text-slate-500 font-mono uppercase tracking-widest opacity-50">
          Tail follows mouse
        </div>
      </div>
    </DemoCard>
  );
};
