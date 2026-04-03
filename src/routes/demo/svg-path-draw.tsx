import { createFileRoute } from "@tanstack/react-router";
import { SvgPathDrawGroup } from "@/lib/react-animejs/demo/components/SvgPathDrawGroup";

export const Route = createFileRoute("/demo/svg-path-draw")({
  component: SvgPathDrawPage,
});

function SvgPathDrawPage() {
  return <SvgPathDrawGroup />;
}
