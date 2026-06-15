import type { SVGProps } from "react";

export function XLogo({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M18.244 2H21.5l-7.11 8.128L22.75 22h-6.55l-5.131-6.699L5.21 22H1.95l7.604-8.69L1.5 2h6.716l4.638 6.117L18.244 2Zm-1.144 18.08h1.803L7.22 3.82H5.286L17.1 20.08Z" />
    </svg>
  );
}
