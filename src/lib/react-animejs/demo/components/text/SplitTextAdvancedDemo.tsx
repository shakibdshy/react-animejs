/**
 * SplitTextAdvancedDemo - Demonstrates advanced text splitting mimicking
 * the official Anime.js v4 documentation example.
 *
 * Uses createTimeline with stagger for clean, developer-friendly API.
 */

import React, { useRef, useEffect, useCallback } from "react";
import { SplitText } from "../../../components";
import type { SplitTextRef } from "../../../components";
import type { TextSplitter } from "animejs";
import { createTimeline, stagger } from "../../../index";
import { DemoCard } from "../DemoCard";

export const SplitTextAdvancedDemo: React.FC = () => {
  const splitRef = useRef<SplitTextRef>(null);
  const timelineRef = useRef<any>(null);

  const setupAnimation = useCallback((split: TextSplitter) => {
    if (!split) return;

    if (timelineRef.current) {
      timelineRef.current.revert();
    }

    timelineRef.current = createTimeline({
      loop: true,
      defaults: { ease: "inOut(3)", duration: 650 },
    })
      .add(
        split.words as any,
        {
          y: [
            ($el: HTMLElement) =>
              Number($el.dataset.line) % 2 ? "100%" : "-100%",
            "0%",
          ],
        } as any,
        stagger(125),
      )
      .add(
        split.chars as any,
        {
          y: ($el: HTMLElement) =>
            Number($el.dataset.line) % 2 ? "100%" : "-100%",
        } as any,
        stagger(10, { from: "random" }),
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
      title="advanced timeline"
      description="Official Anime.js v4 text splitter capabilities reproduced using react-animejs."
    >
      <div className="flex flex-col gap-6 w-full">
        <div className="bg-[#1a1a24]/50 rounded-2xl p-8 border border-white/5 min-h-30 flex items-center justify-center overflow-hidden">
          <SplitText
            ref={splitRef}
            params={{
              words: { wrap: "clip" },
              chars: true,
            }}
            onReady={setupAnimation}
          >
            <p className="text-3xl md:text-xl font-black text-white text-center leading-tight">
              All-in-one text splitter
              <br />
              テキストスプリッター
            </p>
          </SplitText>
        </div>

        <div className="text-[10px] text-slate-500 space-y-1 opacity-60 font-medium">
          <p>• Uses dataset.line for alternating y-axis animations</p>
          <p>• Combines sequential timeline staggering</p>
          <p>• Loops infinitely</p>
        </div>
      </div>
    </DemoCard>
  );
};

export default SplitTextAdvancedDemo;
