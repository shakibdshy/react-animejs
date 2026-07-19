import { createFileRoute } from "@tanstack/react-router";
import SplitTextGroup from "@/demo-examples/components/SplitTextGroup";

export const Route = createFileRoute("/demo/split-text")({
  component: SplitTextPage,
});

function SplitTextPage() {
  return <SplitTextGroup />;
}
