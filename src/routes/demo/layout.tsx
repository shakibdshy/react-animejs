import { createFileRoute } from "@tanstack/react-router";
import { LayoutGroup } from "@/demo/components/LayoutGroup";

export const Route = createFileRoute("/demo/layout")({
  component: LayoutPage,
});

function LayoutPage() {
  return <LayoutGroup />;
}
