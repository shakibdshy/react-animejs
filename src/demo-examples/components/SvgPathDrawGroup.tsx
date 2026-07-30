import React, { useState } from "react";
import { DemoSection } from "./DemoSection";
import { DemoCard } from "./DemoCard";
import { AnimeDraw } from "@shakibdshy/react-animejs";

// =============================================================================
// SVG paths for demos
// =============================================================================

const WAVE_PATH =
  "M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80 S 230 10, 260 80 S 315 150, 340 80";

const HEART_PATH =
  "M140 20 C73 20 20 74 20 140 C20 275 156 310 276 392 C278 393 282 393 284 392 C404 310 540 275 540 140 C540 74 487 20 420 20 C359 20 308 67 280 108 C252 67 201 20 140 20Z";

const STAR_PATH =
  "M250 5 L317 165 L490 185 L362 305 L395 475 L250 395 L105 475 L138 305 L10 185 L183 165Z";

const GLOBE_PATHS = [
  // Outer circle
  "M200 20 A180 180 0 1 1 199.99 20Z",
  // Horizontal equator
  "M30 200 Q115 160 200 200 Q285 240 370 200",
  // Vertical meridian
  "M200 20 Q160 110 200 200 Q240 290 200 380",
  // Left ellipse
  "M110 50 Q80 200 110 350",
  // Right ellipse
  "M290 50 Q320 200 290 350",
];

const LIGHTNING_PATH =
  "M270 15 L120 215 H210 L150 495 L380 185 H280Z";

const MOUNTAIN_PATHS = [
  // Back mountain
  "M20 280 L140 100 L260 280",
  // Front mountain
  "M100 280 L220 60 L340 280",
  // Snow caps (back)
  "M120 130 L140 100 L160 130",
  // Snow caps (front)
  "M200 90 L220 60 L240 90",
  // Ground line
  "M0 280 L360 280",
  // Sun
  "M300 80 A30 30 0 1 1 299.99 80",
];

const CODE_BRACKET_PATHS = [
  // {
  "M60 60 Q20 60 20 120 Q20 180 60 180",
  "M20 120 L0 120",
  // }
  "M140 60 Q180 60 180 120 Q180 180 140 180",
  "M180 120 L200 120",
  // <
  "M230 80 L260 120 L230 160",
  // /
  "M280 160 L310 80",
  // >
  "M330 80 L300 120 L330 160",
];

const MUSIC_NOTE_PATH =
  "M200 60 L200 240 Q200 310 140 310 Q80 310 80 260 Q80 210 140 210 Q170 210 200 230";
const MUSIC_NOTE_STEM = "M200 60 L260 50 L260 80 L200 90";

// =============================================================================
// Single Path Draw
// =============================================================================

function SinglePathDrawDemo() {
  const [playing, setPlaying] = useState(false);

  return (
    <DemoCard
      title="Single Path Draw"
      description="A wave path drawn from start to end with easing"
      state={{ progress: playing ? 1 : 0 }}
      code={`<AnimeDraw draw={["0 1", "1 0"]} duration={2000} ease="outExpo" autoplay loop alternate>
  <path d={wavePath} fill="none" stroke="#ffd11a" />
</AnimeDraw>`}
    >
      <div className="flex flex-col items-center gap-4 w-full">
        <svg
          viewBox="0 0 350 160"
          className="w-full max-w-lg"
          aria-label="Single path draw"
        >
          <AnimeDraw
            draw={["0 1", "1 0"]}
            duration={2000}
            ease="outExpo"
            autoplay
            loop
            alternate
            onBegin={() => setPlaying(true)}
            onComplete={() => setPlaying(false)}
          >
            <path
              d={WAVE_PATH}
              fill="none"
              stroke="#ffd11a"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </AnimeDraw>
        </svg>
      </div>
    </DemoCard>
  );
}

// =============================================================================
// Looping Draw
// =============================================================================

