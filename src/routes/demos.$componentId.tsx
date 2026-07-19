import { createFileRoute, Link } from '@tanstack/react-router';
import {
  ComponentDetailPage,
  ComponentGalleryShell,
  demoSections,
  isDemoId,
} from '@/component-gallery';

export const Route = createFileRoute('/demos/$componentId')({
  component: ComponentDetailRoute,
});

function ComponentDetailRoute() {
  const { componentId } = Route.useParams();

  if (!isDemoId(componentId)) {
    return (
      <ComponentGalleryShell>
        <main className="min-h-screen pt-32 px-6">
          <div className="max-w-2xl mx-auto rounded-2xl border border-landing-border bg-landing-surface p-8">
            <p className="landing-font-mono text-sm text-landing-accent mb-3">Unknown component</p>
            <h1 className="landing-font-display text-4xl mb-4">That component is not in this catalog.</h1>
            <Link to="/demos" className="landing-font-mono text-sm text-landing-muted hover:text-landing-accent transition-colors">
              Return to Components
            </Link>
          </div>
        </main>
      </ComponentGalleryShell>
    );
  }

  const demo = demoSections.find((item) => item.componentId === componentId);
  if (!demo) return null;

  return <ComponentDetailPage demo={demo} />;
}
