"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, onCheckedChange, disabled, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative inline-flex h-[22px] w-[38px] shrink-0 items-center rounded-full transition-colors duration-200 focus-ring disabled:opacity-40 disabled:cursor-not-allowed",
          checked ? "bg-primary" : "bg-white/[0.10]",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "inline-block h-[16px] w-[16px] transform rounded-full bg-white shadow-subtle transition-transform duration-200",
            checked ? "translate-x-[19px]" : "translate-x-[3px]"
          )}
        />
      </button>
    );
  }
);
Switch.displayName = "Switch";

export { Switch };
