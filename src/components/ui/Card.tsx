import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'glass' | 'solid';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'glass', ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'rounded-xl border p-4 transition-all duration-300',
                    {
                        'glass-panel border-white/10 shadow-lg backdrop-blur-md': variant === 'glass',
                        'bg-[--color-surface-100] border-[--border-color]': variant === 'solid',
                    },
                    className
                )}
                {...props}
            />
        );
    }
);
Card.displayName = 'Card';
