import { createFileRoute } from "@tanstack/react-router";
import ScopeGroup from "@/demo/components/ScopeGroup";

export const Route = createFileRoute("/demo/scope")({
  component: ScopePage,
});

function ScopePage() {
  return <ScopeGroup />;
}
