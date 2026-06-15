import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-xl border border-[color:var(--outline-variant)] bg-[color:var(--surface-container-low)] px-4 py-2 text-sm text-[color:var(--on-surface)] placeholder:text-[color:var(--on-surface-variant)] focus:outline-none focus:ring-2 focus:ring-[#0070f3] transition-all disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500/60 focus:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
