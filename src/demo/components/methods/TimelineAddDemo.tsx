import React, { useRef } from "react";
import { useAnimeTimeline } from "@/lib/react-animejs/hooks";
import { DemoCard } from "../DemoCard";

export const TimelineAddDemo: React.FC = () => {
  const boxRef = useRef<HTMLDivElement>(null);

  const { controls, state, isPlaying } = useAnimeTimeline(
    {
      autoplay: false,
    },
    [], // Start empty
  );

  const handleAddAnimation = () => {
    controls.add({
      targets: boxRef,
      translateX: [0, 200],
      duration: 1000,
      ease: "outExpo",
    });
    controls.play();
  };

  return (
    <DemoCard
      title="timeline.add()"
      description="Adds a new animation, timer, or callback to the timeline. Starts empty and adds dynamically."
      controls={controls}
      state={state}
      isPlaying={isPlaying}
      code="controls.add({ targets: boxRef, translateX: 200 })"
    >
      <div
        ref={boxRef}
        className="w-16 h-16 bg-[#ffd11a] rounded-xl shadow-[0_0_20px_rgba(255,209,26,0.2)]"
      />

      <button
        onClick={handleAddAnimation}
        className="absolute bottom-4 right-4 px-4 py-2 bg-[#ffd11a] hover:bg-[#ffe066] text-[#12121a] rounded-lg transition-all font-bold text-xs uppercase tracking-tighter"
      >
        Add & Play
      </button>
    </DemoCard>
  );
};

export default TimelineAddDemo;
