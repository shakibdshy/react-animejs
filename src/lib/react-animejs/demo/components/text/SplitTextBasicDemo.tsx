/**
 * SplitTextBasicDemo - Demonstrates basic text splitting with SplitText component
 * Using createTimeline with stagger for continuous loop animations.
 */

import React, { useRef, useEffect, useState, useCallback } from "react";
import { SplitText } from "../../../components";
import type { SplitTextRef } from "../../../components";
import type { TextSplitter } from "animejs";
import { createTimeline, stagger } from "../../../index";
import { DemoCard } from "../DemoCard";

export const SplitTextBasicDemo: React.FC = () => {
  const [splitMode, setSplitMode] = useState<"chars" | "words" | "lines">("chars");
  const splitRef = useRef<SplitTextRef>(null);
  const timelineRef = useRef<any>(null);

  const setupAnimation = useCallback((split: TextSplitter) => {
    if (!split) return;

    if (timelineRef.current) {
      timelineRef.current.revert();
    }

    const elements =
      splitMode === "chars"
        ? split.chars
        : splitMode === "words"
          ? split.words
          : split.lines;

    if (elements.length === 0) return;

    timelineRef.current = createTimeline({
      loop: true,
      defaults: { ease: "outExpo", duration: 600 },
    })
      .add(
        elements as any,
        {
          opacity: [0, 1],
          translateY: [20, 0],
        } as any,
        stagger(30),
      );

    timelineRef.current.init();
  }, [splitMode]);

  useEffect(() => {
    return () => {
      if (timelineRef.current) {
        timelineRef.current.revert();
      }
    };
  }, []);

  return (
    <DemoCard
      title="basic split"
      description="SplitText — declarative text splitting with continuous loop animations."
    >
      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-wrap gap-2">
          {(["chars", "words", "lines"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setSplitMode(mode);
              }}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tighter transition-all ${
                splitMode === mode
                  ? "bg-[#ffd11a] text-[#12121a]"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <div className="bg-[#1a1a24]/50 rounded-2xl p-8 border border-white/5 min-h-30 flex items-center justify-center">
          <SplitText
            key={splitMode}
            ref={splitRef}
            params={
              splitMode === "chars"
                ? { lines: false, words: false, chars: true }
                : splitMode === "words"
                  ? { lines: false, words: true, chars: false }
                  : { lines: true, words: false, chars: false }
            }
            onReady={setupAnimation}
          >
            <p className="text-3xl md:text-4xl font-black text-white text-center leading-tight">
              Hello World
            </p>
          </SplitText>
        </div>

        <div className="text-[10px] text-slate-500 space-y-1 opacity-60 font-medium">
          <p>• Continuous loop animation on {splitMode}</p>
          <p>• Switch modes to see different split levels</p>
        </div>
      </div>
    </DemoCard>
  );
};

export default SplitTextBasicDemo;
