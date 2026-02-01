import { useRef, useState } from "react";
import {
  useAnimatable,
  useAnimatableEvent,
  utils,
  stagger,
} from "../../../index";
import { DemoSection } from "../DemoSection";

// =============================================================================
// Helper Components
// =============================================================================

function DemoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-900/40 rounded-xl border border-slate-800/50 p-6 flex flex-col gap-4 relative overflow-hidden group">
      <div className="flex justify-between items-center z-10">
        <h3 className="text-sm font-semibold text-slate-300">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// =============================================================================
// Getters Example
// =============================================================================

function GettersDemo() {
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

  useAnimatableEvent(containerRef, "mousemove", (e) => {
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
    <DemoCard title="Getters">
      <div className="flex justify-between font-mono text-xs text-yellow-400 mb-2 px-2">
        <div className="flex flex-col">
          <span className="text-slate-500 mb-1">x</span>
          <span ref={xRef} className="bg-slate-800/80 px-2 py-1 rounded">
            0.00
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-slate-500 mb-1">y</span>
          <span ref={yRef} className="bg-slate-800/80 px-2 py-1 rounded">
            0.00
          </span>
        </div>
      </div>

      <div
        ref={containerRef}
        className="h-48 bg-yellow-900/10 rounded-lg border-2 border-dashed border-yellow-500/20 relative flex items-center justify-center cursor-crosshair"
      >
        <div
          ref={circleRef}
          className="w-12 h-12 rounded-full bg-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.3)] z-10"
        />
        <div className="absolute text-[10px] font-mono text-yellow-600/50 pointer-events-none uppercase tracking-widest">
          Move cursor around
        </div>
      </div>
    </DemoCard>
  );
}

// =============================================================================
// Setters Example
// =============================================================================

function SettersDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);

  const { animatable } = useAnimatable(
    {
      x: 0,
      y: 0,
      backgroundColor: 0, // Initial dummy value
      ease: "outExpo",
    },
    circleRef,
  );

  // Initial setup equivalent to: circle.x(0, 500, 'out(2)')
  // We use a ref to track initialization to run it strictly once when ready
  const initialized = useRef(false);
  if (animatable && !initialized.current) {
    (animatable as any).x(0, 500, "out(2)");
    (animatable as any).y(0, 500, "out(3)");
    (animatable as any).backgroundColor([164, 255, 79], 250);
    initialized.current = true;
  }

  useAnimatableEvent(containerRef, "mousemove", (e) => {
    if (!animatable) return;

    const bounds = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const hw = bounds.width / 2;
    const hh = bounds.height / 2;
    const x = utils.clamp(e.clientX - bounds.left - hw, -hw + 30, hw - 30);
    const y = utils.clamp(e.clientY - bounds.top - hh, -hh + 30, hh - 30);

    // Map position to color
    const r = utils.mapRange(x, -hw, hw, 0, 164);
    const b = utils.mapRange(x, -hw, hw, 79, 255);
    const rgb = [r, 255, b];

    // Setters
    (animatable as any).x?.(x);
    (animatable as any).y?.(y);
    (animatable as any).backgroundColor?.(rgb);
  });

  return (
    <DemoCard title="Setters">
      <div className="text-xs text-slate-500 mb-2 px-1">
        Dynamically update duration, ease, & color based on position.
      </div>
      <div
        ref={containerRef}
        className="h-48 bg-slate-900/30 rounded-lg border border-slate-700/50 relative flex items-center justify-center cursor-crosshair overflow-hidden"
      >
        {/* Grid Background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(#94a3b8 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />

        <div
          ref={circleRef}
          className="w-16 h-16 rounded-xl shadow-lg border-2 border-white/20 z-10 backdrop-blur-sm"
          style={{ backgroundColor: "rgb(164, 255, 79)" }}
        />
      </div>
    </DemoCard>
  );
}

// =============================================================================
// Revert Example
// =============================================================================

function RevertDemo() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { animatable, revert } = useAnimatable(
    {
      x: stagger(50, { from: "center", start: 100 }),
      y: stagger(200, { from: "center", start: 200 }),
      ease: "out(4)",
    },
    ".circle-revert",
  );

  // Track if we are currently "active" (listening to mouse)
  const [isActive, setIsActive] = useState(true);

  useAnimatableEvent(
    containerRef,
    "mousemove",
    (e) => {
      if (!animatable || !isActive) return;

      const bounds = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const hw = bounds.width / 2;
      const hh = bounds.height / 2;
      const x = utils.clamp(e.clientX - bounds.left - hw, -hw + 20, hw - 20);
      const y = utils.clamp(e.clientY - bounds.top - hh, -hh + 20, hh - 20);

      (animatable as any).x?.(x);
      (animatable as any).y?.(y);
    },
    isActive,
  ); // Important: Pass isActive to toggle listener

  const handleRevert = () => {
    setIsActive(false);
    revert();

    // Auto-enable after 1s for better UX in demo
    setTimeout(() => setIsActive(true), 1500);
  };

  return (
    <DemoCard title="revert()">
      <div
        ref={containerRef}
        className="h-48 bg-yellow-950/20 rounded-lg border border-yellow-500/10 relative flex items-center justify-center flex-col gap-8 group"
      >
        {/* Circles Container */}
        <div className="flex gap-1 relative z-10 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="circle-revert w-8 h-8 rounded-full bg-yellow-400 opacity-90 shadow-lg shadow-yellow-500/20"
            />
          ))}
        </div>

        {/* Revert Button */}
        <button
          onClick={handleRevert}
          disabled={!isActive}
          className={`
            relative z-20 px-6 py-2 rounded font-mono text-xs font-bold tracking-wider transition-all
            ${
              isActive
                ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/50 hover:bg-yellow-500 hover:text-slate-900 cursor-pointer"
                : "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
            }
          `}
        >
          {isActive ? "REVERT" : "REVERTED"}
        </button>
      </div>
    </DemoCard>
  );
}

