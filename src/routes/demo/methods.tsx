import { createFileRoute } from "@tanstack/react-router";
import MethodsGroup from "@/demo/components/MethodsGroup";

export const Route = createFileRoute("/demo/methods")({
  component: MethodsPage,
});

function MethodsPage() {
  return <MethodsGroup />;
}
