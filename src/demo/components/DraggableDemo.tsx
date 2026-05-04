import { useRef, useState } from "react";
import { DemoSection } from "./DemoSection";
import { useAnimeDraggable } from "@/lib/react-animejs";

// =============================================================================
// Basic Draggable Demo
// =============================================================================

function BasicDraggable() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, isDragging, isGrabbed, position, progress, velocity } =
    useAnimeDraggable<HTMLDivElement>({
      container: containerRef.current ?? undefined,
      containerPadding: 16,
      releaseStiffness: 120,
      releaseDamping: 20,
    });

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-300">Basic Draggable</h4>
      <div
        ref={containerRef}
        className="w-full h-48 bg-[#050508] border border-[#2a2a3a] border-dashed rounded-xl flex items-center justify-center relative overflow-hidden"
      >
        <div
          ref={ref}
          className={`w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-white text-center p-2 cursor-grab active:cursor-grabbing bg-linear-to-br from-cyan-500 to-blue-600 shadow-lg select-none transition-shadow ${isDragging ? "shadow-2xl brightness-110" : ""}`}
        >
          👆 Drag
        </div>
      </div>
      <div className="px-4 py-2 bg-[#050508] border border-[#2a2a3a] rounded-lg font-mono text-[10px] text-[#888] grid grid-cols-2 gap-2">
        <div>
          Position: ({Math.round(position.x)}, {Math.round(position.y)})
        </div>
        <div>
          Progress: ({progress.x.toFixed(2)}, {progress.y.toFixed(2)})
        </div>
        <div>
          Velocity: ({velocity.x.toFixed(1)}, {velocity.y.toFixed(1)})
        </div>
        <div className="flex gap-2">
          {isGrabbed && (
            <span className="text-yellow-400 animate-pulse">🫳 GRABBED</span>
          )}
          {isDragging && (
            <span className="text-blue-400 animate-bounce">DRAGGING</span>
          )}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Trigger Demo (Handle)
// =============================================================================

function TriggerDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, isDragging, position } = useAnimeDraggable<HTMLDivElement>({
    container: containerRef.current ?? undefined,
    containerPadding: 8,
    trigger: ".drag-handle", // Only drag from the handle
    releaseStiffness: 100,
    releaseDamping: 18,
  });

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-300">
        Trigger (Drag Handle)
      </h4>
      <p className="text-xs text-gray-500">
        Only the ≡ handle area is draggable
      </p>
      <div
        ref={containerRef}
        className="w-full h-40 bg-[#050508] border border-[#2a2a3a] border-dashed rounded-xl flex items-center justify-center relative overflow-hidden"
      >
        <div
          ref={ref}
          className={`w-48 bg-[#1a1a2e] border border-[#2a2a3a] rounded-xl shadow-lg select-none ${isDragging ? "shadow-2xl" : ""}`}
        >
          {/* Drag Handle */}
          <div className="drag-handle bg-[#2a2a3a] rounded-t-xl px-3 py-2 cursor-grab active:cursor-grabbing flex items-center gap-2 hover:bg-[#3a3a4a] transition-colors">
            <span className="text-gray-400 text-lg">≡</span>
            <span className="text-xs text-gray-400">Drag here</span>
          </div>
          {/* Content - Not draggable */}
          <div className="p-3 cursor-default">
            <p className="text-xs text-gray-300">Card Content</p>
            <p className="text-[10px] text-gray-500 mt-1">
              Click here - no drag
            </p>
          </div>
        </div>
      </div>
      <div className="px-4 py-2 bg-[#050508] border border-[#2a2a3a] rounded-lg font-mono text-[10px] text-[#888]">
        Position: ({Math.round(position.x)}, {Math.round(position.y)})
      </div>
    </div>
  );
}

// =============================================================================
// Axis Constrained Demo
// =============================================================================

