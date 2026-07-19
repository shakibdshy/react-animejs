/**
 * ScopeConstructorDemo - Advanced scope constructor demonstration
 *
 * This demo shows how to use the scope constructor function pattern
 * similar to the vanilla Anime.js documentation:
 * - Using mediaQueries for responsive behavior
 * - Using defaults for shared parameters
 * - Using self.matches for media query states
 * - Conditional animation/draggable creation
 * - Cleanup function when scope reverts
 *
 * Note: In the vanilla JS example, media queries work on iframe viewport.
 * Here we simulate the same behavior by tracking container width manually.
 *
 * @see https://animejs.com/documentation/scope/add-constructor-function
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import { DemoCard } from "../DemoCard";
import { useAnimeScope } from "@/lib/react-animejs/hooks/use-anime-scope";
import { animate, createDraggable } from "animejs";
import { GripVertical, RotateCcw } from "lucide-react";

// Threshold for "small" viewport (in pixels)
const SMALL_THRESHOLD = 200;

export const ScopeConstructorDemo: React.FC = () => {
  const [iframeWidth, setIframeWidth] = useState(300);
  const [isDraggingResize, setIsDraggingResize] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>("Initializing...");
  const [mode, setMode] = useState<"draggable" | "animate">("draggable");
  const containerRef = useRef<HTMLDivElement>(null);
  const squareRef = useRef<HTMLDivElement>(null);
  const draggableInstanceRef = useRef<any>(null);
  const animationInstanceRef = useRef<any>(null);

  // Track if container is "small" based on width
  const isSmall = iframeWidth <= SMALL_THRESHOLD;

  const { ref, isReady, add, refresh } = useAnimeScope({
    defaults: {
      ease: "linear",
      duration: 2000,
    },
  });

  // Cleanup function for draggable and animation
  const cleanupInstances = useCallback(() => {
    // Revert draggable if exists
    if (draggableInstanceRef.current) {
      try {
        draggableInstanceRef.current.revert?.();
      } catch {
        // Ignore revert errors
      }
      draggableInstanceRef.current = null;
    }

    // Revert animation if exists
    if (animationInstanceRef.current) {
      try {
        animationInstanceRef.current.revert?.();
      } catch {
        // Ignore revert errors
      }
      animationInstanceRef.current = null;
    }
  }, []);

  // Setup animations/draggable based on mode
  useEffect(() => {
    if (!isReady || !ref.current) return;

    const square = squareRef.current;
    const root = ref.current;

    if (!square || !root) {
      setDebugInfo("Error: Elements not found");
      return;
    }

    // Cleanup previous instances first
    cleanupInstances();

    // Reset styles
    square.style.transform = "";
    square.classList.remove("draggable", "animate-only");

    add((_self: any) => {
      // Conditional behavior based on container width
      if (isSmall) {
        // Small viewport: Animate only (no draggable)
        setMode("animate");
        square.classList.add("animate-only");

        animationInstanceRef.current = animate(square, {
          rotate: 360,
          loop: true,
          duration: 2000,
          ease: "linear",
        });

        setDebugInfo(`Animation mode | width: ${Math.round(root.offsetWidth)}px`);
      } else {
        // Large viewport: Create draggable
        setMode("draggable");
        square.classList.add("draggable");

        try {
          draggableInstanceRef.current = createDraggable(square, {
            container: root,
            releaseStiffness: 100,
            releaseDamping: 20,
          });
          setDebugInfo(`Draggable mode | width: ${Math.round(root.offsetWidth)}px`);
        } catch (e) {
          console.warn("Draggable creation failed:", e);
          setDebugInfo(`Draggable failed: ${e}`);
        }
      }

      // Cleanup function - runs when scope reverts or refreshes
      return () => {
        cleanupInstances();
        if (square) {
          square.classList.remove("draggable", "animate-only");
          square.style.transform = "";
        }
        setDebugInfo("Scope reverted - cleanup executed");
      };
    });
  }, [isReady, add, ref, isSmall, cleanupInstances]);

  // Handle refresh (re-run constructor)
  const handleRefresh = useCallback(() => {
    cleanupInstances();
    refresh();
  }, [refresh, cleanupInstances]);

  // Drag resize logic (UI concern - for demo purposes)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingResize(true);
  }, []);

  useEffect(() => {
    if (!isDraggingResize) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = e.clientX - containerRect.left;
      const clampedWidth = Math.max(100, Math.min(newWidth, containerRect.width - 40));
      setIframeWidth(clampedWidth);
    };
    const handleMouseUp = () => setIsDraggingResize(false);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingResize]);

  return (
    <DemoCard
      title="constructor function + defaults"
      description="Uses scope construction with conditional behavior based on container width."
      code={`const { add } = useAnimeScope({
  defaults: { ease: 'linear', duration: 2000 },
});

add((scope) => {
  if (scope.matches.isSmall) animate(element, { rotate: 360 });
  return () => element.classList.remove('draggable');
});`}
      actions={
        <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              className="p-2 hover:bg-white/5 rounded-full text-demo-text-secondary hover:text-demo-accent transition-all"
              title="Refresh Scope"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
        </div>
      }
    >

        {/* Resizable container */}
        <div ref={containerRef} className="relative w-full flex items-center mb-6">
          <div
            ref={ref as React.RefObject<HTMLDivElement>}
            style={{ width: iframeWidth }}
            className="relative bg-demo-bg rounded-xl border-2 border-demo-border transition-colors duration-200 overflow-hidden"
          >
            {/* Content area */}
            <div className="relative min-h-35 flex items-center justify-center p-4">
              <div
                ref={squareRef}
                className="constructor-square w-12 h-12 rounded-lg bg-linear-to-br from-demo-accent to-[#ff8c00] shadow-lg shadow-demo-accent/30"
                style={{
                  cursor: mode === "draggable" ? "grab" : "default",
                }}
              >
                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-demo-card">
                  {mode === "animate" ? "🔄" : "👆"}
                </div>
              </div>
            </div>

            {/* Resize handle */}
            <div
              onMouseDown={handleMouseDown}
              className={`absolute right-0 top-0 bottom-0 w-6 flex items-center justify-center cursor-ew-resize transition-colors ${
                isDraggingResize ? "bg-demo-accent/20" : "hover:bg-demo-accent/10"
              }`}
            >
              <GripVertical className="w-4 h-4 text-demo-accent/60" />
            </div>

            {/* Labels */}
            <div className="absolute bottom-2 right-8 text-[10px] text-demo-accent/60 font-mono whitespace-nowrap">
              resize container »
            </div>
            <div className="absolute top-2 right-8 text-[10px] text-demo-accent/80 font-mono">
              {Math.round(iframeWidth)}px
            </div>
          </div>
        </div>

        {/* Status indicators */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-demo-text-muted uppercase tracking-widest">Viewport:</span>
            <span
              className={`font-mono text-xs ${
                isSmall ? "text-demo-accent" : "text-green-400"
              }`}
            >
              {isSmall ? `Small (≤${SMALL_THRESHOLD}px)` : `Normal (>${SMALL_THRESHOLD}px)`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-demo-text-muted uppercase tracking-widest">Mode:</span>
            <span className="font-mono text-xs text-slate-300">
              {mode === "animate" ? "Animation only 🔄" : "Draggable 👆"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-demo-text-muted uppercase tracking-widest">Defaults:</span>
            <span className="font-mono text-xs text-demo-text-secondary">ease=linear, duration=2000ms</span>
          </div>
        </div>

        {/* Debug info */}
        <div className="p-3 rounded-xl bg-black/40 border border-demo-border">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full shadow-[0_0_8px] ${
                isReady ? "bg-green-500 shadow-green-500/50" : "bg-red-500 shadow-transparent"
              }`}
            />
            <span className="text-[10px] font-mono text-demo-text-secondary">{debugInfo}</span>
          </div>
        </div>

        {/* Code example */}
        <div className="mt-4 p-4 rounded-xl bg-demo-bg border border-demo-border overflow-x-auto">
          <pre className="text-[10px] font-mono text-demo-text-secondary leading-relaxed">
            {`// Similar to vanilla JS pattern:
createScope({
  mediaQueries: { isSmall: '(max-width: 200px)' },
  defaults: { ease: 'linear', duration: 2000 },
})
.add((self) => {
  const { isSmall } = self.matches;
  
  if (isSmall) {
    // Small viewport: Animate only
    animate(element, { rotate: 360, loop: true });
  } else {
    // Large viewport: Create draggable
    createDraggable(element, { container: root });
  }
  
  // Cleanup on scope revert
  return () => {
    element.classList.remove('draggable');
  };
});`}
          </pre>
        </div>
    </DemoCard>
  );
};

export default ScopeConstructorDemo;
