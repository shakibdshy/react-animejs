import { createFileRoute } from "@tanstack/react-router";
import { DraggableDemo } from "@/lib/react-animejs/demo/components/DraggableDemo";

export const Route = createFileRoute("/demo/draggable")({
  component: DraggablePage,
});

function DraggablePage() {
  return <DraggableDemo />;
}
