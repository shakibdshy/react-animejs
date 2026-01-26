/**
 * React Anime.js Demo Page
 *
 * Interactive showcase of all library features
 */

"use client";

import { useState, useRef, type RefObject } from "react";
import {
  useAnime,
  useAnimeTimer,
  useAnimeTimeline,
  useAnimeDraggable,
  useAnimeControls,
  Animate,
  AnimeProvider,
  fadeIn,
  fadeInUp,
  scaleIn,
  popIn,
  pulse,
  bounce,
  shake,
  wiggle,
  spin,
  simpleStagger,
  staggerFromCenter,
} from "@/lib/react-animejs";
import "./demo.css";

// =============================================================================
// Demo Components
// =============================================================================

/**
 * Basic useAnime demonstration
 */
function BasicAnimationDemo() {
  const { ref, controls, state, isPlaying } = useAnime<HTMLDivElement>({
    translateX: [0, 200],
    rotate: [0, 360],
    scale: [1, 1.2, 1],
    duration: 1500,
    ease: "easeOutElastic(1, 0.5)",
    autoplay: true,
  });

  return (
    <div className="demo-section">
      <h3>Basic Animation (useAnime)</h3>
      <div className="demo-content">
        <div ref={ref} className="demo-box gradient-1">
          🎯
        </div>
        <div className="demo-controls">
          <button onClick={controls.play} disabled={isPlaying}>
            ▶️ Play
          </button>
          <button onClick={controls.pause}>⏸️ Pause</button>
          <button onClick={controls.restart}>🔄 Restart</button>
          <button onClick={controls.reverse}>↩️ Reverse</button>
        </div>
        <div className="demo-state">
          Progress: {Math.round(state.progress * 100)}%
        </div>
      </div>
    </div>
  );
}

/**
 * Timer demonstration
 */
