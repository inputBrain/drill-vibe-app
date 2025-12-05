import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'danger' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          {
            // Variants
            'bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-cyan)] text-white hover:opacity-90 hover:scale-105':
              variant === 'primary',
            'bg-[var(--success)] text-black hover:opacity-90 hover:scale-105':
              variant === 'success',
            'bg-[var(--danger)] text-white hover:opacity-90 hover:scale-105':
              variant === 'danger',
            'bg-[var(--card-background)] text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--accent-cyan)]':
              variant === 'secondary',
            'text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--card-background)]':
              variant === 'ghost',
            // Sizes
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 text-base': size === 'md',
            'h-12 px-6 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
