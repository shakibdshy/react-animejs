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
      <div className="drag-container">
        <div
          ref={ref}
          className={`demo-box draggable gradient-5 ${isDragging ? "dragging" : ""}`}
        >
          👆 Drag me!
        </div>
      </div>
      <div className="demo-state">
        Position: ({Math.round(position.x)}, {Math.round(position.y)})
        {isDragging && " 🫳"}
      </div>
    </DemoSection>
  );
}
