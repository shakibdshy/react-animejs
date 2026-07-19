import { createFileRoute } from "@tanstack/react-router";
import { TimersGroup } from "@/demo-examples/components/TimersGroup";

export const Route = createFileRoute("/demo/timers")({
  component: TimersPage,
});

function TimersPage() {
  return <TimersGroup />;
}
