import React, { useRef, useState, useCallback } from "react";
import { useAnime } from "@/lib/react-animejs";
import { DemoCard } from "./DemoCard";
import { lerp, clamp, mapRange, snap, wrap, damp } from "@/lib/react-animejs/utils/anime-utils";

/**
 * Demo for math utility functions: lerp, clamp, mapRange, snap, wrap, damp
 */
export const MathUtilitiesDemo: React.FC = () => {
  const [lerpValue, setLerpValue] = useState(50);
  const [clampValue, setClampValue] = useState(150);
  const [mapRangeValue, setMapRangeValue] = useState(50);
  const [snapValue, setSnapValue] = useState(47);
  const [wrapValue, setWrapValue] = useState(120);
  const [dampValue, setDampValue] = useState(50);

  const boxRef = useRef<HTMLDivElement>(null);

  const { controls, state, isPlaying } = useAnime(
    {
      targets: boxRef,
      translateX: () => lerpValue - 100,
      duration: 300,
      autoplay: false,
    },
    [lerpValue],
  );

  const handleLerpChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setLerpValue(val);
    controls?.restart();
  }, [controls]);

  const handleClampChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setClampValue(parseFloat(e.target.value));
  }, []);

  const handleMapRangeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMapRangeValue(parseFloat(e.target.value));
  }, []);

  const handleSnapChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSnapValue(parseFloat(e.target.value));
  }, []);

  const handleWrapChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setWrapValue(parseFloat(e.target.value));
  }, []);

  const handleDampChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDampValue(parseFloat(e.target.value));
  }, []);

  const lerpResult = lerp(0, 100, lerpValue / 100);
  const clampResult = clamp(clampValue, 0, 100);
  const mapRangeResult = mapRange(mapRangeValue, 0, 100, 0, 1000);
  const snapResult = snap(snapValue, 25);
  const wrapResult = wrap(wrapValue, 0, 100);
  const dampResult = damp(0, 100, dampValue / 100, 0.1);

  return (
    <DemoCard
      title="Math Utilities"
      description="lerp, clamp, mapRange, snap, wrap, damp"
      controls={controls}
      state={state}
      isPlaying={isPlaying}
      code={`lerp(0, 100, ${lerpValue / 100}) = ${lerpResult.toFixed(2)}`}
    >
      <div className="w-full space-y-6">
        {/* Lerp Demo */}
        <div>
          <div className="flex justify-between text-xs text-demo-text-secondary mb-2">
            <span>lerp(start, end, t)</span>
            <span className="text-demo-accent">{lerpResult.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={lerpValue}
            onChange={handleLerpChange}
            className="w-full accent-demo-accent"
          />
          <div className="h-2 bg-demo-border rounded-full mt-2 relative">
            <div
              className="h-full bg-demo-accent rounded-full transition-all duration-100"
              style={{ width: `${lerpResult}%` }}
            />
          </div>
        </div>

        {/* Clamp Demo */}
        <div>
          <div className="flex justify-between text-xs text-demo-text-secondary mb-2">
            <span>clamp(value, min, max)</span>
            <span className="text-demo-accent">{clampResult}</span>
          </div>
          <input
            type="range"
            min="-50"
            max="150"
            value={clampValue}
            onChange={handleClampChange}
            className="w-full accent-demo-accent"
          />
          <div className="flex justify-between text-[10px] text-demo-text-muted mt-1">
            <span>-50</span>
            <span className="text-emerald-400">clamped to 0-100</span>
            <span>150</span>
          </div>
        </div>

        {/* MapRange Demo */}
        <div>
          <div className="flex justify-between text-xs text-demo-text-secondary mb-2">
            <span>mapRange(value, inMin, inMax, outMin, outMax)</span>
            <span className="text-demo-accent">{mapRangeResult.toFixed(0)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={mapRangeValue}
            onChange={handleMapRangeChange}
            className="w-full accent-demo-accent"
          />
          <div className="text-[10px] text-demo-text-muted mt-1">
            Maps 0-100 → 0-1000
          </div>
        </div>

        {/* Snap Demo */}
        <div>
          <div className="flex justify-between text-xs text-demo-text-secondary mb-2">
            <span>snap(value, increment)</span>
            <span className="text-demo-accent">{snapResult}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={snapValue}
            onChange={handleSnapChange}
            className="w-full accent-demo-accent"
          />
          <div className="flex gap-1 mt-2">
            {Array.from({ length: 5 }, (_, i) => i * 25).map((val) => (
              <div
                key={val}
                className={`h-4 flex-1 rounded ${snapResult === val ? "bg-demo-accent" : "bg-demo-border"}`}
              />
            ))}
          </div>
        </div>

        {/* Wrap Demo */}
        <div>
          <div className="flex justify-between text-xs text-demo-text-secondary mb-2">
            <span>wrap(value, min, max)</span>
            <span className="text-demo-accent">{wrapResult.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            value={wrapValue}
            onChange={handleWrapChange}
            className="w-full accent-demo-accent"
          />
          <div className="text-[10px] text-demo-text-muted mt-1">
            Wraps value around 0-100 range
          </div>
        </div>

        {/* Damp Demo */}
        <div>
          <div className="flex justify-between text-xs text-demo-text-secondary mb-2">
            <span>damp(current, target, t, dt)</span>
            <span className="text-demo-accent">{dampResult.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={dampValue}
            onChange={handleDampChange}
            className="w-full accent-demo-accent"
          />
          <div className="h-2 bg-demo-border rounded-full mt-2 relative">
            <div
              className="h-full bg-blue-400 rounded-full transition-all duration-100"
              style={{ width: `${dampResult}%` }}
            />
          </div>
        </div>
      </div>
    </DemoCard>
  );
};
