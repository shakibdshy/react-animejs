import { useRef, useState } from 'react';
import { useAnimeDraggable } from '@/lib/react-animejs';

export function ControlledDraggable() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showDisabled, setShowDisabled] = useState(false);
  const {
    ref,
    isDragging,
    isDisabled,
    position,
    setX,
    setY,
    reset,
    enable,
    disable,
    refresh,
  } = useAnimeDraggable<HTMLDivElement>({
    container: containerRef.current ?? undefined,
    containerPadding: 16,
    releaseStiffness: 100,
    releaseDamping: 20,
  });

  const handleDisable = () => {
    disable();
    setShowDisabled(true);
    setTimeout(() => setShowDisabled(false), 1000);
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-300">Control Methods</h4>
      <div
        ref={containerRef}
        className="w-full h-48 bg-demo-bg border border-demo-border border-dashed rounded-xl flex items-center justify-center relative overflow-hidden"
      >
        <div
          ref={ref}
          className={`w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-white text-center p-2 shadow-lg select-none transition-all ${isDisabled ? "bg-gray-600 cursor-not-allowed opacity-50" : "cursor-grab active:cursor-grabbing bg-linear-to-br from-violet-500 to-purple-700"} ${isDragging ? "shadow-2xl brightness-110" : ""}`}
        >
          {isDisabled ? '🔒' : '🎮'}
        </div>
        {showDisabled && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-bold animate-pulse">
            Disabled!
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setX(-50)} className="px-3 py-1.5 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg text-xs font-medium transition-all">← setX(-50)</button>
        <button onClick={() => setX(50)} className="px-3 py-1.5 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg text-xs font-medium transition-all">→ setX(50)</button>
        <button onClick={() => setY(-30)} className="px-3 py-1.5 bg-linear-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-lg text-xs font-medium transition-all">↑ setY(-30)</button>
        <button onClick={() => setY(30)} className="px-3 py-1.5 bg-linear-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-lg text-xs font-medium transition-all">↓ setY(30)</button>
        <button onClick={() => reset()} className="px-3 py-1.5 bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-lg text-xs font-medium transition-all">🔄 Reset</button>
        <button onClick={handleDisable} className="px-3 py-1.5 bg-linear-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg text-xs font-medium transition-all">🔒 Disable</button>
        <button onClick={enable} className="px-3 py-1.5 bg-linear-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-lg text-xs font-medium transition-all">🔓 Enable</button>
        <button onClick={refresh} className="px-3 py-1.5 bg-linear-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white rounded-lg text-xs font-medium transition-all">♻️ Refresh</button>
      </div>
      <div className="px-4 py-2 bg-demo-bg border border-demo-border rounded-lg font-mono text-[10px] text-demo-text-secondary">
        Position: ({Math.round(position.x)}, {Math.round(position.y)}) | Status: {isDisabled ? '🔒 Disabled' : '✅ Enabled'}
      </div>
    </div>
  );
}
