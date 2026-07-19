import { createFileRoute } from "@tanstack/react-router";
import { ClipPathRevealGroup } from "@/demo-examples/components/ClipPathRevealGroup";

export const Route = createFileRoute("/demo/clippath-reveal")({
  component: ClipPathRevealPage,
});

function ClipPathRevealPage() {
  return <ClipPathRevealGroup />;
}
