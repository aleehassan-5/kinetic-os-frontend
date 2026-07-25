"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-control text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-40 focus-ring active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-background shadow-subtle hover:bg-primary-hover",
        secondary:
          "bg-white/[0.06] text-text-primary border border-border hover:bg-white/[0.09] hover:border-border-strong",
        ghost:
          "text-text-secondary hover:text-text-primary hover:bg-white/[0.05]",
        danger:
          "bg-danger/10 text-danger border border-danger/20 hover:bg-danger/15",
        outline:
          "border border-border text-text-primary hover:border-border-strong hover:bg-white/[0.03]",
      },
      size: {
        sm: "h-8 px-3 text-[13px]",
        md: "h-9 px-4",
        lg: "h-11 px-5 text-[15px]",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
