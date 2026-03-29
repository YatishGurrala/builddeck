import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#0070f3]/20 text-[#aec6ff]",
        secondary: "bg-[#31353b] text-[#c1c6d7]",
        success: "bg-[#3ce36a]/20 text-[#3ce36a]",
        warning: "bg-yellow-500/20 text-yellow-400",
        destructive: "bg-[#ffb4ab]/20 text-[#ffb4ab]",
        outline: "border border-[#414754] text-[#c1c6d7]",
        purple: "bg-[#6807ba]/20 text-[#dbb8ff]",
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
