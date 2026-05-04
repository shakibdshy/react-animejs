import React, { useState } from "react";
import { DemoSection } from "./DemoSection";
import { DemoCard } from "./DemoCard";
import {
  AnimatedSlider,
  type SlideTransition,
} from "@/components/AnimatedSlider";


// =============================================================================
// Slide content factory
// =============================================================================

interface SlideData {
  title: string;
  description: string;
  gradient: string;
  icon: string;
}

const SLIDES: SlideData[] = [
  {
    title: "Animate",
    description: "Declarative animation component with full playback controls",
    gradient: "from-amber-400 to-orange-600",
    icon: "A",
  },
  {
    title: "Timeline",
    description: "Sequence multiple animations with labels and sync points",
    gradient: "from-emerald-400 to-teal-600",
    icon: "T",
  },
  {
    title: "Draggable",
    description: "Interactive drag with spring physics and snap points",
    gradient: "from-blue-400 to-indigo-600",
    icon: "D",
  },
  {
    title: "Scope",
    description: "Isolate animations with scoped contexts and media queries",
    gradient: "from-violet-400 to-purple-600",
    icon: "S",
  },
  {
    title: "SplitText",
    description: "Word and character splitting with staggered reveal effects",
    gradient: "from-rose-400 to-pink-600",
    icon: "X",
  },
];

function SlideCard({ slide }: { slide: SlideData }) {
  return (
    <div className="flex items-center gap-6 p-8 w-full">
      <div
        className={`w-16 h-16 rounded-2xl bg-linear-to-br ${slide.gradient} flex items-center justify-center shrink-0 shadow-lg`}
      >
        <span className="text-2xl font-black text-white">{slide.icon}</span>
      </div>
      <div className="flex flex-col gap-1.5 min-w-0">
        <h3 className="text-lg font-bold text-white">{slide.title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          {slide.description}
        </p>
      </div>
    </div>
  );
}

// =============================================================================
// Image-style slides (more visual)
// =============================================================================

const IMAGE_SLIDES = [
  {
    title: "Mountain Peaks",
    subtitle: "Elevation 4,892m",
    gradient: "from-sky-400 via-blue-500 to-indigo-600",
  },
  {
    title: "Ocean Depths",
    subtitle: "Depth 3,800m",
    gradient: "from-cyan-500 via-teal-600 to-emerald-700",
  },
  {
    title: "Desert Dunes",
    subtitle: "Temperature 48C",
    gradient: "from-yellow-400 via-amber-500 to-orange-600",
  },
  {
    title: "Northern Lights",
    subtitle: "Latitude 69N",
    gradient: "from-green-400 via-emerald-500 to-cyan-600",
  },
];

function ImageSlide({ slide }: { slide: (typeof IMAGE_SLIDES)[number] }) {
  return (
    <div
      className={`w-full h-56 rounded-2xl bg-linear-to-br ${slide.gradient} flex flex-col items-center justify-center gap-2 p-8`}
    >
      <span className="text-3xl font-black text-white drop-shadow-lg">
        {slide.title}
      </span>
      <span className="text-sm text-white/60 uppercase tracking-widest">
        {slide.subtitle}
      </span>
    </div>
  );
}

// =============================================================================
// Demos
// =============================================================================

function SlideTransitionDemo() {
  return (
    <DemoCard
      title="Slide Transition"
      description="Default horizontal slide with fade"
      state={{ progress: 0 }}
      code={`<AnimatedSlider items={slides} transition="slide">
  {(item) => <SlideCard slide={item} />}
</AnimatedSlider>`}
    >
      <AnimatedSlider items={SLIDES} transition="slide" duration={500}>
        {(item) => <SlideCard slide={item} />}
      </AnimatedSlider>
    </DemoCard>
  );
}

function FadeTransitionDemo() {
  return (
    <DemoCard
      title="Fade Transition"
      description="Pure opacity crossfade between slides"
      state={{ progress: 0 }}
      code={`<AnimatedSlider transition="fade" />`}
    >
      <AnimatedSlider items={SLIDES} transition="fade" duration={400}>
        {(item) => <SlideCard slide={item} />}
      </AnimatedSlider>
    </DemoCard>
  );
}

function ScaleTransitionDemo() {
  return (
    <DemoCard
      title="Scale Transition"
      description="Scale down outgoing, scale up incoming"
      state={{ progress: 0 }}
      code={`<AnimatedSlider transition="scale" />`}
    >
      <AnimatedSlider items={SLIDES} transition="scale" duration={500}>
        {(item) => <SlideCard slide={item} />}
      </AnimatedSlider>
    </DemoCard>
  );
}

function FadeSlideTransitionDemo() {
  return (
    <DemoCard
      title="Fade-Slide Transition"
      description="Vertical fade with upward slide motion"
      state={{ progress: 0 }}
      code={`<AnimatedSlider transition="fade-slide" />`}
    >
      <AnimatedSlider items={SLIDES} transition="fade-slide" duration={450}>
        {(item) => <SlideCard slide={item} />}
      </AnimatedSlider>
    </DemoCard>
  );
}

function FlipTransitionDemo() {
  return (
    <DemoCard
      title="Flip Transition"
      description="3D rotate-Y flip between slides"
      state={{ progress: 0 }}
      code={`<AnimatedSlider transition="flip" />`}
    >
      <AnimatedSlider items={SLIDES} transition="flip" duration={600}>
        {(item) => <SlideCard slide={item} />}
      </AnimatedSlider>
    </DemoCard>
  );
}

function VisualSlidesDemo() {
  return (
    <DemoCard
      title="Visual Slides"
      description="Gradient image cards with slide transition"
      state={{ progress: 0 }}
      code={`<AnimatedSlider items={images} transition="slide">
  {(img) => <ImageSlide slide={img} />}
</AnimatedSlider>`}
    >
      <AnimatedSlider items={IMAGE_SLIDES} transition="slide" duration={500}>
        {(item) => <ImageSlide slide={item} />}
      </AnimatedSlider>
    </DemoCard>
  );
}

function TransitionPickerDemo() {
  const [selected, setSelected] = useState<SlideTransition>("slide");

  const transitions: SlideTransition[] = [
    "slide",
    "fade",
    "scale",
    "fade-slide",
    "flip",
  ];

  return (
    <DemoCard
      title="Transition Picker"
      description="Switch between transition styles in real-time"
      state={{ progress: 0 }}
      code={`<AnimatedSlider transition="${selected}" />`}
    >
      <div className="flex flex-col gap-4 w-full">
        {/* Transition selector */}
        <div className="flex gap-1 bg-[#0a0a12] rounded-xl p-1 border border-[#2a2a3a]/50">
          {transitions.map((t) => (
            <button
              key={t}
              onClick={() => setSelected(t)}
              className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-bold uppercase transition-all duration-200 ${
                selected === t
                  ? "bg-[#ffd11a] text-black shadow-[0_0_12px_rgba(255,209,26,0.3)]"
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <AnimatedSlider
          key={selected}
          items={IMAGE_SLIDES}
          transition={selected}
          duration={500}
        >
          {(item) => <ImageSlide slide={item} />}
        </AnimatedSlider>
      </div>
    </DemoCard>
  );
}

// =============================================================================
// Export
// =============================================================================

export const AnimatedSliderGroup: React.FC = () => {
  return (
    <DemoSection title="Animated Slider">
      <SlideTransitionDemo />
      <FadeTransitionDemo />
      <ScaleTransitionDemo />
      <FadeSlideTransitionDemo />
      <FlipTransitionDemo />
      <VisualSlidesDemo />
      <TransitionPickerDemo />
    </DemoSection>
  );
};
