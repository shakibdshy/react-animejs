/**
 * ScopeRootDemo - Root parameter demonstration
 *
 * Shows how to use the root parameter to scope CSS selectors
 * to a specific container element.
 *
 * @see https://animejs.com/documentation/scope/scope-parameters/root
 */

import React, { useEffect, useRef, useState } from "react";
import { DemoCard } from "../DemoCard";
import { useAnimeScope } from "@shakibdshy/react-animejs";
import { animate } from "animejs";

export const ScopeRootDemo: React.FC = () => {
  const [key, setKey] = useState(0);
  const outerRef = useRef<HTMLDivElement>(null);

  // Create scope with the inner container as root
  const { ref, isReady, add, revert } = useAnimeScope();

  useEffect(() => {
    if (!isReady) return;

    add(() => {
      // This animation only targets .scoped-box inside the scope root
      // The .scoped-box outside the scope is NOT affected
      animate(".scoped-box", {
        translateX: [0, 80],
        rotate: [0, 360],
        duration: 1500,
        loop: true,
        alternate: true,
        ease: "inOutQuad",
      });

    });
  }, [isReady, add]);

  const handleRestart = () => {
    revert();
    setKey((k) => k + 1);
  };

  return (
    <DemoCard
      title="root parameter"
      description="CSS selectors are scoped to the root element. Elements outside the scope are not affected."
      controls={{
        restart: handleRestart,
      }}
      code={`useAnimeScope() // ref defines the scope root
animate('.scoped-box', {...}) // Only matches inside scope`}
    >
      <div className="w-full flex flex-col gap-4">
        {/* Outer container - NOT in scope */}
        <div
          ref={outerRef}
          className="w-full p-4 rounded-xl bg-demo-card border border-demo-border"
        >
          <div className="text-[10px] text-demo-text-muted uppercase tracking-wider mb-3">
            Outside Scope (not animated)
          </div>
          <div className="flex gap-3">
            <div className="scoped-box w-8 h-8 rounded-lg bg-slate-600 opacity-50" />
            <div className="scoped-box w-8 h-8 rounded-lg bg-slate-600 opacity-50" />
            <div className="scoped-box w-8 h-8 rounded-lg bg-slate-600 opacity-50" />
          </div>
        </div>

        {/* Inner container - IN scope */}
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          key={key}
          className="w-full p-4 rounded-xl bg-[#0d3d38] border-2 border-[#2dd4bf]"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] text-[#2dd4bf] uppercase tracking-wider">
              Inside Scope (animated)
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                isReady ? "bg-green-500" : "bg-red-500"
              }`}
            />
          </div>
          <div className="flex gap-3">
            <div className="scoped-box w-10 h-10 rounded-lg bg-[#2dd4bf] shadow-lg shadow-[#2dd4bf]/30" />
            <div className="scoped-box w-10 h-10 rounded-lg bg-[#2dd4bf] shadow-lg shadow-[#2dd4bf]/30" />
            <div className="scoped-box w-10 h-10 rounded-lg bg-[#2dd4bf] shadow-lg shadow-[#2dd4bf]/30" />
          </div>
        </div>

        {/* Explanation */}
        <div className="text-[11px] text-demo-text-muted text-center">
          The same CSS selector <code className="text-demo-accent">.scoped-box</code>{" "}
          is used in both containers, but only elements inside the scope root are
          animated.
        </div>
      </div>
    </DemoCard>
  );
};

export default ScopeRootDemo;
