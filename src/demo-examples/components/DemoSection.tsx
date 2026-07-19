import { Children, type ReactNode } from "react";

interface DemoSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export const DemoSection: React.FC<DemoSectionProps> = ({
  title,
  children,
  className = "",
}) => {
  const items = Children.toArray(children);

  return (
    <section className={`demo-example-section w-full ${className}`}>
      <header className="mb-6 flex items-end justify-between gap-6 border-b border-landing-border pb-4">
        <div>
          <p className="mb-2 landing-font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-landing-accent">
            Interactive example
          </p>
          <h2 className="landing-font-display text-2xl tracking-tight text-landing-fg sm:text-3xl">
            {title}
          </h2>
        </div>
        <span className="hidden shrink-0 rounded-full border border-landing-border px-3 py-1 landing-font-mono text-[10px] uppercase tracking-[0.16em] text-landing-muted sm:inline">
          Live controls
        </span>
      </header>

      <div className="demo-example-grid grid grid-cols-1 gap-6 xl:grid-cols-2">
        {items.map((child, index) => (
          <div className="demo-example-item" key={index}>
            {child}
          </div>
        ))}
      </div>
    </section>
  );
};
