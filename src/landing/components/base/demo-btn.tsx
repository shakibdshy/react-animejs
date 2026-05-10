import React, { memo } from "react";
import { cn } from "@/landing/utils/cn";

interface DemoBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "filled" | "outline";
  children: React.ReactNode;
}

export const DemoBtn = memo(function DemoBtn({
  variant = "filled",
  children,
  className,
  ...props
}: DemoBtnProps) {
  return (
    <button
      className={cn(
        "px-6 py-2.5 rounded-full border-none text-[13px] font-semibold cursor-pointer",
        "transition-transform duration-200 hover:scale-105 active:scale-95",
        variant === "filled"
          ? "bg-landing-accent text-landing-bg"
          : "bg-transparent text-landing-fg border border-landing-border",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});
