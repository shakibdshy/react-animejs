import { createFileRoute } from "@tanstack/react-router";
import { DraggableDemo } from "@/demo/components/DraggableDemo";

export const Route = createFileRoute("/demo/draggable")({
  component: DraggablePage,
});

function DraggablePage() {
  return <DraggableDemo />;
}
