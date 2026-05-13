import { createFileRoute } from "@tanstack/react-router";
import { OnScrollGroup } from "@/demo/components/onscroll";

export const Route = createFileRoute("/demo/onscroll")({
  component: OnScrollPage,
});

function OnScrollPage() {
  return <OnScrollGroup />;
}
