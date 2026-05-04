import { createFileRoute } from "@tanstack/react-router";
import { TimelinesGroup } from "@/demo/components/TimelinesGroup";

export const Route = createFileRoute("/demo/timelines")({
  component: TimelinesPage,
});

function TimelinesPage() {
  return <TimelinesGroup />;
}
