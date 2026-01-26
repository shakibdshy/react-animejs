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
    <section
      className={`bg-[#12121a] border border-[#2a2a3a] rounded-2xl p-6 transition-all duration-300 hover:border-indigo-500 hover:shadow-[0_0_30px_rgba(99,102,241,0.1)] ${className}`}
    >
      <h3 className="text-lg font-semibold text-indigo-400 mb-6 pb-3 border-b border-[#2a2a3a]">
        {title}
      </h3>
      <div className="flex flex-col items-center gap-6">{children}</div>
    </section>
  );
}
