import { createFileRoute } from "@tanstack/react-router";
import { SpinningCubeGroup } from "@/demo-examples/components/SpinningCubeGroup";

export const Route = createFileRoute("/demo/spinning-cube")({
  component: SpinningCubePage,
});

function SpinningCubePage() {
  return <SpinningCubeGroup />;
}
