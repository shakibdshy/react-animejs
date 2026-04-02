import { createFileRoute } from "@tanstack/react-router";
import { CoreFeaturesGroup } from "@/lib/react-animejs/demo/components/CoreFeaturesGroup";

export const Route = createFileRoute("/demo/core-features")({
  component: CoreFeaturesPage,
});

function CoreFeaturesPage() {
  return <CoreFeaturesGroup />;
}
