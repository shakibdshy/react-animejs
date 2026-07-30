import { useRef } from 'react';
import { useAnimeDraggable } from '@shakibdshy/react-animejs';

export function TriggerDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, isDragging, position } = useAnimeDraggable<HTMLDivElement>({
    container: containerRef.current ?? undefined,
    containerPadding: 8,
    trigger: '.drag-handle',
    releaseStiffness: 100,
    releaseDamping: 18,
  });

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-300">Trigger (Drag Handle)</h4>
      <p className="text-xs text-gray-500">Only the ≡ handle area is draggable</p>
      <div
        ref={containerRef}
        className="w-full h-40 bg-demo-bg border border-demo-border border-dashed rounded-xl flex items-center justify-center relative overflow-hidden"
      >
        <div
          ref={ref}
          className={`w-48 bg-[#1a1a2e] border border-demo-border rounded-xl shadow-lg select-none ${isDragging ? "shadow-2xl" : ""}`}
        >
          <div className="drag-handle bg-demo-border rounded-t-xl px-3 py-2 cursor-grab active:cursor-grabbing flex items-center gap-2 hover:bg-demo-border-hover transition-colors">
            <span className="text-gray-400 text-lg">≡</span>
            <span className="text-xs text-gray-400">Drag here</span>
          </div>
          <div className="p-3 cursor-default">
            <p className="text-xs text-gray-300">Card Content</p>
            <p className="text-[10px] text-gray-500 mt-1">Click here - no drag</p>
          </div>
        </div>
      </div>
      <div className="px-4 py-2 bg-demo-bg border border-demo-border rounded-lg font-mono text-[10px] text-demo-text-secondary">
        Position: ({Math.round(position.x)}, {Math.round(position.y)})
      </div>
    </div>
  );
}
