import React, { type ReactNode } from "react";

interface DemoSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

/**
 * Reusable wrapper for demo sections to ensure consistent layout and styling.
 * Follows the high-end design pattern with yellow accents.
 */
export const DemoSection: React.FC<DemoSectionProps> = ({
  title,
  children,
  className = "",
}) => {
  return (
    <div className={`w-full space-y-12 mt-16 ${className}`}>
      <div className="flex items-center gap-4 mb-8">
        <div className="h-[2px] flex-1 bg-linear-to-r from-transparent via-[#ffd11a]/20 to-transparent" />
        <h2 className="text-2xl font-black text-white uppercase tracking-[0.2em] flex items-center gap-4">
          <span className="w-2 h-8 bg-[#ffd11a] rounded-full" />
          {title}
        </h2>
        <div className="h-[2px] flex-1 bg-linear-to-r from-transparent via-[#ffd11a]/20 to-transparent" />
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-8">
        {children}
      </div>
    </div>
  );
};
