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
            "flex h-10 w-full rounded-xl border border-[#414754]/30 bg-[#181c21] px-4 py-2 text-sm text-[#e0e2ea] placeholder:text-[#8b90a0] focus:outline-none focus:ring-2 focus:ring-[#0070f3] transition-all disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-[#ffb4ab] focus:ring-[#ffb4ab]",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-[#ffb4ab]">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
