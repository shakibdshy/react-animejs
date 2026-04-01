/**
 * SplitTextEffectsDemo - Demonstrates text splitting with different effects
 * Using createTimeline with stagger for continuous loop animations.
 */

import React, { useRef, useEffect, useState, useCallback } from "react";
import { SplitText } from "../../../components";
import type { SplitTextRef } from "../../../components";
import type { TextSplitter } from "animejs";
import { createTimeline, stagger } from "../../../index";
import { DemoCard } from "../DemoCard";

export const SplitTextEffectsDemo: React.FC = () => {
  const [effectType, setEffectType] = useState<
    "fadeUp" | "wave" | "scale" | "rotate"
  >("fadeUp");
  const splitRef = useRef<SplitTextRef>(null);
  const timelineRef = useRef<any>(null);

  const effectDescriptions = {
    fadeUp: "Fade up with stagger",
    wave: "Wave effect from left to right",
    scale: "Scale in with bounce",
    rotate: "Rotate in character by character",
  };

  const setupAnimation = useCallback((split: TextSplitter) => {
    if (!split) return;

    if (timelineRef.current) {
      timelineRef.current.revert();
    }

    const targets = split.chars.length > 0 ? split.chars : split.words;
    if (targets.length === 0) return;

    let animationProps: Record<string, unknown>;
    let staggerValue = 30;

    if (effectType === "fadeUp") {
      animationProps = {
        opacity: [0, 1],
        translateY: [40, 0],
      };
      staggerValue = 30;
    } else if (effectType === "wave") {
      animationProps = {
        opacity: [0, 1],
        translateY: [0, -30, 0],
        rotate: [-5, 5, 0],
      };
      staggerValue = 50;
    } else if (effectType === "scale") {
      animationProps = {
        opacity: [0, 1],
        scale: [0, 1],
      };
      staggerValue = 20;
    } else {
      animationProps = {
        opacity: [0, 1],
        rotateY: [-90, 0],
      };
      staggerValue = 40;
    }

    timelineRef.current = createTimeline({
      loop: true,
      defaults: {
        ease: effectType === "wave" ? "outElastic(1, .3)" : effectType === "scale" ? "outBack" : "outExpo",
        duration: effectType === "scale" ? 400 : effectType === "wave" ? 600 : 800,
      },
    })
      .add(
        targets as any,
        animationProps as any,
        stagger(staggerValue),
      );

    timelineRef.current.init();
  }, [effectType]);

  useEffect(() => {
    return () => {
      if (timelineRef.current) {
        timelineRef.current.revert();
      }
    };
  }, []);

  return (
    <DemoCard
      title="split effects"
      description="Different animation effects on split text elements with continuous loops."
    >
      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-wrap gap-2">
          {(["fadeUp", "wave", "scale", "rotate"] as const).map((effect) => (
            <button
              key={effect}
              onClick={() => {
                setEffectType(effect);
              }}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tighter transition-all ${
                effectType === effect
                  ? "bg-[#ffd11a] text-[#12121a]"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {effect}
            </button>
          ))}
        </div>

        <div className="bg-[#1a1a24]/50 rounded-2xl p-8 border border-white/5 min-h-30 flex items-center justify-center overflow-hidden">
          <SplitText
            key={effectType}
            ref={splitRef}
            params={{ lines: true, words: true, chars: true }}
            onReady={setupAnimation}
          >
            <p className="text-3xl md:text-4xl font-black text-white text-center leading-tight">
              Anime.js
            </p>
          </SplitText>
        </div>

        <div className="text-[10px] text-slate-500 space-y-1 opacity-60 font-medium">
          <p>• Effect: {effectDescriptions[effectType]}</p>
          <p>• Continuous loop animation</p>
        </div>
      </div>
    </DemoCard>
  );
};

export default SplitTextEffectsDemo;
