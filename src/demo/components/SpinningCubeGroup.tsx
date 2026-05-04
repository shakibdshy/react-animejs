import React, { useState } from "react";
import { DemoSection } from "./DemoSection";
import { DemoCard } from "./DemoCard";
import { SpinningCube } from "@/demo/components/common/SpinningCube";

function BasicCubeDemo() {
  return (
    <DemoCard
      title="Basic Spin"
      description="Smooth dual-axis rotation with linear easing"
      state={{ progress: 0 }}
      code={`<SpinningCube size={120} duration={3000} axis="both" />`}
    >
      <SpinningCube size={120} duration={3000} axis="both" />
    </DemoCard>
  );
}

function YAxisCubeDemo() {
  return (
    <DemoCard
      title="Y-Axis Only"
      description="Spins around the vertical axis only"
      state={{ progress: 0 }}
      code={`<SpinningCube axis="y" duration={2000} />`}
    >
      <SpinningCube size={120} duration={2000} axis="y" />
    </DemoCard>
  );
}

function XAxisCubeDemo() {
  return (
    <DemoCard
      title="X-Axis Only"
      description="Spins around the horizontal axis only"
      state={{ progress: 0 }}
      code={`<SpinningCube axis="x" duration={2000} />`}
    >
      <SpinningCube size={120} duration={2000} axis="x" />
    </DemoCard>
  );
}

function SpeedVariantsDemo() {
  return (
    <DemoCard
      title="Speed Variants"
      description="Slow, medium, and fast spin speeds side by side"
      state={{ progress: 0 }}
      code={`<SpinningCube duration={6000} />
<SpinningCube duration={3000} />
<SpinningCube duration={1200} />`}
    >
      <div className="flex items-start justify-around w-full gap-6">
        {/* <div className="flex flex-col items-center gap-2">
          <SpinningCube size={80} duration={6000} />
          <span className="text-[10px] font-mono text-demo-text-muted uppercase tracking-widest">
            Slow
          </span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <SpinningCube size={80} duration={3000} />
          <span className="text-[10px] font-mono text-demo-text-muted uppercase tracking-widest">
            Medium
          </span>
        </div> */}
        <div className="flex flex-col items-center gap-2">
          <SpinningCube size={80} duration={1200} />
          <span className="text-[10px] font-mono text-demo-text-muted uppercase tracking-widest">
            Fast
          </span>
        </div>
      </div>
    </DemoCard>
  );
}

function SizeVariantsDemo() {
  return (
    <DemoCard
      title="Size Variants"
      description="Small, medium, and large cubes"
      state={{ progress: 0 }}
      code={`<SpinningCube size={80} />
<SpinningCube size={120} />
<SpinningCube size={180} />`}
    >
      <div className="flex items-center justify-around w-full gap-4 py-4">
        {/* <div className="flex flex-col items-center gap-2">
          <SpinningCube size={80} duration={3000} />
          <span className="text-[10px] font-mono text-demo-text-muted uppercase tracking-widest">
            80px
          </span>
        </div> */}
        <div className="flex flex-col items-center gap-2">
          <SpinningCube size={120} duration={3000} />
          <span className="text-[10px] font-mono text-demo-text-muted uppercase tracking-widest">
            120px
          </span>
        </div>
        {/* <div className="flex flex-col items-center gap-2">
          <SpinningCube size={180} duration={3000} />
          <span className="text-[10px] font-mono text-demo-text-muted uppercase tracking-widest">
            180px
          </span>
        </div> */}
      </div>
    </DemoCard>
  );
}

function InteractiveCubeDemo() {
  const [axis, setAxis] = useState<"x" | "y" | "both">("both");
  const [speed, setSpeed] = useState(3000);

  return (
    <DemoCard
      title="Interactive Controls"
      description="Customize axis and speed in real-time"
      state={{ progress: 0 }}
      code={`<SpinningCube axis="${axis}" duration={${speed}} />`}
    >
      <div className="flex flex-col items-center gap-6 w-full">
        <SpinningCube size={140} duration={speed} axis={axis} />

        <div className="flex flex-col gap-4 w-full max-w-xs">
          {/* Axis selector */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono text-demo-text-muted uppercase tracking-widest">
              Rotation Axis
            </span>
            <div className="flex gap-1 bg-demo-bg rounded-xl p-1 border border-demo-border/50">
              {(["x", "y", "both"] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => setAxis(a)}
                  className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all duration-200 ${
                    axis === a
                      ? "bg-demo-accent text-black shadow-[0_0_12px_var(--demo-accent)/0.3]"
                      : "text-demo-text-muted hover:text-slate-300 hover:bg-white/5"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Speed slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-[10px] font-mono text-demo-text-muted uppercase tracking-widest">
                Speed
              </span>
              <span className="text-[10px] font-mono text-demo-accent">
                {speed}ms
              </span>
            </div>
            <input
              type="range"
              min={800}
              max={8000}
              step={200}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full accent-demo-accent"
            />
          </div>
        </div>
      </div>
    </DemoCard>
  );
}

export const SpinningCubeGroup: React.FC = () => {
  return (
    <DemoSection title="Spinning 3D Cube">
      <BasicCubeDemo />
      <YAxisCubeDemo />
      <XAxisCubeDemo />
      <SpeedVariantsDemo />
      <SizeVariantsDemo />
      <InteractiveCubeDemo />
    </DemoSection>
  );
};
