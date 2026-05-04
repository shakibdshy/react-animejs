import React, { useRef } from "react";
import { useAnimatable, useAnimatableEvent, utils } from "@/lib/react-animejs";
import { DemoCard } from "../DemoCard";

export const AnimatableGettersDemo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const xRef = useRef<HTMLSpanElement>(null);
  const yRef = useRef<HTMLSpanElement>(null);

  const { animatable } = useAnimatable(
    {
      x: 500,
      y: 500,
      ease: "out(2)",
    },
    circleRef,
  );

  // Attach render loop to update DOM directly (super fast)
  if (animatable && animatable.animations.x) {
    (animatable.animations.x as any).onRender = () => {
      if (xRef.current)
        xRef.current.innerText = utils.roundPad((animatable as any).x(), 2);
      if (yRef.current)
        yRef.current.innerText = utils.roundPad((animatable as any).y(), 2);
    };
  }

  useAnimatableEvent(containerRef, "mousemove", (e: MouseEvent) => {
    if (!animatable) return;

    const bounds = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const hw = bounds.width / 2;
    const hh = bounds.height / 2;
    const x = utils.clamp(e.clientX - bounds.left - hw, -hw + 30, hw - 30);
    const y = utils.clamp(e.clientY - bounds.top - hh, -hh + 30, hh - 30);

    (animatable as any).x?.(x);
    (animatable as any).y?.(y);
  });

  return (
    <DemoCard
      title="getters"
      description="Access live interpolated values from the animatable instance on every frame."
      code="const x = animatable.x()"
    >
      <div className="flex flex-col gap-6 w-full h-full">
        <div className="flex justify-between font-mono text-[10px] text-demo-accent px-2">
          <div className="flex flex-col">
            <span className="text-demo-text-muted uppercase tracking-widest mb-1.5">
              Position X
            </span>
            <span
              ref={xRef}
              className="bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 font-bold tabular-nums"
            >
              0.00
            </span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-demo-text-muted uppercase tracking-widest mb-1.5">
              Position Y
            </span>
            <span
              ref={yRef}
              className="bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 font-bold tabular-nums"
            >
              0.00
            </span>
          </div>
        </div>

        <div
          ref={containerRef}
          className="flex-1 min-h-[160px] bg-demo-card/50 rounded-2xl border border-white/5 relative flex items-center justify-center cursor-crosshair overflow-hidden"
        >
          <div
            ref={circleRef}
            className="w-12 h-12 rounded-full bg-demo-accent shadow-[0_0_30px_var(--demo-accent)/0.3] z-10"
          />
          <div className="absolute text-[10px] font-mono text-demo-text-muted pointer-events-none uppercase tracking-[0.2em] opacity-30">
            Move mouse
          </div>
        </div>
      </div>
    </DemoCard>
  );
};
