import React, { useRef } from "react";
import { useAnimatable, useAnimatableEvent } from "@/lib/react-animejs";
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
      <div className="w-20 h-20 rounded-full border-2 border-[#2a2a3a] relative flex items-center justify-center bg-[#12121a] shadow-inner">
        <div className="w-1.5 h-1.5 rounded-full bg-[#2a2a3a] z-10" />
        <div
          ref={clockRef}
          className="absolute w-0.5 h-8 origin-bottom bottom-1/2 rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}80` }}
        />
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-1 bg-[#2a2a3a]"
            style={{
              transform: `rotate(${i * 30}deg) translateY(-36px)`,
            }}
          />
        ))}
      </div>
      {label && (
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1 text-center max-w-[80px]">
          {label}
        </span>
      )}
    </div>
  );
}

export const AnimatableEaseDemo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const linearClockRef = useRef<HTMLDivElement>(null);
  const elasticClockRef = useRef<HTMLDivElement>(null);
  const meta = useRef({ lastAngle: 0, angle: 0 });

  const { animatable: linear } = useAnimatable(
    {
      rotate: { unit: "rad" },
      ease: "linear",
    },
    linearClockRef,
  );

  const { animatable: elastic } = useAnimatable(
    {
      rotate: { unit: "rad" },
      ease: "outElastic(1, .5)",
      duration: 800,
    },
    elasticClockRef,
  );

  useAnimatableEvent(containerRef, "mousemove", (e: MouseEvent) => {
    if (!linear || !elastic) return;

    const bounds = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - bounds.left - bounds.width / 2;
    const y = e.clientY - bounds.top - bounds.height / 2;

    const { PI } = Math;
    const currentAngle = Math.atan2(y, x) + PI / 2;

    const { lastAngle, angle } = meta.current;
    const diff = currentAngle - lastAngle;
    const newAngle =
      angle + (diff > PI ? diff - 2 * PI : diff < -PI ? diff + 2 * PI : diff);

    meta.current.lastAngle = currentAngle;
    meta.current.angle = newAngle;

    (linear as any).rotate?.(newAngle);
    (elastic as any).rotate?.(newAngle);
  });

  return (
    <DemoCard
      title="easing comparison"
      description="Comparing rigid linear movement with organic elastic easing."
      code="ease: 'outElastic(1, .5)'"
    >
      <div
        ref={containerRef}
        className="w-full h-full flex justify-around items-center cursor-crosshair px-4"
      >
        <Clock label="linear" clockRef={linearClockRef} color="#64748b" />
        <Clock label="outElastic" clockRef={elasticClockRef} color="#ffd11a" />
      </div>
    </DemoCard>
  );
};
