import { createFileRoute } from "@tanstack/react-router";
import { OnScrollGroup } from "@/lib/react-animejs/demo/components/OnScrollGroup";

export const Route = createFileRoute("/demo/onscroll")({
  component: OnScrollPage,
});

function OnScrollPage() {
  return <OnScrollGroup />;
}
