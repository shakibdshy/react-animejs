/**
 * SplitTextCjkDemo - Demonstrates CJK text splitting with Intl.Segmenter
 * Language-aware word splitting for Japanese, Chinese, and Thai
 * Using createTimeline with stagger for continuous loop animations.
 */

import React, { useRef, useEffect, useState, useCallback } from "react";
import { SplitText } from "../../../components";
import type { SplitTextRef } from "../../../components";
import type { TextSplitter } from "animejs";
import { createTimeline, stagger } from "../../../index";
import { DemoCard } from "../DemoCard";

export const SplitTextCjkDemo: React.FC = () => {
  const [lang, setLang] = useState<"japanese" | "chinese" | "thai">(
    "japanese",
  );
  const splitRef = useRef<SplitTextRef>(null);
  const timelineRef = useRef<any>(null);

  const textSamples = {
    japanese: "アニメ",
    chinese: "动画",
    thai: "ภาษา",
  };

  const setupAnimation = useCallback((split: TextSplitter) => {
    if (!split) return;

    if (timelineRef.current) {
      timelineRef.current.revert();
    }

    const targets = split.chars.length > 0 ? split.chars : split.words;
    if (targets.length === 0) return;

    timelineRef.current = createTimeline({
      loop: true,
      defaults: { ease: "outBack", duration: 400 },
    })
      .add(
        targets as any,
        {
          opacity: [0, 1],
          scale: [0.5, 1],
        } as any,
        stagger(80),
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
      title="cjk text"
      description="Language-aware splitting using Intl.Segmenter for Japanese, Chinese, and Thai."
    >
      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-wrap gap-2">
          {(["japanese", "chinese", "thai"] as const).map((l) => (
            <button
              key={l}
              onClick={() => {
                setLang(l);
              }}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tighter transition-all ${
                lang === l
                  ? "bg-[#ffd11a] text-[#12121a]"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="bg-[#1a1a24]/50 rounded-2xl p-8 border border-white/5 min-h-30 flex items-center justify-center overflow-hidden">
          <SplitText
            key={lang}
            ref={splitRef}
            params={{
              lines: false,
              words: true,
              chars: true,
            }}
            onReady={setupAnimation}
          >
            <p className="text-5xl md:text-6xl font-black text-white text-center leading-tight">
              {textSamples[lang]}
            </p>
          </SplitText>
        </div>

        <div className="text-[10px] text-slate-500 space-y-1 opacity-60 font-medium">
          <p>• Uses Intl.Segmenter for word boundaries</p>
          <p>• Continuous loop animation</p>
        </div>
      </div>
    </DemoCard>
  );
};

export default SplitTextCjkDemo;
