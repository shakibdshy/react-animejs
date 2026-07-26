import { createFileRoute, Outlet } from '@tanstack/react-router';

/**
 * Layout route for /demos. Filter state (q/cat/sort/tag) lives in the URL
 * search params and is read/written by useDemoFilter via useSearch/useNavigate.
 * No validateSearch is declared here so that existing <Link to="/demos"> call
 * sites across the codebase are not forced to provide a search prop; the hook
 * coerces raw params with sensible defaults instead.
 *
 * Because these params live on the parent /demos route, they survive
 * navigation between the index and /demos/$componentId detail pages.
 */
/** Route seam that keeps the gallery index and component details independently renderable. */
export const Route = createFileRoute('/demos')({
  component: DemosLayout,
});

function DemosLayout() {
  return <Outlet />;
}
