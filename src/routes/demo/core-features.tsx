import { createFileRoute } from "@tanstack/react-router";
import { CoreFeaturesGroup } from "@/demo-examples/components/CoreFeaturesGroup";

export const Route = createFileRoute("/demo/core-features")({
  component: CoreFeaturesPage,
});

function CoreFeaturesPage() {
  return <CoreFeaturesGroup />;
}
