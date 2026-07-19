import { createFileRoute, Outlet } from '@tanstack/react-router';

/** Route seam that keeps the gallery index and component details independently renderable. */
export const Route = createFileRoute('/demos')({
  component: DemosLayout,
});

function DemosLayout() {
  return <Outlet />;
}
