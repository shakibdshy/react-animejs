import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/landing";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return <LandingPage />;
}
