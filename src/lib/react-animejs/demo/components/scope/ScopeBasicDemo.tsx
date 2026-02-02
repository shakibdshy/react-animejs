/**
 * ScopeBasicDemo - Basic scope usage demonstration
 *
 * Shows how to use useAnimeScope (useCreateScope) hook to create
 * a scoped animation context with automatic cleanup.
 */

import React, { useEffect, useState } from "react";
import { DemoCard } from "../DemoCard";
import { useAnimeScope } from "../../../hooks/use-anime-scope";
import { animate } from "animejs";

export const ScopeBasicDemo: React.FC = () => {
  const [count, setCount] = useState(0);
  const { ref, isReady, add, revert } = useAnimeScope();

  useEffect(() => {
    if (!isReady) return;

    add(() => {
      // All animations created here are scoped to the root element
      // CSS selectors only match elements within the scope
      animate(".scope-box", {
        translateX: [0, 100],
        rotate: [0, 360],
        duration: 1500,
        loop: true,
        alternate: true,
        ease: "inOutQuad",
      });

      // Cleanup function (optional)
      return () => {
        console.log("[ScopeBasicDemo] Scope reverted or refreshed");
      };
    });
  }, [isReady, add]);

  const handleRevert = () => {
    revert();
    setCount((c) => c + 1);
  };

  return (
    <DemoCard
      title="basic scope"
      description="Create a scoped animation context with automatic cleanup. Only elements within the scope root are animated."
      controls={{
        restart: handleRevert,
      }}
      code={`useAnimeScope() + add(() => animate('.box', {...}))`}
    >
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="w-full flex flex-col items-center gap-6"
        key={count}
      >
        <div className="flex gap-4 items-center">
          <div className="scope-box w-12 h-12 rounded-xl bg-linear-to-br from-[#ffd11a] to-[#ff8c00] shadow-lg shadow-[#ffd11a]/30" />
          <div className="scope-box w-10 h-10 rounded-xl bg-linear-to-br from-[#ff6b6b] to-[#ee5a5a] shadow-lg shadow-[#ff6b6b]/30" />
          <div className="scope-box w-8 h-8 rounded-xl bg-linear-to-br from-[#4ecdc4] to-[#44a08d] shadow-lg shadow-[#4ecdc4]/30" />
        </div>
        <div className="text-xs text-slate-500 flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${isReady ? "bg-green-500" : "bg-red-500"}`}
          />
          Scope {isReady ? "ready" : "initializing"}
        </div>
      </div>
    </DemoCard>
  );
};

export default ScopeBasicDemo;
