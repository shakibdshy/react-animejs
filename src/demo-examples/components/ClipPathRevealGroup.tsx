import React, { useState } from "react";
import { DemoSection } from "./DemoSection";
import { DemoCard } from "./DemoCard";
import { ClipPathReveal } from "@/demo-examples/components/common/ClipPathReveal";

// =============================================================================
// Shared content block used inside reveals
// =============================================================================

function RevealContent({
  gradient = "from-indigo-500 to-purple-600",
  title = "Revealed",
  subtitle = "ClipPath animation",
}: {
  gradient?: string;
  title?: string;
  subtitle?: string;
}) {
  return (
    <div
      className={`w-full h-48 rounded-2xl bg-linear-to-br ${gradient} flex flex-col items-center justify-center gap-2 p-6`}
    >
      <span className="text-2xl font-black text-white">{title}</span>
      <span className="text-xs text-white/60 uppercase tracking-widest">
        {subtitle}
      </span>
    </div>
  );
}

// =============================================================================
// Demos
// =============================================================================

function CircleRevealDemo() {
  return (
    <DemoCard
      title="Circle Reveal"
      description="Expands from center with circle() clip-path"
      state={{ progress: 0 }}
      code={`<ClipPathReveal shape="circle" duration={1200}>
  <RevealContent />
</ClipPathReveal>`}
    >
      <ClipPathReveal shape="circle" duration={1200}>
        <RevealContent
          gradient="from-amber-400 to-orange-600"
          title="Circle"
          subtitle="circle() at 50% 50%"
        />
      </ClipPathReveal>
    </DemoCard>
  );
}

function DiamondRevealDemo() {
  return (
    <DemoCard
      title="Diamond Reveal"
      description="Expands from center with polygon diamond shape"
      state={{ progress: 0 }}
      code={`<ClipPathReveal shape="diamond" duration={1000} />`}
    >
      <ClipPathReveal shape="diamond" duration={1000}>
        <RevealContent
          gradient="from-emerald-400 to-teal-600"
          title="Diamond"
          subtitle="polygon() 4-point"
        />
      </ClipPathReveal>
    </DemoCard>
  );
}

function HorizontalRevealDemo() {
  return (
    <DemoCard
      title="Horizontal Wipe"
      description="Reveals from center outward horizontally using inset()"
      state={{ progress: 0 }}
      code={`<ClipPathReveal shape="horizontal" duration={800} />`}
    >
      <ClipPathReveal shape="horizontal" duration={800}>
        <RevealContent
          gradient="from-blue-400 to-indigo-600"
          title="Horizontal"
          subtitle="inset() left+right"
        />
      </ClipPathReveal>
    </DemoCard>
  );
}

function VerticalRevealDemo() {
  return (
    <DemoCard
      title="Vertical Wipe"
      description="Reveals from center outward vertically using inset()"
      state={{ progress: 0 }}
      code={`<ClipPathReveal shape="vertical" duration={800} />`}
    >
      <ClipPathReveal shape="vertical" duration={800}>
        <RevealContent
          gradient="from-rose-400 to-pink-600"
          title="Vertical"
          subtitle="inset() top+bottom"
        />
      </ClipPathReveal>
    </DemoCard>
  );
}

function StarRevealDemo() {
  return (
    <DemoCard
      title="Star Reveal"
      description="Morphs into a 10-point star polygon"
      state={{ progress: 0 }}
      code={`<ClipPathReveal shape="star" duration={1400} />`}
    >
      <ClipPathReveal shape="star" duration={1400}>
        <RevealContent
          gradient="from-violet-400 to-purple-600"
          title="Star"
          subtitle="polygon() 10-point"
        />
      </ClipPathReveal>
    </DemoCard>
  );
}

function LoopingRevealDemo() {
  return (
    <DemoCard
      title="Looping Alternate"
      description="Continuously reveals and hides with alternate direction"
      state={{ progress: 0 }}
      code={`<ClipPathReveal shape="circle" loop alternate duration={2000} />`}
    >
      <ClipPathReveal
        shape="circle"
        duration={2000}
        loop
        alternate
        autoplay
      >
        <RevealContent
          gradient="from-cyan-400 to-blue-600"
          title="Looping"
          subtitle="loop + alternate"
        />
      </ClipPathReveal>
    </DemoCard>
  );
}

function ShapeComparisonDemo() {
  const [triggerKey, setTriggerKey] = useState(0);
  const handleReplay = () => setTriggerKey((k) => k + 1);

  return (
    <DemoCard
      title="All Shapes"
      description="Side-by-side comparison of all clip-path shapes"
      state={{ progress: 0 }}
      controls={{ restart: handleReplay }}
      code={`shape="circle|diamond|horizontal|vertical|star"`}
    >
      <div className="flex flex-col gap-4 w-full">
        <button
          onClick={handleReplay}
          className="self-center px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-demo-accent text-demo-bg rounded-lg hover:bg-demo-accent/90 transition-colors"
        >
          Replay All
        </button>
        <div
          key={triggerKey}
          className="grid grid-cols-3 gap-4 w-full"
        >
          {(["circle", "diamond", "horizontal", "vertical", "star"] as const).map(
            (shape) => (
              <div key={shape} className="flex flex-col items-center gap-2">
                <ClipPathReveal
                  shape={shape}
                  duration={1000}
                  autoplay
                  ease="outCubic"
                >
                  <div
                    className="w-full h-28 rounded-xl bg-linear-to-br from-demo-accent/30 to-demo-accent/5 border border-demo-accent/20 flex items-center justify-center"
                  >
                    <span className="text-xs font-bold text-demo-accent uppercase">
                      {shape}
                    </span>
                  </div>
                </ClipPathReveal>
              </div>
            ),
          )}
        </div>
      </div>
    </DemoCard>
  );
}

// =============================================================================
// Export
// =============================================================================

export const ClipPathRevealGroup: React.FC = () => {
  return (
    <DemoSection title="ClipPath Reveal" frameChildren={false} codeId={false}>
      <CircleRevealDemo />
      <DiamondRevealDemo />
      <HorizontalRevealDemo />
      <VerticalRevealDemo />
      <StarRevealDemo />
      <LoopingRevealDemo />
      <ShapeComparisonDemo />
    </DemoSection>
  );
};