function LoopingDrawDemo() {
  return (
    <DemoCard
      title="Looping Draw"
      description="Continuously draws and erases a heart shape"
      state={{ progress: 0 }}
      code={`<AnimeDraw
  draw={["0 0", "0 1", "1 1", "1 0", "0 0"]}
  duration={4000}
  ease="inOutQuad"
  loop
  autoplay>
  <path d={heartPath} />
</AnimeDraw>`}
    >
      <div className="flex flex-col items-center gap-4 w-full">
        <svg viewBox="0 0 560 420" className="w-full max-w-xs">
          <defs>
            <linearGradient id="heartGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff4d6a" />
              <stop offset="100%" stopColor="#ff6b9d" />
            </linearGradient>
          </defs>
          <AnimeDraw
            draw={["0 0", "0 1", "1 1", "1 0", "0 0"]}
            duration={4000}
            ease="inOutQuad"
            loop
            autoplay
          >
            <path
              d={HEART_PATH}
              fill="none"
              stroke="url(#heartGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </AnimeDraw>
        </svg>
      </div>
    </DemoCard>
  );
}

// =============================================================================
// Staggered Multi-Path
// =============================================================================

function StaggeredDrawDemo() {
  return (
    <DemoCard
      title="Staggered Multi-Path"
      description="Multiple paths drawn sequentially with staggered delay"
      state={{ progress: 0 }}
      code={`{paths.map((d, i) => (
  <AnimeDraw key={i}
    draw={["0 0", "0 1", "1 1"]}
    delay={i * 200}
    duration={1500}
    loop autoplay>
    <path d={d} />
  </AnimeDraw>
))}`}
    >
      <div className="flex flex-col items-center gap-4 w-full">
        <svg viewBox="0 0 400 400" className="w-full max-w-xs">
          <defs>
            <linearGradient id="starGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffd11a" />
              <stop offset="100%" stopColor="#f6ad55" />
            </linearGradient>
          </defs>
          <AnimeDraw
            draw={["0 0", "0 1", "1 1"]}
            duration={2000}
            ease="outExpo"
            loop
            autoplay
          >
            <path
              d={STAR_PATH}
              fill="none"
              stroke="url(#starGrad)"
              strokeWidth="3"
              strokeLinejoin="round"
            />
          </AnimeDraw>
        </svg>
      </div>
    </DemoCard>
  );
}

// =============================================================================
// Globe Drawing
// =============================================================================

function GlobeDrawDemo() {
  return (
    <DemoCard
      title="Globe Drawing"
      description="Multiple SVG paths combined to draw a globe with staggered timing"
      state={{ progress: 0 }}
      code={`{globePaths.map((d, i) => (
  <AnimeDraw key={i}
    draw={["0 0", "0 1", "1 1"]}
    delay={i * 300}
    duration={1500} loop autoplay>
    <path d={d} />
  </AnimeDraw>
))}`}
    >
      <div className="flex flex-col items-center gap-4 w-full">
        <svg viewBox="0 0 400 400" className="w-full max-w-xs">
          {GLOBE_PATHS.map((d, i) => (
            <AnimeDraw
              key={i}
              draw={["0 0", "0 1", "1 1"]}
              delay={i * 300}
              duration={1500}
              ease="outExpo"
              loop
              autoplay
            >
              <path
                d={d}
                fill="none"
                stroke="#63b3ed"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </AnimeDraw>
          ))}
        </svg>
      </div>
    </DemoCard>
  );
}

// =============================================================================
// Landscape Scene
// =============================================================================

