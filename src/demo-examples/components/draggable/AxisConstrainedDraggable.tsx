import { useRef } from 'react';
import { useAnimeDraggable } from '@shakibdshy/react-animejs';

export function AxisConstrainedDraggable() {
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
      <h4 className="text-sm font-semibold text-gray-300">Axis Constraints (x: false / y: false)</h4>
      <div
        ref={containerRef}
        className="w-full h-48 bg-demo-bg border border-demo-border border-dashed rounded-xl flex items-center justify-center gap-8 relative overflow-hidden"
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
      <div className="px-4 py-2 bg-demo-bg border border-demo-border rounded-lg font-mono text-[10px] text-demo-text-secondary flex gap-4">
        <span>X-only: ({Math.round(xPos.x)}, {Math.round(xPos.y)})</span>
        <span>Y-only: ({Math.round(yPos.x)}, {Math.round(yPos.y)})</span>
      </div>
    </div>
  );
}
