import { useRef } from 'react';
import { useAnimeDraggable } from '@shakibdshy/react-animejs';

export function DragSpeedDemo() {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    ref: slowRef, position: slowPos, isDragging: slowDrag,
  } = useAnimeDraggable<HTMLDivElement>({
    container: containerRef.current ?? undefined,
    containerPadding: 8,
    dragSpeed: 0.5,
    releaseStiffness: 100,
    releaseDamping: 18,
  });

  const {
    ref: normalRef, position: normalPos, isDragging: normalDrag,
  } = useAnimeDraggable<HTMLDivElement>({
    container: containerRef.current ?? undefined,
    containerPadding: 8,
    dragSpeed: 1,
    releaseStiffness: 100,
    releaseDamping: 18,
  });

  const {
    ref: fastRef, position: fastPos, isDragging: fastDrag,
  } = useAnimeDraggable<HTMLDivElement>({
    container: containerRef.current ?? undefined,
    containerPadding: 8,
    dragSpeed: 2,
    releaseStiffness: 100,
    releaseDamping: 18,
  });

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-300">Drag Speed</h4>
      <p className="text-xs text-gray-500">How fast element follows cursor</p>
      <div
        ref={containerRef}
        className="w-full h-48 bg-demo-bg border border-demo-border border-dashed rounded-xl flex items-center justify-center gap-6 relative overflow-hidden"
      >
        <div ref={slowRef} className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold text-white text-xs cursor-grab active:cursor-grabbing bg-linear-to-br from-blue-600 to-blue-800 shadow-lg select-none ${slowDrag ? "shadow-2xl brightness-110" : ""}`}>
          <span>🐢</span><span className="text-[8px]">0.5x</span>
        </div>
        <div ref={normalRef} className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold text-white text-xs cursor-grab active:cursor-grabbing bg-linear-to-br from-green-500 to-emerald-600 shadow-lg select-none ${normalDrag ? "shadow-2xl brightness-110" : ""}`}>
          <span>🐕</span><span className="text-[8px]">1x</span>
        </div>
        <div ref={fastRef} className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold text-white text-xs cursor-grab active:cursor-grabbing bg-linear-to-br from-red-500 to-rose-600 shadow-lg select-none ${fastDrag ? "shadow-2xl brightness-110" : ""}`}>
          <span>🐆</span><span className="text-[8px]">2x</span>
        </div>
      </div>
      <div className="px-4 py-2 bg-demo-bg border border-demo-border rounded-lg font-mono text-[10px] text-demo-text-secondary">
        <span className="text-blue-400">Slow: ({Math.round(slowPos.x)}, {Math.round(slowPos.y)})</span>
        <span className="mx-2">|</span>
        <span className="text-green-400">Normal: ({Math.round(normalPos.x)}, {Math.round(normalPos.y)})</span>
        <span className="mx-2">|</span>
        <span className="text-red-400">Fast: ({Math.round(fastPos.x)}, {Math.round(fastPos.y)})</span>
      </div>
    </div>
  );
}
