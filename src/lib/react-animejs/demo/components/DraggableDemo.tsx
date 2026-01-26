import { DemoSection } from "./DemoSection";
import { useAnimeDraggable } from "../../index";

/**
 * Draggable demonstration
 */
export function DraggableDemo() {
  const { ref, isDragging, position } = useAnimeDraggable<HTMLDivElement>({
    container: [-100, -100, 100, 100],
    releaseEase: "spring(1, 80, 10)",
  });

  return (
    <DemoSection title="Draggable (useAnimeDraggable)">
      <div className="w-full h-48 bg-[#050508] border border-[#2a2a3a] border-dashed rounded-xl flex items-center justify-center relative overflow-hidden">
        <div
          ref={ref}
          className={`w-24 h-24 rounded-2xl flex items-center justify-center font-bold text-white text-center p-2 cursor-grab active:cursor-grabbing bg-linear-to-br from-cyan-500 to-blue-600 shadow-lg select-none transition-shadow ${isDragging ? "shadow-2xl brightness-110" : ""}`}
        >
          👆 Drag me!
        </div>
      </div>
      <div className="mt-4 px-4 py-2 bg-[#050508] border border-[#2a2a3a] rounded-lg font-mono text-[10px] text-[#888]">
        Position: ({Math.round(position.x)}, {Math.round(position.y)})
        {isDragging && (
          <span className="text-blue-400 ml-2 animate-bounce inline-block">
            🫳 DRAGGING
          </span>
        )}
      </div>
    </DemoSection>
  );
}
