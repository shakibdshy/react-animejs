import { createFileRoute } from "@tanstack/react-router";
import { DraggableDemo } from "@/demo-examples/components/draggable";

export const Route = createFileRoute("/demo/draggable")({
  component: DraggablePage,
});

function DraggablePage() {
  return <DraggableDemo />;
}
