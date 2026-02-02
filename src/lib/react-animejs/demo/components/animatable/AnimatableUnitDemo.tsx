import React, { useRef } from "react";
import { useAnimatable, useAnimatableEvent } from "../../../index";
import { DemoCard } from "../DemoCard";

function Clock({
  label,
  clockRef,
  color = "#ffd11a",
}: {
  label?: string;
  clockRef: React.RefObject<HTMLDivElement | null>;
  color?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-24 h-24 rounded-full border-2 border-[#2a2a3a] relative flex items-center justify-center bg-[#12121a] shadow-inner">
        <div className="w-1.5 h-1.5 rounded-full bg-[#2a2a3a] z-10" />
        <div
          ref={clockRef}
          className="absolute w-0.5 h-10 origin-bottom bottom-1/2 rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}80` }}
        />
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-1.5 bg-[#2a2a3a]"
            style={{
              transform: `rotate(${i * 30}deg) translateY(-44px)`,
            }}
          />
        ))}
      </div>
      {label && (
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">
          {label}
        </span>
      )}
    </div>
  );
}

export const AnimatableUnitDemo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<HTMLDivElement>(null);

  const { animatable } = useAnimatable(
    {
      rotate: { unit: "rad" },
      duration: 400,
    },
    clockRef,
  );

  const meta = useRef({ lastAngle: 0, angle: 0 });

  useAnimatableEvent(containerRef, "mousemove", (e: MouseEvent) => {
    if (!animatable) return;

    const bounds = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - bounds.left - bounds.width / 2;
    const y = e.clientY - bounds.top - bounds.height / 2;

    const { PI } = Math;
    const currentAngle = Math.atan2(y, x) + PI / 2;
    const { lastAngle, angle } = meta.current;

    const diff = currentAngle - lastAngle;
    const newAngle =
      angle +
      (diff > PI ? diff - 1.2 * PI : diff < -PI ? diff + 1.2 * PI : diff);

    meta.current.lastAngle = currentAngle;
    meta.current.angle = newAngle;

    (animatable as any).rotate?.(newAngle);
  });

  return (
    <DemoCard
      title="unit & speed"
      description="Using radians for smooth rotation and custom duration for responsiveness."
      code="rotate: { unit: 'rad' }, duration: 400"
    >
      <div
        ref={containerRef}
        className="w-full h-full flex flex-col items-center justify-center cursor-crosshair pb-4"
      >
        <Clock clockRef={clockRef} />
        <div className="mt-4 text-[10px] text-slate-500 font-mono uppercase tracking-widest opacity-50">
          Move cursor to rotate
        </div>
      </div>
    </DemoCard>
  );
};