function LandscapeDrawDemo() {
  return (
    <DemoCard
      title="Landscape Scene"
      description="Mountains, snow caps, and sun drawn progressively"
      state={{ progress: 0 }}
      code={`{scenePaths.map((d, i) => (
  <AnimeDraw key={i}
    draw={["0 0", "0 1", "1 1"]}
    delay={i * 400}
    duration={2000} loop autoplay>
    <path d={d} />
  </AnimeDraw>
))}`}
    >
      <div className="flex flex-col items-center gap-4 w-full">
        <svg viewBox="0 0 360 300" className="w-full max-w-lg">
          <defs>
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(99,179,237,0.1)" />
              <stop offset="100%" stopColor="rgba(99,179,237,0.02)" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="360" height="300" fill="url(#skyGrad)" rx="12" />
          {MOUNTAIN_PATHS.map((d, i) => (
            <AnimeDraw
              key={i}
              draw={["0 0", "0 1", "1 1"]}
              delay={i * 400}
              duration={2000}
              ease="outExpo"
              loop
              autoplay
            >
              <path
                d={d}
                fill="none"
                stroke={
                  i < 2
                    ? "#68d391"
                    : i === 4
                      ? "#3a5a40"
                      : i === 5
                        ? "#f6ad55"
                        : "#e0e0e0"
                }
                strokeWidth={i === 5 ? 2.5 : 2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </AnimeDraw>
          ))}
        </svg>
      </div>
    </DemoCard>
  );
}

// =============================================================================
// Code Brackets
// =============================================================================

function CodeBracketsDrawDemo() {
  return (
    <DemoCard
      title="Code Brackets"
      description="Draws curly braces and angle brackets with stagger"
      state={{ progress: 0 }}
      code={`<AnimeDraw draw={["0 0", "0 1", "1 1"]} delay={i * 200}>
  <path d={bracketPath} />
</AnimeDraw>`}
    >
      <div className="flex flex-col items-center gap-4 w-full">
        <svg viewBox="0 0 340 240" className="w-full max-w-md">
          {CODE_BRACKET_PATHS.map((d, i) => (
            <AnimeDraw
              key={i}
              draw={["0 0", "0 1", "1 1"]}
              delay={i * 200}
              duration={1200}
              ease="outExpo"
              loop
              autoplay
            >
              <path
                d={d}
                fill="none"
                stroke={i < 2 ? "#b794f4" : "#63b3ed"}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </AnimeDraw>
          ))}
        </svg>
      </div>
    </DemoCard>
  );
}

// =============================================================================
// Lightning Bolt
// =============================================================================

function LightningDrawDemo() {
  return (
    <DemoCard
      title="Lightning Bolt"
      description="Quick flash-style drawing of a lightning bolt"
      state={{ progress: 0 }}
      code={`<AnimeDraw draw={["0 1", "1 0"]} duration={800} ease="outQuad" loop alternate autoplay>
  <path d={lightningPath} />
</AnimeDraw>`}
    >
      <div className="flex flex-col items-center gap-4 w-full">
        <svg viewBox="0 0 400 510" className="w-full max-w-50">
          <defs>
            <linearGradient id="boltGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffd11a" />
              <stop offset="100%" stopColor="#f6ad55" />
            </linearGradient>
          </defs>
          <AnimeDraw
            draw={["0 1", "1 0"]}
            duration={800}
            ease="outQuad"
            loop
            alternate
            autoplay
          >
            <path
              d={LIGHTNING_PATH}
              fill="none"
              stroke="url(#boltGrad)"
              strokeWidth="5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </AnimeDraw>
        </svg>
      </div>
    </DemoCard>
  );
}

// =============================================================================
// Music Note
// =============================================================================

function MusicNoteDrawDemo() {
  return (
    <DemoCard
      title="Music Notes"
      description="Two paths drawn to create a music note with staggered timing"
      state={{ progress: 0 }}
      code={`<AnimeDraw draw={["0 0", "0 1", "1 1"]} duration={1500} delay={0}>
  <path d={noteBody} />
</AnimeDraw>
<AnimeDraw draw={["0 0", "0 1", "1 1"]} duration={1000} delay={500}>
  <path d={noteStem} />
</AnimeDraw>`}
    >
      <div className="flex flex-col items-center gap-4 w-full">
        <svg viewBox="0 0 320 380" className="w-full max-w-50">
          <AnimeDraw
            draw={["0 0", "0 1", "1 1"]}
            duration={1500}
            ease="outExpo"
            delay={0}
            loop
            autoplay
          >
            <path
              d={MUSIC_NOTE_PATH}
              fill="none"
              stroke="#b794f4"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </AnimeDraw>
          <AnimeDraw
            draw={["0 0", "0 1", "1 1"]}
            duration={1000}
            ease="outExpo"
            delay={500}
            loop
            autoplay
          >
            <path
              d={MUSIC_NOTE_STEM}
              fill="none"
              stroke="#b794f4"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </AnimeDraw>
        </svg>
      </div>
    </DemoCard>
  );
}

// =============================================================================
// Export
// =============================================================================

export const SvgPathDrawGroup: React.FC = () => {
  return (
    <DemoSection title="SVG Path Drawing" frameChildren={false} codeId={false}>
      <SinglePathDrawDemo />
      <LoopingDrawDemo />
      <StaggeredDrawDemo />
      <GlobeDrawDemo />
      <LandscapeDrawDemo />
      <CodeBracketsDrawDemo />
      <LightningDrawDemo />
      <MusicNoteDrawDemo />
    </DemoSection>
  );
};
