import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

export type ShineBorderProps = {
  children: ReactNode;
  className?: string;
  borderWidth?: number;
  duration?: number;
  gradient?: string;
};

export const ShineBorder = ({
  children,
  className,
  borderWidth = 2,
  duration = 3,
  gradient = "from-[var(--color-accent)] via-white/20 to-[var(--color-accent-2)]",
}: ShineBorderProps) => {
  return (
    <div
      className={cn("relative rounded-2xl", className)}
      style={{ padding: borderWidth }}
    >
      {/* Animated Gradient Layer */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        <div
          className={cn(
            "absolute -inset-full blur-sm animate-spin",
            // Fallback for conic gradient if bg-conic plugin is missing in v4
            "bg-[conic-gradient(from_0deg,var(--tw-gradient-stops))]",
            gradient
          )}
          style={{ animationDuration: `${duration}s` }}
        />
      </div>

      {/* Content Layer */}
      <div className="relative rounded-2xl bg-[var(--color-bg)] h-full w-full">
        {children}
      </div>
    </div>
  );
};
