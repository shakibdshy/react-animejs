import React, { useMemo, useRef } from "react";
import { useAnimatable, useAnimatableEvent, utils } from "@/lib/react-animejs";
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

export const AnimatableModifierDemo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const snapClockRef = useRef<HTMLDivElement>(null);
  const reverseClockRef = useRef<HTMLDivElement>(null);

  const { PI } = Math;

  const snapConfig = useMemo(
    () => ({
      rotate: { unit: "rad" },
      modifier: utils.snap(PI / 6),
      duration: 100,
    }),
    [PI],
  );

  const { animatable: snap } = useAnimatable(snapConfig, snapClockRef);

  const reverseConfig = useMemo(
    () => ({
      rotate: { unit: "rad" },
      modifier: (v: number) => -v,
      duration: 400,
    }),
    [],
  );

  const { animatable: reverse } = useAnimatable(reverseConfig, reverseClockRef);

  useAnimatableEvent(containerRef, "mousemove", (e: MouseEvent) => {
    if (!snap || !reverse) return;

    const bounds = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - bounds.left - bounds.width / 2;
    const y = e.clientY - bounds.top - bounds.height / 2;

    const angle = Math.atan2(y, x) + PI / 2;

    (snap as any).rotate?.(angle);
    (reverse as any).rotate?.(angle);
  });

  return (
    <DemoCard
      title="value modifiers"
      description="Snapping to specific intervals vs inverting the input value."
      code="modifier: utils.snap(PI / 6)"
    >
      <div
        ref={containerRef}
        className="w-full h-full flex justify-around items-center cursor-crosshair px-4"
      >
        <Clock label="modifier: snap" clockRef={snapClockRef} color="#ffd11a" />
        <Clock
          label="modifier: reverse"
          clockRef={reverseClockRef}
          color="#64748b"
        />
      </div>
    </DemoCard>
  );
};