function TimerDemo() {
  const [count, setCount] = useState(0);

  const { controls, state, isRunning } = useAnimeTimer({
    duration: 1000,
    loop: true,
    autoplay: false,
    onLoop: () => setCount((c) => c + 1),
  });

  return (
    <div className="demo-section">
      <h3>Timer (useAnimeTimer)</h3>
      <div className="demo-content">
        <div className="timer-display">
          <span className="timer-count">{count}</span>
          <span className="timer-label">loops</span>
        </div>
        <div
          className="timer-progress"
          style={{ width: `${state.progress * 100}%` }}
        />
        <div className="demo-controls">
          <button onClick={controls.play} disabled={isRunning}>
            ▶️ Start
          </button>
          <button onClick={controls.pause}>⏸️ Pause</button>
          <button
            onClick={() => {
              controls.restart();
              setCount(0);
            }}
          >
            🔄 Reset
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Timeline demonstration
 */
function TimelineDemo() {
  const box1Ref = useRef<HTMLDivElement>(null);
  const box2Ref = useRef<HTMLDivElement>(null);
  const box3Ref = useRef<HTMLDivElement>(null);

  const { controls, state, isPlaying } = useAnimeTimeline(
    {
      duration: 2000,
      defaults: {
        ease: "outQuad",
      },
    },
    [
      {
        targets: box1Ref as RefObject<HTMLElement>,
        translateX: 150,
        scale: 1.2,
        offset: 0,
      },
      {
        targets: box2Ref as RefObject<HTMLElement>,
        translateX: 150,
        rotate: 180,
        offset: 200,
      },
      {
        targets: box3Ref as RefObject<HTMLElement>,
        translateX: 150,
        translateY: -20,
        offset: 400,
      },
    ],
  );

  return (
    <div className="demo-section">
      <h3>Timeline Sequence (useAnimeTimeline)</h3>
      <div className="demo-content">
        <div className="timeline-boxes">
          <div ref={box1Ref} className="demo-box small gradient-2">
            1
          </div>
          <div ref={box2Ref} className="demo-box small gradient-3">
            2
          </div>
          <div ref={box3Ref} className="demo-box small gradient-4">
            3
          </div>
        </div>
        <div className="demo-controls">
          <button onClick={controls.play} disabled={isPlaying}>
            ▶️ Play
          </button>
          <button onClick={controls.pause}>⏸️ Pause</button>
          <button onClick={controls.restart}>🔄 Restart</button>
        </div>
        <div className="demo-state">
          Progress: {Math.round(state.progress * 100)}%
        </div>
      </div>
    </div>
  );
}

/**
 * Draggable demonstration
 */
function DraggableDemo() {
  const { ref, isDragging, position } = useAnimeDraggable<HTMLDivElement>({
    container: [-100, -100, 100, 100],
    releaseEase: "spring(1, 80, 10)",
  });

  return (
    <div className="demo-section">
      <h3>Draggable (useAnimeDraggable)</h3>
      <div className="demo-content">
        <div className="drag-container">
          <div
            ref={ref}
            className={`demo-box draggable gradient-5 ${isDragging ? "dragging" : ""}`}
          >
            👆 Drag me!
          </div>
        </div>
        <div className="demo-state">
          Position: ({Math.round(position.x)}, {Math.round(position.y)})
          {isDragging && " 🫳"}
        </div>
      </div>
    </div>
  );
}

/**
 * Shared controller demonstration
 */
function SharedControllerDemo() {
  const controller = useAnimeControls();

  const { ref: ref1 } = useAnime<HTMLDivElement>({
    translateX: [0, 100],
    duration: 1000,
    controller,
  });

  const { ref: ref2 } = useAnime<HTMLDivElement>({
    translateY: [0, -50],
    duration: 1000,
    controller,
  });

  const { ref: ref3 } = useAnime<HTMLDivElement>({
    rotate: [0, 360],
    duration: 1000,
    controller,
  });

  return (
    <div className="demo-section">
      <h3>Shared Controller (useAnimeControls)</h3>
      <div className="demo-content">
        <div className="shared-boxes">
          <div ref={ref1} className="demo-box small gradient-1">
            →
          </div>
          <div ref={ref2} className="demo-box small gradient-2">
            ↑
          </div>
          <div ref={ref3} className="demo-box small gradient-3">
            ↻
          </div>
        </div>
        <div className="demo-controls">
          <button onClick={() => controller.play()}>▶️ Play All</button>
          <button onClick={() => controller.pause()}>⏸️ Pause All</button>
          <button onClick={() => controller.restart()}>🔄 Restart All</button>
        </div>
      </div>
    </div>
  );
}

/**
 * Declarative Animate component demonstration
 */
function AnimateComponentDemo() {
  const [show, setShow] = useState(true);

  return (
    <div className="demo-section">
      <h3>Declarative Component (Animate)</h3>
      <div className="demo-content">
        {show && (
          <Animate {...popIn} autoplay>
            <div className="demo-box gradient-6">✨ Animated!</div>
          </Animate>
        )}
        <div className="demo-controls">
          <button onClick={() => setShow(!show)}>
            {show ? "❌ Hide" : "✨ Show"}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Presets showcase
 */
function PresetsDemo() {
  const [selectedPreset, setSelectedPreset] = useState<string>("fadeInUp");
  const [key, setKey] = useState(0);

  const presetOptions = [
    "fadeIn",
    "fadeInUp",
    "scaleIn",
    "popIn",
    "pulse",
    "bounce",
    "shake",
    "wiggle",
    "spin",
  ];

  const presetMap: Record<string, object> = {
    fadeIn,
    fadeInUp,
    scaleIn,
    popIn,
    pulse,
    bounce,
    shake,
    wiggle,
    spin,
  };

  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset);
    setKey((k) => k + 1);
  };

  return (
    <div className="demo-section">
      <h3>Animation Presets</h3>
      <div className="demo-content">
        <Animate key={key} {...presetMap[selectedPreset]} autoplay>
          <div className="demo-box large gradient-7">{selectedPreset}</div>
        </Animate>
        <div className="preset-buttons">
          {presetOptions.map((preset) => (
            <button
              key={preset}
              className={selectedPreset === preset ? "active" : ""}
              onClick={() => handlePresetChange(preset)}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Stagger demonstration
 */
function StaggerDemo() {
  const { controls } = useAnime({
    targets: ".stagger-item",
    translateY: [50, 0],
    opacity: [0, 1],
    scale: [0.5, 1],
    duration: 600,
    delay: simpleStagger(100),
  });

  const { controls: controls2 } = useAnime({
    targets: ".stagger-item",
    translateY: [50, 0],
    opacity: [0, 1],
    scale: [0.5, 1],
    duration: 600,
    delay: staggerFromCenter(80),
  });

  return (
    <div className="demo-section">
      <h3>Stagger Animations</h3>
      <div className="demo-content">
        <div className="stagger-grid">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="stagger-item demo-box small gradient-1">
              {i + 1}
            </div>
          ))}
        </div>
        <div className="demo-controls">
          <button onClick={controls.restart}>📊 Linear Stagger</button>
          <button onClick={controls2.restart}>🎯 From Center</button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Main Demo Page
// =============================================================================

export default function ReactAnimejsDemo() {
  return (
    <AnimeProvider>
      <div className="demo-page">
        <header className="demo-header">
          <Animate {...fadeInUp} autoplay>
            <h1>🎬 React Anime.js</h1>
          </Animate>
          <Animate {...fadeIn} delay={200} autoplay>
            <p>A comprehensive React wrapper for Anime.js v4</p>
          </Animate>
        </header>

        <main className="demo-grid">
          <BasicAnimationDemo />
          <TimerDemo />
          <TimelineDemo />
          <DraggableDemo />
          <SharedControllerDemo />
          <AnimateComponentDemo />
          <PresetsDemo />
          <StaggerDemo />
        </main>

        <footer className="demo-footer">
          <p>Built with ❤️ using React + Anime.js v4</p>
        </footer>
      </div>
    </AnimeProvider>
  );
}