function AxisConstrainedDraggable() {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    ref: xRef,
    position: xPos,
    isDragging: xDragging,
  } = useAnimeDraggable<HTMLDivElement>({
    container: containerRef.current ?? undefined,
    containerPadding: 8,
    y: false,
    releaseStiffness: 100,
    releaseDamping: 15,
  });

  const {
    ref: yRef,
    position: yPos,
    isDragging: yDragging,
  } = useAnimeDraggable<HTMLDivElement>({
    container: containerRef.current ?? undefined,
    containerPadding: 8,
    x: false,
    releaseStiffness: 100,
    releaseDamping: 15,
  });

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-300">
        Axis Constraints (x: false / y: false)
      </h4>
      <div
        ref={containerRef}
        className="w-full h-48 bg-[#050508] border border-[#2a2a3a] border-dashed rounded-xl flex items-center justify-center gap-8 relative overflow-hidden"
      >
        <div
          ref={xRef}
          className={`w-16 h-16 rounded-xl flex items-center justify-center font-bold text-white text-sm cursor-grab active:cursor-grabbing bg-linear-to-br from-purple-500 to-pink-600 shadow-lg select-none ${xDragging ? "shadow-2xl brightness-110" : ""}`}
        >
          ↔ X
        </div>
        <div
          ref={yRef}
          className={`w-16 h-16 rounded-xl flex items-center justify-center font-bold text-white text-sm cursor-grab active:cursor-grabbing bg-linear-to-br from-green-500 to-emerald-600 shadow-lg select-none ${yDragging ? "shadow-2xl brightness-110" : ""}`}
        >
          ↕ Y
        </div>
      </div>
      <div className="px-4 py-2 bg-[#050508] border border-[#2a2a3a] rounded-lg font-mono text-[10px] text-[#888] flex gap-4">
        <span>
          X-only: ({Math.round(xPos.x)}, {Math.round(xPos.y)})
        </span>
        <span>
          Y-only: ({Math.round(yPos.x)}, {Math.round(yPos.y)})
        </span>
      </div>
    </div>
  );
}

// =============================================================================
// Container Friction Demo
// =============================================================================

function ContainerFrictionDemo() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Low friction - can go past bounds easily
  const {
    ref: lowRef,
    position: lowPos,
    isDragging: lowDrag,
  } = useAnimeDraggable<HTMLDivElement>({
    container: containerRef.current ?? undefined,
    containerPadding: 8,
    containerFriction: 0.95, // Almost no resistance
    releaseContainerFriction: 0.1,
    releaseStiffness: 100,
    releaseDamping: 15,
  });

  // High friction - stops at bounds
  const {
    ref: highRef,
    position: highPos,
    isDragging: highDrag,
  } = useAnimeDraggable<HTMLDivElement>({
    container: containerRef.current ?? undefined,
    containerPadding: 8,
    containerFriction: 0.3, // High resistance
    releaseContainerFriction: 0.5,
    releaseStiffness: 100,
    releaseDamping: 15,
  });

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-300">
        Container Friction
      </h4>
      <p className="text-xs text-gray-500">
        Rubber-band effect when dragging past bounds
      </p>
      <div
        ref={containerRef}
        className="w-full h-48 bg-[#050508] border border-[#2a2a3a] border-dashed rounded-xl flex items-center justify-center gap-8 relative overflow-hidden"
      >
        <div
          ref={lowRef}
          className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center font-bold text-white text-xs cursor-grab active:cursor-grabbing bg-linear-to-br from-red-500 to-orange-600 shadow-lg select-none ${lowDrag ? "shadow-2xl brightness-110" : ""}`}
        >
          <span>0.95</span>
          <span className="text-[8px] opacity-70">Elastic</span>
        </div>
        <div
          ref={highRef}
          className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center font-bold text-white text-xs cursor-grab active:cursor-grabbing bg-linear-to-br from-blue-500 to-indigo-600 shadow-lg select-none ${highDrag ? "shadow-2xl brightness-110" : ""}`}
        >
          <span>0.3</span>
          <span className="text-[8px] opacity-70">Rigid</span>
        </div>
      </div>
      <div className="px-4 py-2 bg-[#050508] border border-[#2a2a3a] rounded-lg font-mono text-[10px] text-[#888]">
        <span className="text-red-400">
          Elastic: ({Math.round(lowPos.x)}, {Math.round(lowPos.y)})
        </span>
        <span className="mx-4">|</span>
        <span className="text-blue-400">
          Rigid: ({Math.round(highPos.x)}, {Math.round(highPos.y)})
        </span>
      </div>
    </div>
  );
}

// =============================================================================
// Spring Physics Demo
// =============================================================================

