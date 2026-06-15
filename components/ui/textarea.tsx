import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          className={cn(
            "flex min-h-[120px] w-full rounded-lg border border-[color:var(--outline-variant)] bg-[color:var(--surface-container-low)] px-3 py-2 text-sm text-[color:var(--on-surface)] placeholder:text-[color:var(--on-surface-variant)] focus:outline-none focus:ring-2 focus:ring-[#0070f3] disabled:cursor-not-allowed disabled:opacity-50",
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
Textarea.displayName = "Textarea";

export { Textarea };
