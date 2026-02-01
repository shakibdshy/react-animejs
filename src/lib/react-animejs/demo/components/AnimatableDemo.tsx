import { useRef, useMemo } from "react";
import { useAnimatable, useAnimatableEvent, utils, stagger } from "../../index";
import { DemoSection } from "./DemoSection";

// =============================================================================
// Helper Components
// =============================================================================

function Clock({
  label,
  clockRef,
  color = "#4f46e5",
}: {
  label?: string;
  clockRef: React.RefObject<HTMLDivElement | null>;
  color?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-24 h-24 rounded-full border-2 border-slate-700 relative flex items-center justify-center bg-slate-900/50 shadow-inner">
        <div className="w-1.5 h-1.5 rounded-full bg-slate-600 z-10" />
        <div
          ref={clockRef}
          className="absolute w-0.5 h-10 origin-bottom bottom-1/2 rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}80` }}
        />
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-1.5 bg-slate-700"
            style={{
              transform: `rotate(${i * 30}deg) translateY(-44px)`,
            }}
          />
        ))}
      </div>
      {label && (
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">
          {label}
        </span>
      )}
    </div>
  );
}

// =============================================================================
// Unit Example
// =============================================================================

function AnimatableUnitDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<HTMLDivElement>(null);

  const { animatable } = useAnimatable(
    {
      rotate: { unit: "rad" },
      duration: 400,
    },
    clockRef,
  );

  // Logic state (outside React state to be fast)
  const meta = useRef({ lastAngle: 0, angle: 0 });

  useAnimatableEvent(containerRef, "mousemove", (e) => {
    if (!animatable) return;

    // Bounds calculation
    const bounds = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - bounds.left - bounds.width / 2;
    const y = e.clientY - bounds.top - bounds.height / 2;

    // Math
    const { PI } = Math;
    const currentAngle = Math.atan2(y, x) + PI / 2;
    const { lastAngle, angle } = meta.current;

    const diff = currentAngle - lastAngle;
    const newAngle =
      angle +
      (diff > PI ? diff - 1.2 * PI : diff < -PI ? diff + 1.2 * PI : diff);

    // Update state & animate
    meta.current.lastAngle = currentAngle;
    meta.current.angle = newAngle;

    (animatable as any).rotate?.(newAngle);
  });

  return (
    <div
      ref={containerRef}
      className="flex-1 min-h-[160px] bg-slate-900/30 rounded-xl border border-slate-800/50 p-4 flex flex-col items-center justify-center group cursor-crosshair"
    >
      <Clock label="unit: 'rad'" clockRef={clockRef} color="#0ea5e9" />
      <div className="mt-4 text-[10px] text-slate-600 font-mono">
        Move cursor to rotate
      </div>
    </div>
  );
}

// =============================================================================
// Duration Example
// =============================================================================

function AnimatableDurationDemo() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { animatable } = useAnimatable(
    {
      x: 0,
      y: stagger(200, { from: "center", start: 200 }),
      ease: "out(4)",
    },
    ".circle-duration",
  );

  useAnimatableEvent(containerRef, "mousemove", (e) => {
    if (!animatable) return;

    const bounds = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const hw = bounds.width / 2;
    const hh = bounds.height / 2;

    const x = utils.clamp(e.clientX - bounds.left - hw, -hw + 20, hw - 20);
    const y = utils.clamp(e.clientY - bounds.top - hh, -hh + 20, hh - 20);

    (animatable as any).x?.(x);
    (animatable as any).y?.(y);
  });

  return (
    <div
      ref={containerRef}
      className="flex-1 min-h-[160px] bg-slate-900/30 rounded-xl border border-slate-800/50 p-4 flex items-center justify-center relative overflow-hidden group cursor-crosshair"
    >
      <div className="flex gap-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="circle-duration w-4 h-4 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20"
          />
        ))}
      </div>
      <div className="absolute bottom-2 left-4 text-[10px] text-slate-600 font-mono">
        stagger(200) y-duration
      </div>
    </div>
  );
}

