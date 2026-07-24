import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-control border bg-white/[0.03] px-3.5 text-[14px] text-text-primary transition-colors duration-200",
        "placeholder:text-text-muted",
        "border-border hover:border-border-strong focus:border-primary focus:bg-white/[0.02]",
        error && "border-danger/50 focus:border-danger",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label ref={ref} className={cn("text-[13px] font-medium text-text-secondary", className)} {...props} />
  )
);
Label.displayName = "Label";

export { Input, Label };
