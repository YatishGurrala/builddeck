import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-normal transition-colors",
  {
    variants: {
      variant: {
        default: "border-[#0070f3]/25 bg-[#0070f3]/22 text-[#0a4ea3] dark:border-[#7cb6ff]/35 dark:bg-[#0070f3]/30 dark:text-[#cfe3ff]",
        secondary: "border-[color:var(--outline-variant)] bg-[color:var(--surface-container-high)] text-[color:var(--on-surface-variant)]",
        success: "border-emerald-500/30 bg-emerald-500/22 text-emerald-800 dark:border-emerald-400/40 dark:bg-emerald-500/30 dark:text-emerald-100",
        warning: "border-amber-500/30 bg-amber-500/22 text-amber-800 dark:border-amber-400/40 dark:bg-amber-500/30 dark:text-amber-100",
        destructive: "border-red-500/30 bg-red-500/22 text-red-800 dark:border-red-400/40 dark:bg-red-500/30 dark:text-red-100",
        outline: "border border-[color:var(--outline-variant)] text-[color:var(--on-surface-variant)]",
        purple: "border-violet-500/30 bg-violet-500/22 text-violet-800 dark:border-violet-400/40 dark:bg-violet-500/30 dark:text-violet-100",
        cyan: "border-cyan-500/30 bg-cyan-500/22 text-cyan-800 dark:border-cyan-400/40 dark:bg-cyan-500/30 dark:text-cyan-100",
        active: "border-emerald-300 bg-emerald-100 text-[#111827] dark:border-emerald-400/40 dark:bg-emerald-500/30 dark:text-emerald-100",
        published: "border-emerald-400 bg-emerald-200 text-[#111827] dark:border-emerald-500/45 dark:bg-emerald-700/34 dark:text-emerald-100",
        draft: "border-slate-300 bg-slate-200 text-[#111827] dark:border-[color:var(--outline-variant)] dark:bg-[color:var(--surface-container-high)] dark:text-[color:var(--on-surface-variant)]",
        building: "border-orange-300 bg-orange-100 text-[#111827] dark:border-orange-400/40 dark:bg-orange-500/30 dark:text-orange-100",
        launched: "border-green-300 bg-green-100 text-[#111827] dark:border-green-400/40 dark:bg-green-500/30 dark:text-green-100",
        paused: "border-red-300 bg-red-100 text-[#111827] dark:border-red-400/40 dark:bg-red-500/30 dark:text-red-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
