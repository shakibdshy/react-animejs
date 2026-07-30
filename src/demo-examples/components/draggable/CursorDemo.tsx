import { useRef } from 'react';
import { useAnimeDraggable } from '@shakibdshy/react-animejs';

export function CursorDemo() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { ref: customRef, isDragging: customDrag } = useAnimeDraggable<HTMLDivElement>({
    container: containerRef.current ?? undefined,
    containerPadding: 8,
    cursor: { default: 'pointer', grab: 'move' },
    releaseStiffness: 100,
    releaseDamping: 18,
  });

  const { ref: noCursorRef, isDragging: noCursorDrag } = useAnimeDraggable<HTMLDivElement>({
    container: containerRef.current ?? undefined,
    containerPadding: 8,
    cursor: false,
    releaseStiffness: 100,
    releaseDamping: 18,
  });

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-300">Cursor Configuration</h4>
      <div
        ref={containerRef}
        className="w-full h-40 bg-demo-bg border border-demo-border border-dashed rounded-xl flex items-center justify-center gap-8 relative overflow-hidden"
      >
        <div ref={customRef} className={`w-20 h-16 rounded-xl flex flex-col items-center justify-center font-bold text-white text-xs bg-linear-to-br from-indigo-500 to-violet-600 shadow-lg select-none ${customDrag ? "shadow-2xl brightness-110" : ""}`}>
          <span>🖱️</span><span className="text-[8px]">Custom</span><span className="text-[8px] opacity-70">pointer→move</span>
        </div>
        <div ref={noCursorRef} className={`w-20 h-16 rounded-xl flex flex-col items-center justify-center font-bold text-white text-xs cursor-grab active:cursor-grabbing bg-linear-to-br from-gray-500 to-slate-600 shadow-lg select-none ${noCursorDrag ? "shadow-2xl brightness-110" : ""}`}>
          <span>🚫</span><span className="text-[8px]">No Change</span><span className="text-[8px] opacity-70">cursor=false</span>
        </div>
      </div>
    </div>
  );
}
