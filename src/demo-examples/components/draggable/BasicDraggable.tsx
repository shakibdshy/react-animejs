import { useRef } from 'react';
import { useAnimeDraggable } from '@/lib/react-animejs';

export function BasicDraggable() {
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
        className="w-full h-48 bg-demo-bg border border-demo-border border-dashed rounded-xl flex items-center justify-center relative overflow-hidden"
      >
        <div
          ref={ref}
          className={`w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-white text-center p-2 cursor-grab active:cursor-grabbing bg-linear-to-br from-cyan-500 to-blue-600 shadow-lg select-none transition-shadow ${isDragging ? "shadow-2xl brightness-110" : ""}`}
        >
          👆 Drag
        </div>
      </div>
      <div className="px-4 py-2 bg-demo-bg border border-demo-border rounded-lg font-mono text-[10px] text-demo-text-secondary grid grid-cols-2 gap-2">
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
