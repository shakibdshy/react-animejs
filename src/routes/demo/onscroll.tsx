import { createFileRoute } from "@tanstack/react-router";
import { OnScrollGroup } from "@/demo-examples/components/onscroll";

export const Route = createFileRoute("/demo/onscroll")({
  component: OnScrollPage,
});

function OnScrollPage() {
  return <OnScrollGroup />;
}
