import { useState, useCallback, useRef } from "react";
import { Animate } from "./Animate";
import type { AnimationState, PlaybackControls } from "../types";

export interface SpinningCubeProps {
  /** Cube size in px */
  size?: number;
  /** Spin duration in ms */
  duration?: number;
  /** Rotation axis: x, y, or both */
  axis?: "x" | "y" | "both";
  /** Whether to auto-play on mount */
  autoplay?: boolean;
  /** Loop the rotation */
  loop?: boolean;
  /** Easing function */
  ease?: string;
  /** Callback on each loop */
  onLoop?: () => void;
  /** Custom className */
  className?: string;
}

export function SpinningCube({
  size = 120,
  duration = 3000,
  axis = "both",
  autoplay = false,
  loop = true,
  ease = "linear",
  onLoop,
  className = "",
}: SpinningCubeProps) {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const controlsRef = useRef<PlaybackControls | null>(null);

  const handleControlsReady = useCallback(
    (controls: PlaybackControls) => {
      controlsRef.current = controls;
    },
    [],
  );

  const handlePause = useCallback(() => {
    controlsRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const handleResume = useCallback(() => {
    controlsRef.current?.resume();
    setIsPlaying(true);
  }, []);

  const handleRestart = useCallback(() => {
    controlsRef.current?.restart();
    setIsPlaying(true);
  }, []);

  const handleReverse = useCallback(() => {
    controlsRef.current?.reverse();
  }, []);

  const half = size / 2;

  const faceBase: React.CSSProperties = {
    position: "absolute",
    width: size,
    height: size,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: size * 0.16,
    fontWeight: 800,
    fontFamily: "monospace",
    backfaceVisibility: "hidden",
    border: `1px solid rgba(255, 209, 26, 0.15)`,
  };

  const faces = [
    {
      label: "Front",
      transform: `translateZ(${half}px)`,
      bg: "rgba(255, 209, 26, 0.08)",
      color: "#ffd11a",
    },
    {
      label: "Back",
      transform: `rotateY(180deg) translateZ(${half}px)`,
      bg: "rgba(255, 77, 106, 0.08)",
      color: "#ff4d6a",
    },
    {
      label: "Right",
      transform: `rotateY(90deg) translateZ(${half}px)`,
      bg: "rgba(99, 179, 237, 0.08)",
      color: "#63b3ed",
    },
    {
      label: "Left",
      transform: `rotateY(-90deg) translateZ(${half}px)`,
      bg: "rgba(104, 211, 145, 0.08)",
      color: "#68d391",
    },
    {
      label: "Top",
      transform: `rotateX(90deg) translateZ(${half}px)`,
      bg: "rgba(183, 148, 244, 0.08)",
      color: "#b794f4",
    },
    {
      label: "Bottom",
      transform: `rotateX(-90deg) translateZ(${half}px)`,
      bg: "rgba(246, 173, 85, 0.08)",
      color: "#f6ad55",
    },
  ];

  return (
    <div className={`flex flex-col items-center gap-6 ${className}`}>
      {/* 3D Scene */}
      <div
        style={{
          perspective: size * 4,
          perspectiveOrigin: "50% 50%",
        }}
      >
        <Animate
          autoplay={autoplay}
          duration={duration}
          loop={loop}
          ease={ease}
          rotateX={axis === "y" ? undefined : "1turn"}
          rotateY={axis === "x" ? undefined : "1turn"}
          onControlsReady={handleControlsReady}
          onLoop={onLoop}
          onStateChange={(state: AnimationState) => {
            const running = !state.paused && state.began && !state.completed;
            setIsPlaying(running);
            if (state.completed && loop !== true) setIsPlaying(false);
          }}
        >
          <div
            style={{
              width: size,
              height: size,
              position: "relative",
              transformStyle: "preserve-3d",
            }}
          >
            {faces.map((face) => (
              <div
                key={face.label}
                style={{
                  ...faceBase,
                  transform: face.transform,
                  backgroundColor: face.bg,
                  color: face.color,
                }}
              >
                {face.label}
              </div>
            ))}
          </div>
        </Animate>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        {isPlaying ? (
          <button
            onClick={handlePause}
            className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#2a2a3a] text-[#e0e0e0] rounded-lg hover:bg-[#3a3a4a] transition-colors"
          >
            Pause
          </button>
        ) : (
          <button
            onClick={handleResume}
            className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#ffd11a] text-[#12121a] rounded-lg hover:bg-[#ffd11a]/90 transition-colors"
          >
            Resume
          </button>
        )}
        <button
          onClick={handleRestart}
          className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#2a2a3a] text-slate-400 rounded-lg hover:bg-[#3a3a4a] hover:text-[#e0e0e0] transition-colors"
        >
          Restart
        </button>
        <button
          onClick={handleReverse}
          className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#2a2a3a] text-slate-400 rounded-lg hover:bg-[#3a3a4a] hover:text-[#e0e0e0] transition-colors"
        >
          Reverse
        </button>
      </div>
    </div>
  );
}

export default SpinningCube;
