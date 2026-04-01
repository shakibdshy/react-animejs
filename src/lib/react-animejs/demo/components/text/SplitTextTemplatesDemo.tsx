/**
 * SplitTextTemplatesDemo - Demonstrates custom templates for split text
 * Using createTimeline with stagger for continuous loop animations.
 */

import React, { useRef, useEffect, useState, useCallback } from "react";
import { SplitText } from "../../../components";
import type { SplitTextRef } from "../../../components";
import type { TextSplitterParams, TextSplitter } from "animejs";
import { createTimeline, stagger } from "../../../index";
import { DemoCard } from "../DemoCard";

export const SplitTextTemplatesDemo: React.FC = () => {
  const [templateMode, setTemplateMode] = useState<
    "block" | "clip" | "accessible"
  >("block");
  const splitRef = useRef<SplitTextRef>(null);
  const timelineRef = useRef<any>(null);

  const templateConfigs = {
    block: {
      lines: true,
      words: true,
      chars: true,
    },
    clip: {
      lines: { wrap: "clip" },
      words: { wrap: "clip" },
      chars: { wrap: "clip" },
    },
    accessible: {
      lines: true,
      words: true,
      chars: true,
      accessible: true,
    },
  } as const;

  const setupAnimation = useCallback((split: TextSplitter) => {
    if (!split) return;

    if (timelineRef.current) {
      timelineRef.current.revert();
    }

    const targets = split.chars.length > 0 ? split.chars : split.words;
    if (targets.length === 0) return;

    timelineRef.current = createTimeline({
      loop: true,
      defaults: { ease: "outExpo", duration: 600 },
    })
      .add(
        targets as any,
        {
          opacity: [0, 1],
          translateY: [20, 0],
          rotate: [-10, 0],
        } as any,
        stagger(30),
      );

    timelineRef.current.init();
  }, []);

  useEffect(() => {
    return () => {
      if (timelineRef.current) {
        timelineRef.current.revert();
      }
    };
  }, []);

  return (
    <DemoCard
      title="split templates"
      description="Custom HTML templates and accessibility options for split text."
    >
      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-wrap gap-2">
          {(["block", "clip", "accessible"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setTemplateMode(mode);
              }}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tighter transition-all ${
                templateMode === mode
                  ? "bg-[#ffd11a] text-[#12121a]"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <div className="bg-[#1a1a24]/50 rounded-2xl p-8 border border-white/5 min-h-30 flex items-center justify-center overflow-hidden">
          <SplitText
            key={templateMode}
            ref={splitRef}
            params={
              templateConfigs[templateMode] as TextSplitterParams
            }
            onReady={setupAnimation}
          >
            <p className="text-3xl md:text-4xl font-black text-white text-center leading-tight">
              Split Me
            </p>
          </SplitText>
        </div>

        <div className="text-[10px] text-slate-500 space-y-1 opacity-60 font-medium">
          <p>• block: Wraps elements in block spans</p>
          <p>• clip: Overflow clipping for animations</p>
          <p>• accessible: Preserves screen reader text</p>
        </div>
      </div>
    </DemoCard>
  );
};

export default SplitTextTemplatesDemo;
