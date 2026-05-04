import { createFileRoute } from "@tanstack/react-router";
import { AnimePresenceGroup } from "@/demo/components/AnimePresenceGroup";

export const Route = createFileRoute("/demo/animate-presence")({
  component: AnimePresencePage,
});

function AnimePresencePage() {
  return <AnimePresenceGroup />;
}