function SpringPhysicsDemo() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Bouncy (low damping, high stiffness)
  const { ref: bouncyRef, isDragging: bouncyDrag } =
    useAnimeDraggable<HTMLDivElement>({
      container: containerRef.current ?? undefined,
      containerPadding: 8,
      releaseStiffness: 200, // Very snappy
      releaseDamping: 8, // Low damping = more oscillation
      releaseMass: 1,
    });

  // Smooth (balanced)
  const { ref: smoothRef, isDragging: smoothDrag } =
    useAnimeDraggable<HTMLDivElement>({
      container: containerRef.current ?? undefined,
      containerPadding: 8,
      releaseStiffness: 100,
      releaseDamping: 20, // Balanced
      releaseMass: 1,
    });

  // Heavy (high mass, low stiffness)
  const { ref: heavyRef, isDragging: heavyDrag } =
    useAnimeDraggable<HTMLDivElement>({
      container: containerRef.current ?? undefined,
      containerPadding: 8,
      releaseStiffness: 40, // Low stiffness
      releaseDamping: 15,
      releaseMass: 3, // Heavy = more momentum
    });

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-300">
        Spring Physics (stiffness, damping, mass)
      </h4>
      <div
        ref={containerRef}
        className="w-full h-48 bg-[#050508] border border-[#2a2a3a] border-dashed rounded-xl flex items-center justify-center gap-6 relative overflow-hidden"
      >
        <div
          ref={bouncyRef}
          className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold text-white text-xs cursor-grab active:cursor-grabbing bg-linear-to-br from-yellow-400 to-orange-500 shadow-lg select-none ${bouncyDrag ? "shadow-2xl brightness-110" : ""}`}
        >
          <span>🏀</span>
          <span className="text-[8px]">Bouncy</span>
        </div>
        <div
          ref={smoothRef}
          className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold text-white text-xs cursor-grab active:cursor-grabbing bg-linear-to-br from-teal-400 to-cyan-500 shadow-lg select-none ${smoothDrag ? "shadow-2xl brightness-110" : ""}`}
        >
          <span>🧈</span>
          <span className="text-[8px]">Smooth</span>
        </div>
        <div
          ref={heavyRef}
          className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold text-white text-xs cursor-grab active:cursor-grabbing bg-linear-to-br from-slate-500 to-gray-600 shadow-lg select-none ${heavyDrag ? "shadow-2xl brightness-110" : ""}`}
        >
          <span>🪨</span>
          <span className="text-[8px]">Heavy</span>
        </div>
      </div>
      <div className="px-4 py-2 bg-[#050508] border border-[#2a2a3a] rounded-lg font-mono text-[10px] text-[#888]">
        <span className="text-yellow-400">Bouncy: stiff=200, damp=8</span>
        <span className="mx-2">|</span>
        <span className="text-cyan-400">Smooth: stiff=100, damp=20</span>
        <span className="mx-2">|</span>
        <span className="text-gray-400">Heavy: stiff=40, mass=3</span>
      </div>
    </div>
  );
}

// =============================================================================
// Velocity Settings Demo
// =============================================================================

function VelocityDemo() {
  const containerRef = useRef<HTMLDivElement>(null);

  // High velocity multiplier
  const {
    ref: fastRef,
    velocity: fastVel,
    isDragging: fastDrag,
  } = useAnimeDraggable<HTMLDivElement>({
    container: containerRef.current ?? undefined,
    containerPadding: 8,
    velocityMultiplier: 3, // 3x momentum
    releaseStiffness: 60,
    releaseDamping: 12,
  });

  // Capped velocity
  const {
    ref: cappedRef,
    velocity: cappedVel,
    isDragging: cappedDrag,
  } = useAnimeDraggable<HTMLDivElement>({
    container: containerRef.current ?? undefined,
    containerPadding: 8,
    velocityMultiplier: 1,
    maxVelocity: 200, // Cap the velocity
    releaseStiffness: 80,
    releaseDamping: 15,
  });

  // Minimum velocity threshold
  const {
    ref: threshRef,
    velocity: threshVel,
    isDragging: threshDrag,
  } = useAnimeDraggable<HTMLDivElement>({
    container: containerRef.current ?? undefined,
    containerPadding: 8,
    minVelocity: 100, // No momentum if below threshold
    releaseStiffness: 80,
    releaseDamping: 15,
  });

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-300">Velocity Settings</h4>
      <div
        ref={containerRef}
        className="w-full h-48 bg-[#050508] border border-[#2a2a3a] border-dashed rounded-xl flex items-center justify-center gap-6 relative overflow-hidden"
      >
        <div
          ref={fastRef}
          className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold text-white text-xs cursor-grab active:cursor-grabbing bg-linear-to-br from-red-500 to-pink-600 shadow-lg select-none ${fastDrag ? "shadow-2xl brightness-110" : ""}`}
        >
          <span>🚀</span>
          <span className="text-[8px]">3x Speed</span>
        </div>
        <div
          ref={cappedRef}
          className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold text-white text-xs cursor-grab active:cursor-grabbing bg-linear-to-br from-amber-500 to-yellow-600 shadow-lg select-none ${cappedDrag ? "shadow-2xl brightness-110" : ""}`}
        >
          <span>🛑</span>
          <span className="text-[8px]">Max=200</span>
        </div>
        <div
          ref={threshRef}
          className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold text-white text-xs cursor-grab active:cursor-grabbing bg-linear-to-br from-violet-500 to-purple-600 shadow-lg select-none ${threshDrag ? "shadow-2xl brightness-110" : ""}`}
        >
          <span>📏</span>
          <span className="text-[8px]">Min=100</span>
        </div>
      </div>
      <div className="px-4 py-2 bg-[#050508] border border-[#2a2a3a] rounded-lg font-mono text-[10px] text-[#888]">
        <span className="text-red-400">
          3x: v={Math.round(Math.hypot(fastVel.x, fastVel.y))}
        </span>
        <span className="mx-2">|</span>
        <span className="text-yellow-400">
          Capped: v={Math.round(Math.hypot(cappedVel.x, cappedVel.y))}
        </span>
        <span className="mx-2">|</span>
        <span className="text-purple-400">
          Thresh: v={Math.round(Math.hypot(threshVel.x, threshVel.y))}
        </span>
      </div>
    </div>
  );
}

