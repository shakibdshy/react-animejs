import { useRef } from 'react';
import { useAnimeDraggable } from '@/lib/react-animejs';

export function SpringPhysicsDemo() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { ref: bouncyRef, isDragging: bouncyDrag } = useAnimeDraggable<HTMLDivElement>({
    container: containerRef.current ?? undefined,
    containerPadding: 8,
    releaseStiffness: 200,
    releaseDamping: 8,
    releaseMass: 1,
  });

  const { ref: smoothRef, isDragging: smoothDrag } = useAnimeDraggable<HTMLDivElement>({
    container: containerRef.current ?? undefined,
    containerPadding: 8,
    releaseStiffness: 100,
    releaseDamping: 20,
    releaseMass: 1,
  });

  const { ref: heavyRef, isDragging: heavyDrag } = useAnimeDraggable<HTMLDivElement>({
    container: containerRef.current ?? undefined,
    containerPadding: 8,
    releaseStiffness: 40,
    releaseDamping: 15,
    releaseMass: 3,
  });

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-300">Spring Physics (stiffness, damping, mass)</h4>
      <div
        ref={containerRef}
        className="w-full h-48 bg-demo-bg border border-demo-border border-dashed rounded-xl flex items-center justify-center gap-6 relative overflow-hidden"
      >
        <div ref={bouncyRef} className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold text-white text-xs cursor-grab active:cursor-grabbing bg-linear-to-br from-yellow-400 to-orange-500 shadow-lg select-none ${bouncyDrag ? "shadow-2xl brightness-110" : ""}`}>
          <span>🏀</span><span className="text-[8px]">Bouncy</span>
        </div>
        <div ref={smoothRef} className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold text-white text-xs cursor-grab active:cursor-grabbing bg-linear-to-br from-teal-400 to-cyan-500 shadow-lg select-none ${smoothDrag ? "shadow-2xl brightness-110" : ""}`}>
          <span>🧈</span><span className="text-[8px]">Smooth</span>
        </div>
        <div ref={heavyRef} className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold text-white text-xs cursor-grab active:cursor-grabbing bg-linear-to-br from-slate-500 to-gray-600 shadow-lg select-none ${heavyDrag ? "shadow-2xl brightness-110" : ""}`}>
          <span>🪨</span><span className="text-[8px]">Heavy</span>
        </div>
      </div>
      <div className="px-4 py-2 bg-demo-bg border border-demo-border rounded-lg font-mono text-[10px] text-demo-text-secondary">
        <span className="text-yellow-400">Bouncy: stiff=200, damp=8</span>
        <span className="mx-2">|</span>
        <span className="text-cyan-400">Smooth: stiff=100, damp=20</span>
        <span className="mx-2">|</span>
        <span className="text-gray-400">Heavy: stiff=40, mass=3</span>
      </div>
    </div>
  );
}
