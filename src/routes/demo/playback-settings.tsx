import { createFileRoute } from "@tanstack/react-router";
import { PlaybackSettingsGroup } from "@/demo-examples/components/PlaybackSettingsGroup";

export const Route = createFileRoute("/demo/playback-settings")({
  component: PlaybackSettingsPage,
});

function PlaybackSettingsPage() {
  return <PlaybackSettingsGroup />;
}