// =============================================================================
// Drag Speed Demo
// =============================================================================

function DragSpeedDemo() {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    ref: slowRef,
    position: slowPos,
    isDragging: slowDrag,
  } = useAnimeDraggable<HTMLDivElement>({
    container: containerRef.current ?? undefined,
    containerPadding: 8,
    dragSpeed: 0.5, // Half speed
    releaseStiffness: 100,
    releaseDamping: 18,
  });

  const {
    ref: normalRef,
    position: normalPos,
    isDragging: normalDrag,
  } = useAnimeDraggable<HTMLDivElement>({
    container: containerRef.current ?? undefined,
    containerPadding: 8,
    dragSpeed: 1, // Normal
    releaseStiffness: 100,
    releaseDamping: 18,
  });

  const {
    ref: fastRef,
    position: fastPos,
    isDragging: fastDrag,
  } = useAnimeDraggable<HTMLDivElement>({
    container: containerRef.current ?? undefined,
    containerPadding: 8,
    dragSpeed: 2, // Double speed
    releaseStiffness: 100,
    releaseDamping: 18,
  });

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-300">Drag Speed</h4>
      <p className="text-xs text-gray-500">How fast element follows cursor</p>
      <div
        ref={containerRef}
        className="w-full h-48 bg-[#050508] border border-[#2a2a3a] border-dashed rounded-xl flex items-center justify-center gap-6 relative overflow-hidden"
      >
        <div
          ref={slowRef}
          className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold text-white text-xs cursor-grab active:cursor-grabbing bg-linear-to-br from-blue-600 to-blue-800 shadow-lg select-none ${slowDrag ? "shadow-2xl brightness-110" : ""}`}
        >
          <span>🐢</span>
          <span className="text-[8px]">0.5x</span>
        </div>
        <div
          ref={normalRef}
          className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold text-white text-xs cursor-grab active:cursor-grabbing bg-linear-to-br from-green-500 to-emerald-600 shadow-lg select-none ${normalDrag ? "shadow-2xl brightness-110" : ""}`}
        >
          <span>🐕</span>
          <span className="text-[8px]">1x</span>
        </div>
        <div
          ref={fastRef}
          className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold text-white text-xs cursor-grab active:cursor-grabbing bg-linear-to-br from-red-500 to-rose-600 shadow-lg select-none ${fastDrag ? "shadow-2xl brightness-110" : ""}`}
        >
          <span>🐆</span>
          <span className="text-[8px]">2x</span>
        </div>
      </div>
      <div className="px-4 py-2 bg-[#050508] border border-[#2a2a3a] rounded-lg font-mono text-[10px] text-[#888]">
        <span className="text-blue-400">
          Slow: ({Math.round(slowPos.x)}, {Math.round(slowPos.y)})
        </span>
        <span className="mx-2">|</span>
        <span className="text-green-400">
          Normal: ({Math.round(normalPos.x)}, {Math.round(normalPos.y)})
        </span>
        <span className="mx-2">|</span>
        <span className="text-red-400">
          Fast: ({Math.round(fastPos.x)}, {Math.round(fastPos.y)})
        </span>
      </div>
    </div>
  );
}

// =============================================================================
// Snapping Demo
// =============================================================================

function SnappingDraggable() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, isDragging, position, isReleasing } =
    useAnimeDraggable<HTMLDivElement>({
      container: containerRef.current ?? undefined,
      containerPadding: 8,
      snap: 50,
      releaseStiffness: 200,
      releaseDamping: 25,
      onSnap: () => console.log("Snapped!"),
    });

  // Create grid lines for visualization
  const gridLines = [];
  for (let i = 0; i <= 6; i++) {
    gridLines.push(
      <div
        key={`v-${i}`}
        className="absolute top-0 bottom-0 w-px bg-[#2a2a3a] opacity-50"
        style={{ left: `${(i / 6) * 100}%` }}
      />,
    );
    gridLines.push(
      <div
        key={`h-${i}`}
        className="absolute left-0 right-0 h-px bg-[#2a2a3a] opacity-50"
        style={{ top: `${(i / 4) * 100}%` }}
      />,
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-300">
        Snap to Grid (50px)
      </h4>
      <div
        ref={containerRef}
        className="w-full h-48 bg-[#050508] border border-[#2a2a3a] rounded-xl flex items-center justify-center relative overflow-hidden"
      >
        {gridLines}
        <div
          ref={ref}
          className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white text-xl cursor-grab active:cursor-grabbing bg-linear-to-br from-orange-500 to-red-600 shadow-lg select-none z-10 ${isDragging ? "shadow-2xl brightness-110 scale-110" : ""} ${isReleasing ? "transition-transform" : ""}`}
        >
          🧲
        </div>
      </div>
      <div className="px-4 py-2 bg-[#050508] border border-[#2a2a3a] rounded-lg font-mono text-[10px] text-[#888]">
        <span>
          Position: ({Math.round(position.x)}, {Math.round(position.y)})
        </span>
        {isReleasing && (
          <span className="ml-2 text-orange-400 animate-pulse">
            ⚡ Snapping...
          </span>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// Release Ease Demo
// =============================================================================

function ReleaseEaseDemo() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { ref: outRef, isDragging: outDrag } =
    useAnimeDraggable<HTMLDivElement>({
      container: containerRef.current ?? undefined,
      containerPadding: 8,
      releaseEase: "out(3)",
      releaseDuration: 600,
    });

  const { ref: elasticRef, isDragging: elasticDrag } =
    useAnimeDraggable<HTMLDivElement>({
      container: containerRef.current ?? undefined,
      containerPadding: 8,
      releaseEase: "outElastic(1, 0.5)",
    });

  const { ref: bounceRef, isDragging: bounceDrag } =
    useAnimeDraggable<HTMLDivElement>({
      container: containerRef.current ?? undefined,
      containerPadding: 8,
      releaseEase: "outBounce",
      releaseDuration: 800,
    });

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-300">Release Easing</h4>
      <div
        ref={containerRef}
        className="w-full h-48 bg-[#050508] border border-[#2a2a3a] border-dashed rounded-xl flex items-center justify-center gap-6 relative overflow-hidden"
      >
        <div
          ref={outRef}
          className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold text-white text-xs cursor-grab active:cursor-grabbing bg-linear-to-br from-sky-500 to-blue-600 shadow-lg select-none ${outDrag ? "shadow-2xl brightness-110" : ""}`}
        >
          <span>➡️</span>
          <span className="text-[8px]">out(3)</span>
        </div>
        <div
          ref={elasticRef}
          className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold text-white text-xs cursor-grab active:cursor-grabbing bg-linear-to-br from-fuchsia-500 to-pink-600 shadow-lg select-none ${elasticDrag ? "shadow-2xl brightness-110" : ""}`}
        >
          <span>🎸</span>
          <span className="text-[8px]">elastic</span>
        </div>
        <div
          ref={bounceRef}
          className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold text-white text-xs cursor-grab active:cursor-grabbing bg-linear-to-br from-lime-500 to-green-600 shadow-lg select-none ${bounceDrag ? "shadow-2xl brightness-110" : ""}`}
        >
          <span>🏀</span>
          <span className="text-[8px]">bounce</span>
        </div>
      </div>
      <div className="px-4 py-2 bg-[#050508] border border-[#2a2a3a] rounded-lg font-mono text-[10px] text-[#888]">
        Try flicking each element to see the different easing effects!
      </div>
    </div>
  );
}

// =============================================================================
// Cursor Demo
// =============================================================================

function CursorDemo() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { ref: customRef, isDragging: customDrag } =
    useAnimeDraggable<HTMLDivElement>({
      container: containerRef.current ?? undefined,
      containerPadding: 8,
      cursor: {
        default: "pointer",
        grab: "move",
      },
      releaseStiffness: 100,
      releaseDamping: 18,
    });

  const { ref: noCursorRef, isDragging: noCursorDrag } =
    useAnimeDraggable<HTMLDivElement>({
      container: containerRef.current ?? undefined,
      containerPadding: 8,
      cursor: false, // Disable cursor changes
      releaseStiffness: 100,
      releaseDamping: 18,
    });

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-300">
        Cursor Configuration
      </h4>
      <div
        ref={containerRef}
        className="w-full h-40 bg-[#050508] border border-[#2a2a3a] border-dashed rounded-xl flex items-center justify-center gap-8 relative overflow-hidden"
      >
        <div
          ref={customRef}
          className={`w-20 h-16 rounded-xl flex flex-col items-center justify-center font-bold text-white text-xs bg-linear-to-br from-indigo-500 to-violet-600 shadow-lg select-none ${customDrag ? "shadow-2xl brightness-110" : ""}`}
        >
          <span>🖱️</span>
          <span className="text-[8px]">Custom</span>
          <span className="text-[8px] opacity-70">pointer→move</span>
        </div>
        <div
          ref={noCursorRef}
          className={`w-20 h-16 rounded-xl flex flex-col items-center justify-center font-bold text-white text-xs cursor-grab active:cursor-grabbing bg-linear-to-br from-gray-500 to-slate-600 shadow-lg select-none ${noCursorDrag ? "shadow-2xl brightness-110" : ""}`}
        >
          <span>🚫</span>
          <span className="text-[8px]">No Change</span>
          <span className="text-[8px] opacity-70">cursor=false</span>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Control Methods Demo
// =============================================================================

function ControlledDraggable() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showDisabled, setShowDisabled] = useState(false);
  const {
    ref,
    isDragging,
    isDisabled,
    position,
    setX,
    setY,
    reset,
    enable,
    disable,
    refresh,
  } = useAnimeDraggable<HTMLDivElement>({
    container: containerRef.current ?? undefined,
    containerPadding: 16,
    releaseStiffness: 100,
    releaseDamping: 20,
    onSettle: () => console.log("Settled!"),
  });

  const handleDisable = () => {
    disable();
    setShowDisabled(true);
    setTimeout(() => setShowDisabled(false), 1000);
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-300">Control Methods</h4>
      <div
        ref={containerRef}
        className="w-full h-48 bg-[#050508] border border-[#2a2a3a] border-dashed rounded-xl flex items-center justify-center relative overflow-hidden"
      >
        <div
          ref={ref}
          className={`w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-white text-center p-2 shadow-lg select-none transition-all ${isDisabled ? "bg-gray-600 cursor-not-allowed opacity-50" : "cursor-grab active:cursor-grabbing bg-linear-to-br from-violet-500 to-purple-700"} ${isDragging ? "shadow-2xl brightness-110" : ""}`}
        >
          {isDisabled ? "🔒" : "🎮"}
        </div>
        {showDisabled && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-bold animate-pulse">
            Disabled!
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setX(-50)}
          className="px-3 py-1.5 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg text-xs font-medium transition-all"
        >
          ← setX(-50)
        </button>
        <button
          onClick={() => setX(50)}
          className="px-3 py-1.5 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg text-xs font-medium transition-all"
        >
          → setX(50)
        </button>
        <button
          onClick={() => setY(-30)}
          className="px-3 py-1.5 bg-linear-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-lg text-xs font-medium transition-all"
        >
          ↑ setY(-30)
        </button>
        <button
          onClick={() => setY(30)}
          className="px-3 py-1.5 bg-linear-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-lg text-xs font-medium transition-all"
        >
          ↓ setY(30)
        </button>
        <button
          onClick={() => reset()}
          className="px-3 py-1.5 bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-lg text-xs font-medium transition-all"
        >
          🔄 Reset
        </button>
        <button
          onClick={handleDisable}
          className="px-3 py-1.5 bg-linear-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg text-xs font-medium transition-all"
        >
          🔒 Disable
        </button>
        <button
          onClick={enable}
          className="px-3 py-1.5 bg-linear-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-lg text-xs font-medium transition-all"
        >
          🔓 Enable
        </button>
        <button
          onClick={refresh}
          className="px-3 py-1.5 bg-linear-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white rounded-lg text-xs font-medium transition-all"
        >
          ♻️ Refresh
        </button>
      </div>
      <div className="px-4 py-2 bg-[#050508] border border-[#2a2a3a] rounded-lg font-mono text-[10px] text-[#888]">
        Position: ({Math.round(position.x)}, {Math.round(position.y)}) | Status:{" "}
        {isDisabled ? "🔒 Disabled" : "✅ Enabled"}
      </div>
    </div>
  );
}

// =============================================================================
// Callbacks Demo
// =============================================================================

function CallbackDraggable() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [events, setEvents] = useState<string[]>([]);

  const addEvent = (event: string) => {
    setEvents((prev) => [...prev.slice(-5), event]);
  };

  const { ref, isDragging, position } = useAnimeDraggable<HTMLDivElement>({
    container: containerRef.current ?? undefined,
    containerPadding: 16,
    snap: 40,
    releaseStiffness: 150,
    releaseDamping: 20,
    onGrab: () => addEvent("🫳 onGrab"),
    onDrag: () => {
      /* too frequent to log */
    },
    onRelease: () => addEvent("✋ onRelease"),
    onSnap: () => addEvent("🧲 onSnap"),
    onSettle: () => addEvent("🏁 onSettle"),
  });

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-300">Callbacks</h4>
      <div className="flex gap-4">
        <div
          ref={containerRef}
          className="flex-1 h-48 bg-[#050508] border border-[#2a2a3a] border-dashed rounded-xl flex items-center justify-center relative overflow-hidden"
        >
          <div
            ref={ref}
            className={`w-16 h-16 rounded-xl flex items-center justify-center font-bold text-white text-2xl cursor-grab active:cursor-grabbing bg-linear-to-br from-pink-500 to-rose-600 shadow-lg select-none ${isDragging ? "shadow-2xl brightness-110" : ""}`}
          >
            📡
          </div>
        </div>
        <div className="w-48 bg-[#050508] border border-[#2a2a3a] rounded-xl p-3 font-mono text-[10px]">
          <div className="text-gray-400 mb-2 font-semibold">Event Log:</div>
          {events.length === 0 ? (
            <div className="text-gray-600 italic">Drag to see events...</div>
          ) : (
            events.map((event, i) => (
              <div
                key={i}
                className="text-gray-300 py-0.5 animate-pulse"
                style={{ animationDuration: "0.5s" }}
              >
                {event}
              </div>
            ))
          )}
        </div>
      </div>
      <div className="px-4 py-2 bg-[#050508] border border-[#2a2a3a] rounded-lg font-mono text-[10px] text-[#888]">
        Position: ({Math.round(position.x)}, {Math.round(position.y)})
      </div>
    </div>
  );
}

// =============================================================================
// Drag Threshold Demo
// =============================================================================

function DragThresholdDemo() {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    ref: noThreshRef,
    isDragging: noThreshDrag,
    isGrabbed: noThreshGrab,
  } = useAnimeDraggable<HTMLDivElement>({
    container: containerRef.current ?? undefined,
    containerPadding: 8,
    dragThreshold: 0, // Immediate
    releaseStiffness: 100,
    releaseDamping: 18,
  });

  const {
    ref: threshRef,
    isDragging: threshDrag,
    isGrabbed: threshGrab,
  } = useAnimeDraggable<HTMLDivElement>({
    container: containerRef.current ?? undefined,
    containerPadding: 8,
    dragThreshold: 30, // 30px before drag starts
    releaseStiffness: 100,
    releaseDamping: 18,
  });

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-300">Drag Threshold</h4>
      <p className="text-xs text-gray-500">
        Distance before drag activates (click vs drag)
      </p>
      <div
        ref={containerRef}
        className="w-full h-40 bg-[#050508] border border-[#2a2a3a] border-dashed rounded-xl flex items-center justify-center gap-8 relative overflow-hidden"
      >
        <div
          ref={noThreshRef}
          className={`w-20 h-16 rounded-xl flex flex-col items-center justify-center font-bold text-white text-xs cursor-grab active:cursor-grabbing bg-linear-to-br from-cyan-500 to-blue-600 shadow-lg select-none ${noThreshDrag ? "shadow-2xl brightness-110" : ""}`}
        >
          <span>⚡</span>
          <span className="text-[8px]">threshold=0</span>
          <span className="text-[8px] opacity-70">Immediate</span>
        </div>
        <div
          ref={threshRef}
          className={`w-20 h-16 rounded-xl flex flex-col items-center justify-center font-bold text-white text-xs cursor-grab active:cursor-grabbing bg-linear-to-br from-amber-500 to-orange-600 shadow-lg select-none ${threshDrag ? "shadow-2xl brightness-110" : ""}`}
        >
          <span>📏</span>
          <span className="text-[8px]">threshold=30</span>
          <span className="text-[8px] opacity-70">30px delay</span>
        </div>
      </div>
      <div className="px-4 py-2 bg-[#050508] border border-[#2a2a3a] rounded-lg font-mono text-[10px] text-[#888]">
        <span className="text-cyan-400">
          Immediate:{" "}
          {noThreshGrab ? (noThreshDrag ? "Dragging" : "Grabbed") : "Idle"}
        </span>
        <span className="mx-4">|</span>
        <span className="text-orange-400">
          Threshold:{" "}
          {threshGrab
            ? threshDrag
              ? "Dragging"
              : "Grabbed (waiting)"
            : "Idle"}
        </span>
      </div>
    </div>
  );
}

// =============================================================================
// Main Demo Export
// =============================================================================

export function DraggableDemo() {
  return (
    <DemoSection title="Draggable (useAnimeDraggable)">
      <div className="space-y-12">
        {/* Basic */}
        <BasicDraggable />

        {/* Settings Section */}
        <div className="border-t border-[#2a2a3a] pt-8">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-green-400">⚙️</span> Settings
          </h3>
          <div className="grid gap-8">
            <TriggerDemo />
            <AxisConstrainedDraggable />
            <ContainerFrictionDemo />
            <DragSpeedDemo />
            <DragThresholdDemo />
            <CursorDemo />
          </div>
        </div>

        {/* Physics Section */}
        <div className="border-t border-[#2a2a3a] pt-8">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-blue-400">🔬</span> Physics & Animation
          </h3>
          <div className="grid gap-8">
            <SpringPhysicsDemo />
            <VelocityDemo />
            <ReleaseEaseDemo />
            <SnappingDraggable />
          </div>
        </div>

        {/* Methods & Callbacks Section */}
        <div className="border-t border-[#2a2a3a] pt-8">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-purple-400">🎮</span> Methods & Callbacks
          </h3>
          <div className="grid gap-8">
            <ControlledDraggable />
            <CallbackDraggable />
          </div>
        </div>
      </div>
    </DemoSection>
  );
}
