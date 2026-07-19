import { createFileRoute } from "@tanstack/react-router";
import { ReorderListDemoGroup } from "@/demo-examples/components/ReorderListDemoGroup";

export const Route = createFileRoute("/demo/reorder-list")({
  component: ReorderListPage,
});

function ReorderListPage() {
  return <ReorderListDemoGroup />;
}
