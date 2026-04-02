import { createFileRoute } from "@tanstack/react-router";
import { CallbacksGroup } from "@/lib/react-animejs/demo/components/CallbacksGroup";

export const Route = createFileRoute("/demo/callbacks")({
  component: CallbacksPage,
});

function CallbacksPage() {
  return <CallbacksGroup />;
}
