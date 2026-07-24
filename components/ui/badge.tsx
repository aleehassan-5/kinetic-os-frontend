import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium leading-none",
  {
    variants: {
      variant: {
        default: "bg-white/[0.06] text-text-secondary border border-border",
        primary: "bg-primary-muted text-primary",
        secondary: "bg-secondary-muted text-secondary",
        success: "bg-success-muted text-success",
        warning: "bg-warning-muted text-warning",
        danger: "bg-danger-muted text-danger",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            variant === "success" && "bg-success",
            variant === "warning" && "bg-warning",
            variant === "danger" && "bg-danger",
            variant === "primary" && "bg-primary",
            variant === "secondary" && "bg-secondary",
            (!variant || variant === "default") && "bg-text-muted"
          )}
        />
      )}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
