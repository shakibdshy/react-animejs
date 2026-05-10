import { memo } from "react";
import { cn } from "@/landing/utils/cn";
import { useMagnetic } from "@/landing/hooks/use-magnetic";

interface MagneticAreaProps {
  strength?: number;
  className?: string;
}

export const MagneticArea = memo(function MagneticArea({
  strength = 0.4,
  className,
}: MagneticAreaProps) {
  const { areaRef, dotRef, onMouseMove, onMouseLeave } = useMagnetic({
    strength,
  });

  return (
    <div
      ref={areaRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={cn(
        "w-30 h-30 rounded-full border border-dashed border-landing-border",
        "flex items-center justify-center relative cursor-pointer",
        "hover:border-landing-accent transition-colors duration-200",
        className,
      )}
      role="button"
      aria-label="Magnetic interaction area"
      tabIndex={0}
    >
      <div
        ref={dotRef}
        className="w-6 h-6 rounded-full bg-landing-accent"
      />
    </div>
  );
});
