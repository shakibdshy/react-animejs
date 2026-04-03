import { createFileRoute } from "@tanstack/react-router";
import { ClipPathRevealGroup } from "@/lib/react-animejs/demo/components/ClipPathRevealGroup";

export const Route = createFileRoute("/demo/clippath-reveal")({
  component: ClipPathRevealPage,
});

function ClipPathRevealPage() {
  return <ClipPathRevealGroup />;
}
