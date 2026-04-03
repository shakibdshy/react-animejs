import { createFileRoute } from "@tanstack/react-router";
import { CounterCountdownGroup } from "@/lib/react-animejs/demo/components/CounterCountdownGroup";

export const Route = createFileRoute("/demo/counter-countdown")({
  component: CounterCountdownPage,
});

function CounterCountdownPage() {
  return <CounterCountdownGroup />;
}
