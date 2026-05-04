import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresenceGroup } from "@/demo/components/AnimatePresenceGroup";

export const Route = createFileRoute("/demo/animate-presence")({
  component: AnimatePresencePage,
});

function AnimatePresencePage() {
  return <AnimatePresenceGroup />;
}
