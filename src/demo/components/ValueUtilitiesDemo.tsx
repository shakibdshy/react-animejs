import React, { useRef, useState, useCallback } from "react";
import { useAnime } from "@/lib/react-animejs";
import { DemoCard } from "./DemoCard";
import { round, keepTime } from "@/lib/react-animejs/utils/anime-utils";

/**
 * Demo for value utilities: round, keepTime
 */
export const ValueUtilitiesDemo: React.FC = () => {
  const [roundValue, setRoundValue] = useState(3.14159);
  const [roundResult, setRoundResult] = useState(3);
  const [keepTimeElapsed, setKeepTimeElapsed] = useState(0);

  const box1Ref = useRef<HTMLDivElement>(null);
  const box2Ref = useRef<HTMLDivElement>(null);

  const { controls, state, isPlaying } = useAnime(
    {
      targets: box1Ref,
      translateX: [0, 150],
      duration: 1000,
      autoplay: false,
    },
    [],
  );

  const trackedAnimation = useRef<ReturnType<typeof keepTime> | null>(null);

  const handleRound = useCallback(() => {
    const result = round(roundValue);
    setRoundResult(result);
  }, [roundValue]);

  const handleKeepTime = useCallback(() => {
    if (trackedAnimation.current) return;

    trackedAnimation.current = keepTime(() => {
      return {
        targets: box2Ref.current,
        translateX: [0, 200],
        duration: 2000,
        ease: "linear",
        onUpdate: (anim: { currentTime: number }) => {
          setKeepTimeElapsed(anim.currentTime);
        },
      };
    });

    trackedAnimation.current();
  }, []);

  return (
    <DemoCard
      title="Value Utilities"
      description="round, keepTime"
      controls={controls}
      state={state}
      isPlaying={isPlaying}
      code={`round(${roundValue}) = ${roundResult}`}
    >
      <div className="w-full space-y-6">
        {/* Round Demo */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-demo-text-secondary">round(value)</span>
            <button
              onClick={handleRound}
              className="text-xs bg-demo-accent text-black px-3 py-1 rounded-full font-medium hover:bg-demo-accent/80 transition-colors"
            >
              Round
            </button>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            step="0.0001"
            value={roundValue}
            onChange={(e) => setRoundValue(parseFloat(e.target.value))}
            className="w-full accent-demo-accent"
          />
          <div className="flex justify-between text-xs mt-2">
            <span className="text-demo-text-muted">{roundValue.toFixed(4)}</span>
            <span className="text-demo-accent font-bold">{roundResult}</span>
          </div>
        </div>

        {/* KeepTime Demo */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-demo-text-secondary">keepTime(constructor)</span>
            <button
              onClick={handleKeepTime}
              className="text-xs bg-[#4ecdc4] text-black px-3 py-1 rounded-full font-medium hover:bg-[#4ecdc4]/80 transition-colors"
            >
              Start Tracked Animation
            </button>
          </div>
          <div
            ref={box2Ref}
            className="w-12 h-12 bg-[#4ecdc4] rounded-lg"
          />
          <div className="text-[10px] text-demo-text-muted mt-2">
            keepTime preserves animation progress when recreated
          </div>
          <div className="text-xs text-demo-accent font-mono mt-1">
            Elapsed: {keepTimeElapsed.toFixed(0)}ms
          </div>
        </div>
      </div>
    </DemoCard>
  );
};
