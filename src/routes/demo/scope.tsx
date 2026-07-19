import { createFileRoute } from "@tanstack/react-router";
import ScopeGroup from "@/demo-examples/components/ScopeGroup";

export const Route = createFileRoute("/demo/scope")({
  component: ScopePage,
});

function ScopePage() {
  return <ScopeGroup />;
}
