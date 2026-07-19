import { createFileRoute } from "@tanstack/react-router";
import { LayoutGroup } from "@/demo-examples/components/LayoutGroup";

export const Route = createFileRoute("/demo/layout")({
  component: LayoutPage,
});

function LayoutPage() {
  return <LayoutGroup />;
}
