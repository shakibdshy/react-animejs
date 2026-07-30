import React, { useRef } from "react";
import { Edit2, RotateCcw } from "lucide-react";
import { useAnimeTimeline } from "@shakibdshy/react-animejs";

/**
 * HighFidelityTimePosition - A premium recreation of the Anime.js "Time Position" documentation example.
 */
export const HighFidelityTimePosition: React.FC = () => {
  const squareRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const triangleRef = useRef<HTMLDivElement>(null);

  // Position definitions for visual reconstruction
  // The documentation example logic:
  // .label('start', 0)
  // .add('.square', { x: '15rem', duration: 500 }, 500)
  // .add('.circle', { x: '15rem', duration: 500 }, 'start')
  // .add('.triangle', { x: '15rem', duration: 500 }, '<-=250')

  const { controls, state, isPlaying } = useAnimeTimeline(
    {
      autoplay: false,
      loop: false,
    },
    [
      { label: "start", position: 0 },
      {
        targets: squareRef,
        translateX: "15rem",
        duration: 500,
        position: 500,
      },
      {
        targets: circleRef,
        translateX: "15rem",
        duration: 500,
        position: "start",
      },
      {
        targets: triangleRef,
        translateX: "15rem",
        rotate: "1turn",
        duration: 500,
        position: "<-=250",
      },
    ],
  );

  // Calculate timeline bar widths and offsets
  // Total duration seems to be around 1000ms based on the logic:
  // square: 500 to 1000
  // circle: 0 to 500
  // triangle: starts at circle start (0) - 250? No, '<' is previous end.
  // Triangle starts at circle end (500) - 250 = 250.
  // So:
  // Circle: 0 - 500
  // Triangle: 250 - 750
  // Square: 500 - 1000
  // Total duration: 1000ms.

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-8 bg-slate-900/50 rounded-3xl backdrop-blur-md border border-slate-800 shadow-2xl mt-12 mb-12">
      {/* Header Info */}
      <div className="mb-8 text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 flex items-center justify-center sm:justify-start gap-2">
          <span className="w-2 h-8 bg-amber-500 rounded-full inline-block" />
          High Fidelity Recreation
        </h2>
        <p className="text-demo-text-secondary text-sm max-w-lg">
          This component matches the aesthetic and logic of the official
          {"Anime.js documentation's \"Time Position\" interactive demonstration."}
        </p>
      </div>

      {/* Main Interactive Card */}
      <div className="relative bg-[#302c11] rounded-[40px] p-6 sm:p-10 overflow-hidden shadow-[0_20px_50px_rgba(48,44,17,0.4)] border border-[#48421a]/50">
        {/* Card Header */}
        <div className="flex justify-between items-center mb-12">
          <h3 className="text-demo-accent text-2xl sm:text-3xl font-bold tracking-tight">
            Time position
          </h3>
          <div className="flex gap-4">
            <button className="text-demo-accent/60 hover:text-demo-accent transition-colors p-2 hover:bg-[#48421a] rounded-lg">
              <Edit2 className="w-6 h-6" />
            </button>
            <button
              onClick={() => controls.restart()}
              className="text-demo-accent/60 hover:text-demo-accent transition-colors p-2 hover:bg-[#48421a] rounded-lg"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Animation Display Area */}
        <div className="relative h-48 flex items-center justify-start px-4">
          {/* Ghosted (Start) Pyramid */}
          <div className="absolute left-10 flex flex-col items-center opacity-30 select-none">
            {/* Triangle Ghost */}
            <div className="w-0 h-0 border-l-28 border-r-28 border-b-48 border-transparent border-b-demo-accent mb-1" />
            <div className="flex gap-1.5">
              {/* Square Ghost */}
              <div className="w-14 h-14 bg-demo-accent rounded-xl" />
              {/* Circle Ghost */}
              <div className="w-14 h-14 bg-demo-accent rounded-full" />
            </div>
          </div>

          {/* Active (Animated) Pyramid */}
          <div className="absolute left-10 flex flex-col items-center z-10">
            {/* Triangle */}
            <div
              ref={triangleRef}
              className="w-0 h-0 border-l-28 border-r-28 border-b-48 border-transparent border-b-demo-accent mb-1"
            />
            <div className="flex gap-1.5">
              {/* Square */}
              <div
                ref={squareRef}
                className="w-14 h-14 bg-demo-accent rounded-xl"
              />
              {/* Circle */}
              <div
                ref={circleRef}
                className="w-14 h-14 bg-demo-accent rounded-full"
              />
            </div>
          </div>

          {/* Play Button Overlay (Visible when not playing) */}
          {!isPlaying && state.progress === 0 && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-[#302c11]/20 cursor-pointer z-20 group"
              onClick={() => controls.play()}
            >
              <div className="w-16 h-16 bg-demo-accent rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <div className="translate-x-1 border-t-10 border-t-transparent border-b-10 border-b-transparent border-l-18 border-l-[#302c11]" />
              </div>
            </div>
          )}
        </div>

        {/* Progress Display */}
        <div className="flex justify-end pr-2 mb-2">
          <span className="text-[10px] font-mono text-demo-accent/40 tracking-wider">
            PROGRESS: {Math.round(state.progress * 100)}%
          </span>
        </div>

        {/* Custom Timeline Visualizer */}
        <div
          className="mt-4 px-2 space-y-3 cursor-pointer group/timeline"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = Math.max(0, Math.min(1, x / rect.width));
            controls.seek(`${percentage * 100}%`);
          }}
        >
          {/* Progress Markers (Visual only) */}
          <div className="relative h-24 w-full">
            {/* Hover preview marker */}
            <div className="absolute top-0 bottom-0 w-px bg-white/10 opacity-0 group-hover/timeline:opacity-100 transition-opacity pointer-events-none" />

            {/* Vertical markers */}
            <div className="absolute left-0 top-0 bottom-0 border-l-2 border-demo-accent/40 flex flex-col items-start gap-1 pointer-events-none">
              <span className="text-[10px] font-bold text-demo-accent/60 ml-2 tracking-widest">
                START
              </span>
              <div className="h-full border-l-2 border-demo-accent/40" />
            </div>

            <div className="absolute right-0 top-0 bottom-0 border-l-2 border-demo-accent/80 pointer-events-none" />

            {/* Timeline Row 1: Square (Starts at 500ms) */}
            <div className="absolute top-2 w-full h-4 pointer-events-none">
              <div
                className="absolute h-full bg-[#48421a] rounded-full flex items-center px-0.5"
                style={{ left: "50%", right: "0" }}
              >
                <div className="w-2.5 h-2.5 bg-demo-accent/60 rounded-xs mx-1" />
                <div className="flex-1 h-3 bg-demo-accent/40 rounded-full" />
              </div>
            </div>

            {/* Timeline Row 2: Circle (Starts at 0ms) */}
            <div className="absolute top-8 w-full h-5 pointer-events-none">
              <div
                className="absolute h-full bg-demo-accent/60 rounded-full flex items-center justify-center overflow-hidden"
                style={{ left: "0%", right: "50%" }}
              >
                <div className="w-full h-full bg-demo-accent/20" />
              </div>
            </div>

            {/* Timeline Row 3: Triangle (Starts at 250ms) */}
            <div className="absolute top-14 w-full h-4 pointer-events-none">
              <div
                className="absolute h-full bg-[#48421a] rounded-full flex items-center px-1"
                style={{ left: "25%", right: "25%" }}
              >
                <div className="w-0 h-0 border-l-6 border-r-6 border-b-10 border-transparent border-b-demo-accent/60 mx-1" />
                <div className="flex-1 h-3 bg-demo-accent/40 rounded-full" />
              </div>
            </div>

            {/* Active Playhead */}
            <div
              className="absolute top-0 bottom-0 w-1 flex flex-col justify-between items-center z-30 pointer-events-none"
              style={{ left: `${state.progress * 100}%` }}
            >
              <div className="w-3 h-3 bg-demo-accent rounded-full shadow-[0_0_10px_#ffd11a] -translate-x-1/2" />
              <div className="flex-1 w-[2px] bg-demo-accent shadow-[0_0_10px_#ffd11a] -translate-x-1/2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
