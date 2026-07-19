/**
 * TimelineEntryDeclarativeDemo - Demonstrates declarative timeline entries
 * 
 * Shows how to use <TimelineEntry> component to define animations
 * without imperative code or separate imports.
 */

import React, { useRef, useState } from "react";
import { AnimeTimeline, SplitText } from "@/lib/react-animejs/components";
import { TimelineEntry } from "@/demo-examples/components/common/TimelineEntry";
import type { AnimeTimelineRef, SplitTextRef } from "@/lib/react-animejs/components";
import type { TextSplitter } from "animejs";
import { stagger } from "@/lib/react-animejs";
import { DemoCard } from "./DemoCard";

export const TimelineEntryDeclarativeDemo: React.FC = () => {
  const timelineRef = useRef<AnimeTimelineRef>(null);
  const splitRef = useRef<SplitTextRef>(null);
  const [splitMode, setSplitMode] = useState<"chars" | "words" | "lines">("chars");

  const handleSplitReady = (split: TextSplitter) => {
    if (!timelineRef.current) return;
    
    const elements =
      splitMode === "chars"
        ? split.chars
        : splitMode === "words"
          ? split.words
          : split.lines;

    if (elements.length === 0) return;

    const timeline = timelineRef.current.getTimeline();
    if (!timeline) return;

    timeline.add(
      elements as any,
      {
        opacity: [0, 1],
        translateY: [20, 0],
      } as any,
      stagger(30) as any,
    );

    timelineRef.current.controls.init();
  };

  return (
    <DemoCard
      title="Declarative Timeline Entries"
      description="Use <TimelineEntry> component to define animations without imperative code."
    >
      <div className="flex flex-col gap-6 w-full">
        {/* Example 1: Pure declarative entries */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white">Example 1: Pure Declarative</h3>
          <AnimeTimeline
            loop
            autoplay
            defaults={{ ease: "outExpo", duration: 800 }}
          >
            <div className="flex gap-4 items-center h-20">
              <TimelineEntry
                targets=".box-1"
                translateX={[0, 100]}
                position={0}
              >
                <div className="box-1 w-12 h-12 bg-blue-500 rounded-lg" />
              </TimelineEntry>
              <TimelineEntry
                targets=".box-2"
                translateX={[0, 100]}
                position="+=200"
              >
                <div className="box-2 w-12 h-12 bg-green-500 rounded-lg" />
              </TimelineEntry>
              <TimelineEntry
                targets=".box-3"
                translateX={[0, 100]}
                position="+=200"
              >
                <div className="box-3 w-12 h-12 bg-purple-500 rounded-lg" />
              </TimelineEntry>
            </div>
          </AnimeTimeline>
        </div>

        {/* Example 2: With SplitText integration */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white">Example 2: SplitText Integration</h3>
          <div className="flex flex-wrap gap-2">
            {(["chars", "words", "lines"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setSplitMode(mode)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tighter transition-all ${
                  splitMode === mode
                    ? "bg-demo-accent text-demo-bg"
                    : "bg-demo-card text-demo-text-secondary hover:text-white"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="bg-demo-card/50 rounded-2xl p-8 border border-white/5 min-h-30 flex items-center justify-center">
            <AnimeTimeline
              key={splitMode}
              ref={timelineRef}
              loop
              defaults={{ ease: "outExpo", duration: 600 }}
            >
              <SplitText
                ref={splitRef}
                params={
                  splitMode === "chars"
                    ? { lines: false, words: false, chars: true }
                    : splitMode === "words"
                      ? { lines: false, words: true, chars: false }
                      : { lines: true, words: false, chars: false }
                }
                onReady={handleSplitReady}
              >
                <p className="text-3xl md:text-4xl font-black text-white text-center leading-tight">
                  Hello World
                </p>
              </SplitText>
            </AnimeTimeline>
          </div>
        </div>

        {/* Example 3: Mixed declarative + imperative */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white">Example 3: Mixed Approach</h3>
          <AnimeTimeline
            ref={timelineRef}
            autoplay={false}
            defaults={{ ease: "outExpo", duration: 600 }}
          >
            <div className="flex gap-4 items-center h-20">
              <TimelineEntry
                targets=".mixed-box-1"
                translateX={[0, 150]}
                position={0}
              >
                <div className="mixed-box-1 w-12 h-12 bg-amber-500 rounded-lg" />
              </TimelineEntry>
              <TimelineEntry
                targets=".mixed-box-2"
                scale={[1, 1.5]}
                position="+=300"
              >
                <div className="mixed-box-2 w-12 h-12 bg-rose-500 rounded-lg" />
              </TimelineEntry>
            </div>
          </AnimeTimeline>
          
          <button
            onClick={() => timelineRef.current?.controls.play()}
            className="px-4 py-2 bg-demo-accent hover:bg-[#ffe066] text-demo-bg rounded-lg transition-all font-bold text-xs uppercase tracking-tighter"
          >
            Play Mixed Timeline
          </button>
        </div>

        <div className="text-[10px] text-demo-text-muted space-y-1 opacity-60 font-medium">
          <p>• TimelineEntry automatically registers with parent AnimeTimeline</p>
          <p>• No need for imperative timeline.add() calls</p>
          <p>• Works with SplitText for text animations</p>
          <p>• Position controls timing relative to other entries</p>
        </div>
      </div>
    </DemoCard>
  );
};

export default TimelineEntryDeclarativeDemo;
