import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant = 'default', ...props }, ref) => {
        return (
            <span
                ref={ref}
                className={cn(
                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider',
                    {
                        'bg-[--color-surface-300] text-[--foreground]': variant === 'default',
                        'bg-[--color-success]/20 text-[--color-success] border border-[--color-success]/30': variant === 'success',
                        'bg-[--color-warning]/20 text-[--color-warning] border border-[--color-warning]/30': variant === 'warning',
                        'bg-[--color-danger]/20 text-[--color-danger] border border-[--color-danger]/30': variant === 'danger',
                        'bg-[--color-accent]/20 text-[--color-accent] border border-[--color-accent]/30': variant === 'info',
                    },
                    className
                )}
                {...props}
            />
        );
    }
);
Badge.displayName = 'Badge';
