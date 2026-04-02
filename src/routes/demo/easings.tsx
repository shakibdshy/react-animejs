import { createFileRoute } from "@tanstack/react-router";
import { EasingsGroup } from "@/lib/react-animejs/demo/components/EasingsGroup";

export const Route = createFileRoute("/demo/easings")({
  component: EasingsPage,
});

function EasingsPage() {
  return <EasingsGroup />;
}
