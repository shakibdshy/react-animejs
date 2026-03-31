/**
 * ScopePropertiesDemo - Scope properties demonstration
 *
 * Shows how to access scope properties (root, matches, methods) using
 * the AnimeScope component with ref.
 *
 * Note: The animate callback receives context with:
 * - ctx.matches - media query states
 * - ctx.root - the root element
 * - ctx.add(name, fn) - to register NAMED METHODS (not constructors)
 * - ctx.animate - anime.js animate function
 * - ctx.utils - anime.js utils
 *
 * @see https://animejs.com/documentation/scope/scope-properties
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import { DemoCard } from "../DemoCard";
import { AnimeScope } from "../../../components/AnimeScope";
import type { AnimeScopeRef } from "../../../components/AnimeScope";
import { animate } from "animejs";
import { Info } from "lucide-react";

export const ScopePropertiesDemo: React.FC = () => {
  const [scopeInfo, setScopeInfo] = useState<{
    rootTag: string;
    matchesCount: number;
    methodsCount: number;
  } | null>(null);
  
  const scopeRef = useRef<AnimeScopeRef>(null);
  const [matches, setMatches] = useState<Record<string, boolean>>({});
  const [methods, setMethods] = useState<Record<string, () => void>>({});

  // Track matches and methods from the ref
  useEffect(() => {
    const interval = setInterval(() => {
      if (scopeRef.current) {
        // Update matches from ref
        setMatches({ ...scopeRef.current.matches });
        
        // Update methods from ref
        setMethods({ ...scopeRef.current.methods });
        
        // Update scope info when scope is available
        if (scopeRef.current.scope) {
          setScopeInfo({
            rootTag: scopeRef.current.scope.root instanceof Document 
              ? "Document" 
              : scopeRef.current.scope.root.tagName,
            matchesCount: Object.keys(scopeRef.current.matches).length,
            methodsCount: Object.keys(scopeRef.current.scope.methods).length,
          });
        }
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleRevert = useCallback(() => {
    scopeRef.current?.revert();
    setScopeInfo(null);
    setMatches({});
    setMethods({});
  }, []);

  return (
    <DemoCard
      title="scope properties (Component)"
      description="Access scope properties via ref: root, matches, and methods. These provide context about the scope state."
      controls={{
        restart: handleRevert,
      }}
      code={`// Access scope properties via ref
const scopeRef = useRef<AnimeScopeRef>(null);

<AnimeScope ref={scopeRef} animate={(ctx) => {
  // ctx.add(name, fn) - register named methods
  ctx.add("spin", () => { ... });
}}>
  {children}
</AnimeScope>

// Use scopeRef.current to access:
// - scopeRef.current.scope    // The Anime.js scope instance
// - scopeRef.current.matches // Media query states
// - scopeRef.current.methods // Registered methods`}
    >
      <div className="w-full flex flex-col items-center gap-6">
        {/* AnimeScope component with ref */}
        <AnimeScope
          ref={scopeRef}
          mediaQueries={{
            isSmall: "(max-width: 400px)",
            isMedium: "(min-width: 401px) and (max-width: 600px)",
            isLarge: "(min-width: 601px)",
            reduceMotion: "(prefers-reduced-motion)",
          }}
          animate={(ctx) => {
            // Use ctx.add(name, fn) to register NAMED METHODS
            // This is different from scope.add(constructor)!
            ctx.add("spin", () => {
              animate(".props-box", {
                rotate: "+=360",
                duration: 600,
                ease: "outExpo",
              });
            });

            ctx.add("pulse", () => {
              animate(".props-box", {
                scale: [1, 1.3, 1],
                duration: 400,
                ease: "outElastic(1, 0.5)",
              });
            });

            // Animate the box
            animate(".props-box", {
              translateX: [0, 80],
              rotate: [0, 15],
              duration: 1500,
              loop: true,
              alternate: true,
              ease: "inOutQuad",
            });

            return () => {
              console.log("[ScopePropertiesDemo] Cleanup");
            };
          }}
        >
          {/* Animated element */}
          <div className="props-box w-14 h-14 rounded-xl bg-linear-to-br from-[#ffd11a] to-[#ff8c00] shadow-lg shadow-[#ffd11a]/30 flex items-center justify-center">
            <Info className="w-6 h-6 text-[#1a1a24]" />
          </div>
        </AnimeScope>

        {/* Properties display */}
        <div className="w-full max-w-md space-y-3">
          {/* root property */}
          <div className="p-3 rounded-lg bg-[#1a1a24] border border-[#2a2a3a]">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">scope.root</span>
              <span className="text-xs text-[#ffd11a] font-mono">
                {scopeInfo?.rootTag || "null"}
              </span>
            </div>
            <div className="text-[10px] text-slate-600 mt-1">
              The root element where CSS selectors are scoped
            </div>
          </div>

          {/* matches property */}
          <div className="p-3 rounded-lg bg-[#1a1a24] border border-[#2a2a3a]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-mono">scope.matches</span>
              <span className="text-xs text-cyan-400 font-mono">
                {scopeInfo?.matchesCount || 0} queries
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(matches).map(([key, value]) => (
                <div
                  key={key}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                    value
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-slate-700 text-slate-400"
                  }`}
                >
                  {key}: {value ? "true" : "false"}
                </div>
              ))}
            </div>
          </div>

          {/* methods property */}
          <div className="p-3 rounded-lg bg-[#1a1a24] border border-[#2a2a3a]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-mono">scope.methods</span>
              <span className="text-xs text-violet-400 font-mono">
                {scopeInfo?.methodsCount || 0} methods
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.keys(methods).length > 0 ? (
                Object.keys(methods).map((name) => (
                  <button
                    key={name}
                    onClick={() => methods[name]?.()}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-violet-500/20 text-violet-400 border border-violet-500/30 hover:bg-violet-500/30 transition-colors"
                  >
                    {name}()
                  </button>
                ))
              ) : (
                <span className="text-[10px] text-slate-600">No methods registered</span>
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="text-[10px] text-slate-500 text-center max-w-sm">
          These properties are accessible from the scope ref. Click the method buttons to call registered methods.
        </div>
      </div>
    </DemoCard>
  );
};

export default ScopePropertiesDemo;
