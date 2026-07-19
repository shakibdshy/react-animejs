import { useRef } from 'react';
import { useAnimeDraggable } from '@/lib/react-animejs';

export function ReleaseEaseDemo() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { ref: outRef, isDragging: outDrag } = useAnimeDraggable<HTMLDivElement>({
    container: containerRef.current ?? undefined,
    containerPadding: 8,
    releaseEase: 'out(3)',
    releaseDuration: 600,
  });

  const { ref: elasticRef, isDragging: elasticDrag } = useAnimeDraggable<HTMLDivElement>({
    container: containerRef.current ?? undefined,
    containerPadding: 8,
    releaseEase: 'outElastic(1, 0.5)',
  });

  const { ref: bounceRef, isDragging: bounceDrag } = useAnimeDraggable<HTMLDivElement>({
    container: containerRef.current ?? undefined,
    containerPadding: 8,
    releaseEase: 'outBounce',
    releaseDuration: 800,
  });

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-300">Release Easing</h4>
      <div
        ref={containerRef}
        className="w-full h-48 bg-demo-bg border border-demo-border border-dashed rounded-xl flex items-center justify-center gap-6 relative overflow-hidden"
      >
        <div ref={outRef} className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold text-white text-xs cursor-grab active:cursor-grabbing bg-linear-to-br from-sky-500 to-blue-600 shadow-lg select-none ${outDrag ? "shadow-2xl brightness-110" : ""}`}>
          <span>➡️</span><span className="text-[8px]">out(3)</span>
        </div>
        <div ref={elasticRef} className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold text-white text-xs cursor-grab active:cursor-grabbing bg-linear-to-br from-fuchsia-500 to-pink-600 shadow-lg select-none ${elasticDrag ? "shadow-2xl brightness-110" : ""}`}>
          <span>🎸</span><span className="text-[8px]">elastic</span>
        </div>
        <div ref={bounceRef} className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold text-white text-xs cursor-grab active:cursor-grabbing bg-linear-to-br from-lime-500 to-green-600 shadow-lg select-none ${bounceDrag ? "shadow-2xl brightness-110" : ""}`}>
          <span>🏀</span><span className="text-[8px]">bounce</span>
        </div>
      </div>
      <div className="px-4 py-2 bg-demo-bg border border-demo-border rounded-lg font-mono text-[10px] text-demo-text-secondary">
        Try flicking each element to see the different easing effects!
      </div>
    </div>
  );
}
