import { createFileRoute } from "@tanstack/react-router";
import { SvgFeaturesGroup } from "@/demo/components/SvgFeaturesGroup";

export const Route = createFileRoute("/demo/svg")({
  component: SvgPage,
});

function SvgPage() {
  return <SvgFeaturesGroup />;
}
