import { useRef } from 'react';
import { useAnimeDraggable } from '@/lib/react-animejs';

export function DragThresholdDemo() {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    ref: noThreshRef, isDragging: noThreshDrag, isGrabbed: noThreshGrab,
  } = useAnimeDraggable<HTMLDivElement>({
    container: containerRef.current ?? undefined,
    containerPadding: 8,
    dragThreshold: 0,
    releaseStiffness: 100,
    releaseDamping: 18,
  });

  const {
    ref: threshRef, isDragging: threshDrag, isGrabbed: threshGrab,
  } = useAnimeDraggable<HTMLDivElement>({
    container: containerRef.current ?? undefined,
    containerPadding: 8,
    dragThreshold: 30,
    releaseStiffness: 100,
    releaseDamping: 18,
  });

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-300">Drag Threshold</h4>
      <p className="text-xs text-gray-500">Distance before drag activates (click vs drag)</p>
      <div
        ref={containerRef}
        className="w-full h-40 bg-demo-bg border border-demo-border border-dashed rounded-xl flex items-center justify-center gap-8 relative overflow-hidden"
      >
        <div ref={noThreshRef} className={`w-20 h-16 rounded-xl flex flex-col items-center justify-center font-bold text-white text-xs cursor-grab active:cursor-grabbing bg-linear-to-br from-cyan-500 to-blue-600 shadow-lg select-none ${noThreshDrag ? "shadow-2xl brightness-110" : ""}`}>
          <span>⚡</span><span className="text-[8px]">threshold=0</span><span className="text-[8px] opacity-70">Immediate</span>
        </div>
        <div ref={threshRef} className={`w-20 h-16 rounded-xl flex flex-col items-center justify-center font-bold text-white text-xs cursor-grab active:cursor-grabbing bg-linear-to-br from-amber-500 to-orange-600 shadow-lg select-none ${threshDrag ? "shadow-2xl brightness-110" : ""}`}>
          <span>📏</span><span className="text-[8px]">threshold=30</span><span className="text-[8px] opacity-70">30px delay</span>
        </div>
      </div>
      <div className="px-4 py-2 bg-demo-bg border border-demo-border rounded-lg font-mono text-[10px] text-demo-text-secondary">
        <span className="text-cyan-400">Immediate: {noThreshGrab ? (noThreshDrag ? "Dragging" : "Grabbed") : "Idle"}</span>
        <span className="mx-4">|</span>
        <span className="text-orange-400">Threshold: {threshGrab ? (threshDrag ? "Dragging" : "Grabbed (waiting)") : "Idle"}</span>
      </div>
    </div>
  );
}
