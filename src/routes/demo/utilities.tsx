import { createFileRoute } from "@tanstack/react-router";
import { UtilitiesGroup } from "@/lib/react-animejs/demo/components/UtilitiesGroup";

export const Route = createFileRoute("/demo/utilities")({
  component: UtilitiesPage,
});

function UtilitiesPage() {
  return <UtilitiesGroup />;
}
