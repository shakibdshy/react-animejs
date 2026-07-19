import { createFileRoute } from "@tanstack/react-router";
import { SvgPathDrawGroup } from "@/demo-examples/components/SvgPathDrawGroup";

export const Route = createFileRoute("/demo/svg-path-draw")({
  component: SvgPathDrawPage,
});

function SvgPathDrawPage() {
  return <SvgPathDrawGroup />;
}
