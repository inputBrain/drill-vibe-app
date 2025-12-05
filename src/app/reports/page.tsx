'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { SummaryTable } from '@/components/reports/summary-table';
import { SessionsTable } from '@/components/reports/sessions-table';
import { useUserDrills } from '@/hooks/use-userdrills';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'active' | 'completed';

export default function ReportsPage() {
  const [filter, setFilter] = useState<FilterType>('all');
  const { userDrills, isLoading } = useUserDrills(filter);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Звіти</h1>
            <p className="text-[var(--foreground-muted)]">
              Детальна інформація про всі drill сесії користувачів
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 border-b border-[var(--border)] pb-4">
            <Button
              variant={filter === 'all' ? 'primary' : 'secondary'}
              onClick={() => setFilter('all')}
              className={cn(
                filter === 'all' && 'shadow-lg shadow-[var(--accent-cyan)]/20'
              )}
            >
              Всі записи
            </Button>
            <Button
              variant={filter === 'active' ? 'primary' : 'secondary'}
              onClick={() => setFilter('active')}
              className={cn(
                filter === 'active' && 'shadow-lg shadow-[var(--accent-cyan)]/20'
              )}
            >
              Тільки Активні
            </Button>
            <Button
              variant={filter === 'completed' ? 'primary' : 'secondary'}
              onClick={() => setFilter('completed')}
              className={cn(
                filter === 'completed' &&
                  'shadow-lg shadow-[var(--accent-cyan)]/20'
              )}
            >
              Зупинені
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-cyan)] mx-auto mb-4" />
                <p className="text-[var(--foreground-muted)]">Loading...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Summary Statistics */}
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Підсумкова статистика
                </h2>
                <SummaryTable userDrills={userDrills} />
              </div>

              {/* Divider for visual separation */}
              <div className="border-t border-[var(--border)] my-8" />

              {/* All Sessions */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Всі сесії</h2>
                <SessionsTable userDrills={userDrills} />
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
