import { createFileRoute } from "@tanstack/react-router";
import SplitTextGroup from "@/demo/components/SplitTextGroup";

export const Route = createFileRoute("/demo/split-text")({
  component: SplitTextPage,
});

function SplitTextPage() {
  return <SplitTextGroup />;
}
