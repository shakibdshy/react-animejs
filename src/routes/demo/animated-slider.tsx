import { createFileRoute } from "@tanstack/react-router";
import { AnimatedSliderGroup } from "@/demo-examples/components/AnimatedSliderGroup";

export const Route = createFileRoute("/demo/animated-slider")({
  component: AnimatedSliderPage,
});

function AnimatedSliderPage() {
  return <AnimatedSliderGroup />;
}
