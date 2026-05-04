import { createFileRoute } from "@tanstack/react-router";
import { CounterCountdownGroup } from "@/demo/components/CounterCountdownGroup";

export const Route = createFileRoute("/demo/counter-countdown")({
  component: CounterCountdownPage,
});

function CounterCountdownPage() {
  return <CounterCountdownGroup />;
}
