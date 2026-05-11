import { type ReactNode } from "react";

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
  return (
    <div className={`w-full space-y-10 ${className}`}>
      <div className="flex items-center gap-4 mb-6">
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-demo-border to-transparent" />
        <h2 className="landing-font-display text-lg text-demo-text tracking-tight flex items-center gap-3">
          <span className="w-1.5 h-6 bg-demo-accent rounded-full" />
          {title}
        </h2>
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-demo-border to-transparent" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children}
      </div>
    </div>
  );
};
