import { createFileRoute } from "@tanstack/react-router";
import { DemosPage } from "@/demos";

export const Route = createFileRoute("/demos")({
  component: DemosPage,
});
