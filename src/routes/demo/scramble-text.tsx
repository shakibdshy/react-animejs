import { createFileRoute } from "@tanstack/react-router";
import ScrambleTextGroup from "@/demo/components/ScrambleTextGroup";

export const Route = createFileRoute("/demo/scramble-text")({
  component: ScrambleTextPage,
});

function ScrambleTextPage() {
  return <ScrambleTextGroup />;
}
