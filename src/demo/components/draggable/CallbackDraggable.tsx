import { useRef, useState } from 'react';
import { useAnimeDraggable } from '@/lib/react-animejs';

export function CallbackDraggable() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [events, setEvents] = useState<string[]>([]);

  const addEvent = (event: string) => {
    setEvents((prev) => [...prev.slice(-5), event]);
  };

  const { ref, isDragging, position } = useAnimeDraggable<HTMLDivElement>({
    container: containerRef.current ?? undefined,
    containerPadding: 16,
    snap: 40,
    releaseStiffness: 150,
    releaseDamping: 20,
    onGrab: () => addEvent('🫳 onGrab'),
    onDrag: () => { /* too frequent to log */ },
    onRelease: () => addEvent('✋ onRelease'),
    onSnap: () => addEvent('🧲 onSnap'),
    onSettle: () => addEvent('🏁 onSettle'),
  });

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-300">Callbacks</h4>
      <div className="flex gap-4">
        <div
          ref={containerRef}
          className="flex-1 h-48 bg-demo-bg border border-demo-border border-dashed rounded-xl flex items-center justify-center relative overflow-hidden"
        >
          <div ref={ref} className={`w-16 h-16 rounded-xl flex items-center justify-center font-bold text-white text-2xl cursor-grab active:cursor-grabbing bg-linear-to-br from-pink-500 to-rose-600 shadow-lg select-none ${isDragging ? "shadow-2xl brightness-110" : ""}`}>
            📡
          </div>
        </div>
        <div className="w-48 bg-demo-bg border border-demo-border rounded-xl p-3 font-mono text-[10px]">
          <div className="text-gray-400 mb-2 font-semibold">Event Log:</div>
          {events.length === 0 ? (
            <div className="text-gray-600 italic">Drag to see events...</div>
          ) : (
            events.map((event, i) => (
              <div key={i} className="text-gray-300 py-0.5 animate-pulse" style={{ animationDuration: '0.5s' }}>
                {event}
              </div>
            ))
          )}
        </div>
      </div>
      <div className="px-4 py-2 bg-demo-bg border border-demo-border rounded-lg font-mono text-[10px] text-demo-text-secondary">
        Position: ({Math.round(position.x)}, {Math.round(position.y)})
      </div>
    </div>
  );
}
