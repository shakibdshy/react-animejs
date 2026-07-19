import { createFileRoute } from "@tanstack/react-router";
import MethodsGroup from "@/demo-examples/components/MethodsGroup";

export const Route = createFileRoute("/demo/methods")({
  component: MethodsPage,
});

function MethodsPage() {
  return <MethodsGroup />;
}
