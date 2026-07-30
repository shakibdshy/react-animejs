import { useRef } from 'react';
import { useAnimeDraggable } from '@shakibdshy/react-animejs';

export function VelocityDemo() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { ref: fastRef, velocity: fastVel, isDragging: fastDrag } = useAnimeDraggable<HTMLDivElement>({
    container: containerRef.current ?? undefined,
    containerPadding: 8,
    velocityMultiplier: 3,
    releaseStiffness: 60,
    releaseDamping: 12,
  });

  const { ref: cappedRef, velocity: cappedVel, isDragging: cappedDrag } = useAnimeDraggable<HTMLDivElement>({
    container: containerRef.current ?? undefined,
    containerPadding: 8,
    velocityMultiplier: 1,
    maxVelocity: 200,
    releaseStiffness: 80,
    releaseDamping: 15,
  });

  const { ref: threshRef, velocity: threshVel, isDragging: threshDrag } = useAnimeDraggable<HTMLDivElement>({
    container: containerRef.current ?? undefined,
    containerPadding: 8,
    minVelocity: 100,
    releaseStiffness: 80,
    releaseDamping: 15,
  });

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-300">Velocity Settings</h4>
      <div
        ref={containerRef}
        className="w-full h-48 bg-demo-bg border border-demo-border border-dashed rounded-xl flex items-center justify-center gap-6 relative overflow-hidden"
      >
        <div ref={fastRef} className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold text-white text-xs cursor-grab active:cursor-grabbing bg-linear-to-br from-red-500 to-pink-600 shadow-lg select-none ${fastDrag ? "shadow-2xl brightness-110" : ""}`}>
          <span>🚀</span><span className="text-[8px]">3x Speed</span>
        </div>
        <div ref={cappedRef} className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold text-white text-xs cursor-grab active:cursor-grabbing bg-linear-to-br from-amber-500 to-yellow-600 shadow-lg select-none ${cappedDrag ? "shadow-2xl brightness-110" : ""}`}>
          <span>🛑</span><span className="text-[8px]">Max=200</span>
        </div>
        <div ref={threshRef} className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold text-white text-xs cursor-grab active:cursor-grabbing bg-linear-to-br from-violet-500 to-purple-600 shadow-lg select-none ${threshDrag ? "shadow-2xl brightness-110" : ""}`}>
          <span>📏</span><span className="text-[8px]">Min=100</span>
        </div>
      </div>
      <div className="px-4 py-2 bg-demo-bg border border-demo-border rounded-lg font-mono text-[10px] text-demo-text-secondary">
        <span className="text-red-400">3x: v={Math.round(Math.hypot(fastVel.x, fastVel.y))}</span>
        <span className="mx-2">|</span>
        <span className="text-yellow-400">Capped: v={Math.round(Math.hypot(cappedVel.x, cappedVel.y))}</span>
        <span className="mx-2">|</span>
        <span className="text-purple-400">Thresh: v={Math.round(Math.hypot(threshVel.x, threshVel.y))}</span>
      </div>
    </div>
  );
}
