import React, { useRef } from "react";
import { useAnimatable, useAnimatableEvent, utils } from "../../../index";
import { DemoCard } from "../DemoCard";

export const AnimatableSettersDemo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);

  const { animatable } = useAnimatable(
    {
      x: 0,
      y: 0,
      rotate: 0,
      backgroundColor: 0,
      ease: "outExpo",
    },
    cubeRef,
  );

  const initialized = useRef(false);
  if (animatable && !initialized.current) {
    (animatable as any).x(0, 500, "out(2)");
    (animatable as any).y(0, 500, "out(3)");
    (animatable as any).rotate(0, 1000, "outElastic(1, .5)");
    (animatable as any).backgroundColor([255, 209, 26], 250);
    initialized.current = true;
  }

  useAnimatableEvent(containerRef, "mousemove", (e: MouseEvent) => {
    if (!animatable) return;

    const bounds = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const hw = bounds.width / 2;
    const hh = bounds.height / 2;
    const x = utils.clamp(e.clientX - bounds.left - hw, -hw + 40, hw - 40);
    const y = utils.clamp(e.clientY - bounds.top - hh, -hh + 40, hh - 40);

    const r = utils.mapRange(x, -hw, hw, 200, 255);
    const g = utils.mapRange(y, -hh, hh, 150, 209);
    const b = utils.mapRange(x + y, -hw - hh, hw + hh, 0, 100);
    const rgb = [r, g, b];

    (animatable as any).x?.(x);
    (animatable as any).y?.(y);
    (animatable as any).rotate?.(x / 2);
    (animatable as any).backgroundColor?.(rgb);
  });

  return (
    <DemoCard
      title="setters"
      description="Update value, duration, and easing independently on each individual property call."
      code="animatable.x(100, 500, 'out(2)')"
    >
      <div
        ref={containerRef}
        className="w-full h-full min-h-[160px] bg-[#1a1a24]/50 rounded-2xl border border-white/5 relative flex items-center justify-center cursor-crosshair overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#ffd11a 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        <div
          ref={cubeRef}
          className="w-16 h-16 rounded-xl shadow-lg border-2 border-white/10 z-10 backdrop-blur-sm"
          style={{ backgroundColor: "#ffd11a" }}
        />
      </div>
    </DemoCard>
  );
};
