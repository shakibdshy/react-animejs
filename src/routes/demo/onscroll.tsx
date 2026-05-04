import { createFileRoute } from "@tanstack/react-router";
import { OnScrollGroup } from "@/demo/components/OnScrollGroup";

export const Route = createFileRoute("/demo/onscroll")({
  component: OnScrollPage,
});

function OnScrollPage() {
  return <OnScrollGroup />;
}
