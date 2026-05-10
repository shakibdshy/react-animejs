import React, { memo } from "react";
import { cn } from "@/landing/utils/cn";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionLabel = memo(function SectionLabel({
  children,
  className,
}: SectionLabelProps) {
  return (
    <p
      className={cn(
        "landing-font-mono text-xs tracking-widest uppercase text-landing-accent mb-3",
        className,
      )}
    >
      {children}
    </p>
  );
});
