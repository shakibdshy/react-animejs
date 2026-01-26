import type { ReactNode } from "react";

interface DemoSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

/**
 * Reusable wrapper for demo sections to ensure consistent layout and styling
 */
export function DemoSection({
  title,
  children,
  className = "",
}: DemoSectionProps) {
  return (
    <section className={`demo-section ${className}`}>
      <h3>{title}</h3>
      <div className="demo-content">{children}</div>
    </section>
  );
}
