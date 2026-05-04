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
import { DemoSection } from "../DemoSection";
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

  const { ref, isReady, add, revert, refresh } = useAnimeScope({
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
      } catch (e) {
        // Ignore revert errors
      }
      draggableInstanceRef.current = null;
    }

    // Revert animation if exists
    if (animationInstanceRef.current) {
      try {
        animationInstanceRef.current.revert?.();
      } catch (e) {
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

    add((self: any) => {
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

  // Handle revert button
  const handleRevert = useCallback(() => {
    cleanupInstances();
    revert();
  }, [revert, cleanupInstances]);

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
    <DemoSection title="Scope: Constructor Function">
      <div className="w-full bg-[#1a1a24] rounded-3xl p-6 border border-[#2a2a3a] shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h4 className="text-[#ffd11a] font-bold text-xl tracking-tight">
              Constructor Function + Defaults
            </h4>
            <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-wider">
              Uses scope constructor with conditional logic based on container width
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-[#ffd11a] transition-all"
              title="Refresh Scope"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Resizable container */}
        <div ref={containerRef} className="relative w-full flex items-center mb-6">
          <div
            ref={ref as React.RefObject<HTMLDivElement>}
            style={{ width: iframeWidth }}
            className="relative bg-[#0f0f13] rounded-xl border-2 border-[#2a2a3a] transition-colors duration-200 overflow-hidden"
          >
            {/* Content area */}
            <div className="relative min-h-35 flex items-center justify-center p-4">
              <div
                ref={squareRef}
                className="constructor-square w-12 h-12 rounded-lg bg-linear-to-br from-[#ffd11a] to-[#ff8c00] shadow-lg shadow-[#ffd11a]/30"
                style={{
                  cursor: mode === "draggable" ? "grab" : "default",
                }}
              >
                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-[#1a1a24]">
                  {mode === "animate" ? "🔄" : "👆"}
                </div>
              </div>
            </div>

            {/* Resize handle */}
            <div
              onMouseDown={handleMouseDown}
              className={`absolute right-0 top-0 bottom-0 w-6 flex items-center justify-center cursor-ew-resize transition-colors ${
                isDraggingResize ? "bg-[#ffd11a]/20" : "hover:bg-[#ffd11a]/10"
              }`}
            >
              <GripVertical className="w-4 h-4 text-[#ffd11a]/60" />
            </div>

            {/* Labels */}
            <div className="absolute bottom-2 right-8 text-[10px] text-[#ffd11a]/60 font-mono whitespace-nowrap">
              resize container »
            </div>
            <div className="absolute top-2 right-8 text-[10px] text-[#ffd11a]/80 font-mono">
              {Math.round(iframeWidth)}px
            </div>
          </div>
        </div>

        {/* Status indicators */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">Viewport:</span>
            <span
              className={`font-mono text-xs ${
                isSmall ? "text-[#ffd11a]" : "text-green-400"
              }`}
            >
              {isSmall ? `Small (≤${SMALL_THRESHOLD}px)` : `Normal (>${SMALL_THRESHOLD}px)`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">Mode:</span>
            <span className="font-mono text-xs text-slate-300">
              {mode === "animate" ? "Animation only 🔄" : "Draggable 👆"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">Defaults:</span>
            <span className="font-mono text-xs text-slate-400">ease=linear, duration=2000ms</span>
          </div>
        </div>

        {/* Debug info */}
        <div className="p-3 rounded-xl bg-black/40 border border-[#2a2a3a]">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full shadow-[0_0_8px] ${
                isReady ? "bg-green-500 shadow-green-500/50" : "bg-red-500 shadow-transparent"
              }`}
            />
            <span className="text-[10px] font-mono text-slate-400">{debugInfo}</span>
          </div>
        </div>

        {/* Code example */}
        <div className="mt-4 p-4 rounded-xl bg-[#0a0a0f] border border-[#2a2a3a] overflow-x-auto">
          <pre className="text-[10px] font-mono text-slate-400 leading-relaxed">
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
      </div>
    </DemoSection>
  );
};

export default ScopeConstructorDemo;