// =============================================================================
// Main Demo Component
// =============================================================================

export function AnimatableMethodsDemo() {
  return (
    <DemoSection title="Animatable Methods">
      <div className="space-y-6 w-full">
        <p className="text-sm text-slate-400">
          Advanced control with <code>Getters</code>, <code>Setters</code>, and{" "}
          <code>Revert</code>.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GettersDemo />
          <div className="space-y-6">
            <SettersDemo />
            <RevertDemo />
          </div>
        </div>

        {/* Code Snippets */}
        <div className="text-xs text-slate-400 font-mono bg-slate-900/50 p-4 rounded-lg border border-slate-800 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-indigo-400 border-b border-indigo-500/20 pb-1 mb-2">
                Getters
              </div>
              <div className="text-slate-300">
                <span className="text-slate-500">// Get current value</span>
                <br />
                const x = animatable.x();
                <br />
                <span className="text-slate-500">// Render loop hook</span>
                <br />
                animatable.animations.x.onRender = () =&gt; &#123;
                <br />
                &nbsp;&nbsp;el.innerText = animatable.x();
                <br />
                &#125;
              </div>
            </div>
            <div>
              <div className="text-emerald-400 border-b border-emerald-500/20 pb-1 mb-2">
                Setters
              </div>
              <div className="text-slate-300">
                <span className="text-slate-500">
                  // Set val, duration, ease
                </span>
                <br />
                animatable.x(100, 500, 'out(2)');
                <br />
                <span className="text-slate-500">// Dynamic colors</span>
                <br />
                animatable.color([255, 0, 0]);
              </div>
            </div>
            <div>
              <div className="text-yellow-400 border-b border-yellow-500/20 pb-1 mb-2">
                Revert
              </div>
              <div className="text-slate-300">
                <span className="text-slate-500">// Remove all styles</span>
                <br />
                const &#123; revert &#125; = useAnimatable(...);
                <br />
                <br />
                revert();
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoSection>
  );
}
