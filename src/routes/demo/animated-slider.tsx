import { createFileRoute } from "@tanstack/react-router";
import { AnimatedSliderGroup } from "@/lib/react-animejs/demo/components/AnimatedSliderGroup";

export const Route = createFileRoute("/demo/animated-slider")({
  component: AnimatedSliderPage,
});

function AnimatedSliderPage() {
  return <AnimatedSliderGroup />;
}
