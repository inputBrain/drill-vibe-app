'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Drill } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/reports', label: 'Reports' },
    { href: '/users', label: 'Users' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--background-secondary)] backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Drill className="h-6 w-6 text-[var(--accent-cyan)]" />
          <span className="bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-cyan)] bg-clip-text text-transparent">
            Drill Management
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-[var(--accent-cyan)]',
                pathname === item.href
                  ? 'text-[var(--accent-cyan)]'
                  : 'text-[var(--foreground-muted)]'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
