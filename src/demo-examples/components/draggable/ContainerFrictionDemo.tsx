import { useRef } from 'react';
import { useAnimeDraggable } from '@/lib/react-animejs';

export function ContainerFrictionDemo() {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    ref: lowRef,
    position: lowPos,
    isDragging: lowDrag,
  } = useAnimeDraggable<HTMLDivElement>({
    container: containerRef.current ?? undefined,
    containerPadding: 8,
    containerFriction: 0.95,
    releaseContainerFriction: 0.1,
    releaseStiffness: 100,
    releaseDamping: 15,
  });

  const {
    ref: highRef,
    position: highPos,
    isDragging: highDrag,
  } = useAnimeDraggable<HTMLDivElement>({
    container: containerRef.current ?? undefined,
    containerPadding: 8,
    containerFriction: 0.3,
    releaseContainerFriction: 0.5,
    releaseStiffness: 100,
    releaseDamping: 15,
  });

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-300">Container Friction</h4>
      <p className="text-xs text-gray-500">Rubber-band effect when dragging past bounds</p>
      <div
        ref={containerRef}
        className="w-full h-48 bg-demo-bg border border-demo-border border-dashed rounded-xl flex items-center justify-center gap-8 relative overflow-hidden"
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
      <div className="px-4 py-2 bg-demo-bg border border-demo-border rounded-lg font-mono text-[10px] text-demo-text-secondary">
        <span className="text-red-400">Elastic: ({Math.round(lowPos.x)}, {Math.round(lowPos.y)})</span>
        <span className="mx-4">|</span>
        <span className="text-blue-400">Rigid: ({Math.round(highPos.x)}, {Math.round(highPos.y)})</span>
      </div>
    </div>
  );
}
