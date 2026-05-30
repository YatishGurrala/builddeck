import * as React from 'react';
import { cn } from '@/lib/utils';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', asChild = false, children, ...props }, ref) => {
    const classes = cn(
      'inline-flex items-center justify-center rounded-xl font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50',
      variant === 'default' && 'bg-slate-950 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-950',
      variant === 'secondary' && 'bg-slate-100 text-slate-950 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-50',
      variant === 'outline' && 'border border-slate-200 bg-transparent text-slate-950 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-50',
      variant === 'ghost' && 'bg-transparent text-slate-950 hover:bg-slate-100 dark:text-slate-50 dark:hover:bg-slate-800',
      size === 'sm' && 'h-8 px-3 text-sm',
      size === 'md' && 'h-10 px-4 text-sm',
      size === 'lg' && 'h-12 px-5 text-base',
      className,
    );

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        className: cn((children.props as { className?: string }).className, classes),
      });
    }

    return (
      <button
        ref={ref}
        className={classes}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';