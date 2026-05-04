import { createFileRoute } from "@tanstack/react-router";
import { EasingsGroup } from "@/demo/components/EasingsGroup";

export const Route = createFileRoute("/demo/easings")({
  component: EasingsPage,
});

function EasingsPage() {
  return <EasingsGroup />;
}
