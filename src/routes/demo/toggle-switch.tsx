import { createFileRoute } from "@tanstack/react-router";
import { ToggleSwitchGroup } from "@/lib/react-animejs/demo/components/ToggleSwitchGroup";

export const Route = createFileRoute("/demo/toggle-switch")({
  component: ToggleSwitchPage,
});

function ToggleSwitchPage() {
  return <ToggleSwitchGroup />;
}