// =============================================================================
// Ease Example
// =============================================================================

function AnimatableEaseDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const linearClockRef = useRef<HTMLDivElement>(null);
  const elasticClockRef = useRef<HTMLDivElement>(null);
  const meta = useRef({ lastAngle: 0, angle: 0 }); // Shared logic state

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

  useAnimatableEvent(containerRef, "mousemove", (e) => {
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
    <div
      ref={containerRef}
      className="flex-1 min-h-[160px] bg-slate-900/30 rounded-xl border border-slate-800/50 p-4 flex justify-around items-center group cursor-crosshair"
    >
      <Clock label="ease: 'linear'" clockRef={linearClockRef} color="#f59e0b" />
      <Clock
        label="ease: 'outElastic'"
        clockRef={elasticClockRef}
        color="#ec4899"
      />
    </div>
  );
}

// =============================================================================
// Modifier Example
// =============================================================================

function AnimatableModifierDemo() {
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

  useAnimatableEvent(containerRef, "mousemove", (e) => {
    if (!snap || !reverse) return;

    const bounds = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - bounds.left - bounds.width / 2;
    const y = e.clientY - bounds.top - bounds.height / 2;

    const angle = Math.atan2(y, x) + PI / 2;

    (snap as any).rotate?.(angle);
    (reverse as any).rotate?.(angle);
  });

  return (
    <div
      ref={containerRef}
      className="flex-1 min-h-[160px] bg-slate-900/30 rounded-xl border border-slate-800/50 p-4 flex justify-around items-center group cursor-crosshair"
    >
      <Clock label="modifier: snap" clockRef={snapClockRef} color="#10b981" />
      <Clock
        label="modifier: reverse"
        clockRef={reverseClockRef}
        color="#8b5cf6"
      />
    </div>
  );
}

// =============================================================================
// Main Demo Component
// =============================================================================

export function AnimatableDemo() {
  return (
    <DemoSection title="createAnimatable()">
      <div className="space-y-8 w-full">
        <div className="space-y-3">
          <p className="text-sm text-slate-400">
            <code>createAnimatable</code> creates objects with property methods
            that animate on call. Combined with <code>useAnimatableEvent</code>,
            it provides a high-performance way to handle cursor interactions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest pl-1">
                1. Unit & Duration
              </h4>
              <div className="flex flex-col gap-4">
                <AnimatableUnitDemo />
                <AnimatableDurationDemo />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest pl-1">
                2. Ease & Modifier
              </h4>
              <div className="flex flex-col gap-4">
                <AnimatableEaseDemo />
                <AnimatableModifierDemo />
              </div>
            </div>
          </div>
        </div>

        {/* Unified Code Example */}
        <div className="text-xs text-slate-400 font-mono bg-slate-900/50 p-4 rounded-lg border border-slate-800 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <span className="text-indigo-400">
              // useAnimatable + useAnimatableEvent
            </span>
            <span className="text-[10px] text-slate-600">
              High Performance Pattern
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-2">
              <div className="text-slate-300">
                <span className="text-slate-500">// 1. Create Animatable</span>
                <br />
                const &#123; animatable &#125; = useAnimatable(&#123;
                <br />
                &nbsp;&nbsp;x: 500, ease: 'out(3)'
                <br />
                &#125;, targetRef);
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-slate-300">
                <span className="text-slate-500">// 2. Bind Efficiency</span>
                <br />
                useAnimatableEvent(containerRef, 'mousemove', (e) =&gt; &#123;
                <br />
                &nbsp;&nbsp;
                <span className="text-emerald-500">
                  // Runs outside React render cycle
                </span>
                <br />
                &nbsp;&nbsp;animatable?.x(e.clientX);
                <br />
                &#125;);
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoSection>
  );
}
