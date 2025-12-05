import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'active' | 'completed' | 'default';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold',
          {
            'bg-[var(--success)]/20 text-[var(--success)]': variant === 'active',
            'bg-[var(--foreground-muted)]/20 text-[var(--foreground-muted)]':
              variant === 'completed',
            'bg-[var(--accent-blue)]/20 text-[var(--accent-cyan)]':
              variant === 'default',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';
