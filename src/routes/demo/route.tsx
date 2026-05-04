import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AnimeProvider } from "@/lib/react-animejs/index";

export const Route = createFileRoute("/demo")({
  component: DemoLayout,
});

function DemoLayout() {
  return (
    <AnimeProvider>
      <div className="min-h-screen bg-demo-bg text-demo-text p-8 font-sans">
        <Outlet />
      </div>
    </AnimeProvider>
  );
}
