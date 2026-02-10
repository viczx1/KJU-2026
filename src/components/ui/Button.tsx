import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
                    {
                        'bg-[--color-primary] text-white hover:bg-[--color-secondary]': variant === 'primary',
                        'bg-[--color-surface-300] text-white hover:bg-[--color-surface-200]': variant === 'secondary',
                        'border border-[--border-color] bg-transparent hover:bg-[--color-surface-100] text-[--foreground]': variant === 'outline',
                        'hover:bg-[--color-surface-100] text-[--foreground]': variant === 'ghost',
                        'bg-[--color-danger] text-white hover:opacity-90': variant === 'danger',
                        'h-9 px-4 py-2 text-sm': size === 'sm',
                        'h-10 px-6 py-2': size === 'md',
                        'h-12 px-8 text-lg': size === 'lg',
                        'h-10 w-10': size === 'icon',
                    },
                    className
                )}
                {...props}
            />
        );
    }
);

Button.displayName = 'Button';
