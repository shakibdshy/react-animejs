/**
 * React Anime.js Demo Route
 */

import { createFileRoute } from "@tanstack/react-router";
import { ReactAnimejsDemo } from "@/lib/react-animejs/demo";

export const Route = createFileRoute("/demo/animejs")({
  component: AnimejsDemoPage,
});

function AnimejsDemoPage() {
  return <ReactAnimejsDemo />;
}
