import { useRef } from 'react';
import { useAnimeDraggable } from '@shakibdshy/react-animejs';

export function SnappingDraggable() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, isDragging, position, isReleasing } = useAnimeDraggable<HTMLDivElement>({
    container: containerRef.current ?? undefined,
    containerPadding: 8,
    snap: 50,
    releaseStiffness: 200,
    releaseDamping: 25,
  });

  const gridLines = [];
  for (let i = 0; i <= 6; i++) {
    gridLines.push(
      <div key={`v-${i}`} className="absolute top-0 bottom-0 w-px bg-demo-border opacity-50" style={{ left: `${(i / 6) * 100}%` }} />,
    );
    gridLines.push(
      <div key={`h-${i}`} className="absolute left-0 right-0 h-px bg-demo-border opacity-50" style={{ top: `${(i / 4) * 100}%` }} />,
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-300">Snap to Grid (50px)</h4>
      <div
        ref={containerRef}
        className="w-full h-48 bg-demo-bg border border-demo-border rounded-xl flex items-center justify-center relative overflow-hidden"
      >
        {gridLines}
        <div ref={ref} className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white text-xl cursor-grab active:cursor-grabbing bg-linear-to-br from-orange-500 to-red-600 shadow-lg select-none z-10 ${isDragging ? "shadow-2xl brightness-110 scale-110" : ""} ${isReleasing ? "transition-transform" : ""}`}>
          🧲
        </div>
      </div>
      <div className="px-4 py-2 bg-demo-bg border border-demo-border rounded-lg font-mono text-[10px] text-demo-text-secondary">
        <span>Position: ({Math.round(position.x)}, {Math.round(position.y)})</span>
        {isReleasing && <span className="ml-2 text-orange-400 animate-pulse">⚡ Snapping...</span>}
      </div>
    </div>
  );
}
