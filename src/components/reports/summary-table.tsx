'use client';

import { useState, useMemo } from 'react';
import { calculateCost, calculateDuration, formatCost, formatDuration } from '@/lib/utils';
import { useTimer } from '@/hooks/use-timer';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import type { UserDrillDto } from '@/lib/api-client';

type SortField = 'drill' | 'sessions' | 'duration' | 'cost';
type SortDirection = 'asc' | 'desc';

interface SummaryTableProps {
  userDrills: UserDrillDto[];
}

interface DrillSummary {
  drillId: number;
  drillTitle: string;
  pricePerMinute: number;
  sessionCount: number;
  totalDuration: number;
  totalCost: number;
}

export function SummaryTable({ userDrills }: SummaryTableProps) {
  const currentTime = useTimer();
  const [sortField, setSortField] = useState<SortField>('drill');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 ml-1 inline opacity-30" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="h-4 w-4 ml-1 inline text-[var(--accent-cyan)]" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1 inline text-[var(--accent-cyan)]" />
    );
  };

  const summaries = useMemo(() => {
    const drillMap = new Map<number, DrillSummary>();

    userDrills.forEach((ud) => {
      if (!ud.drill) {
        console.error('SummaryTable: ud.drill is undefined', ud);
        return;
      }

      const duration = calculateDuration(ud.startedAt, ud.stoppedAt, currentTime);
      const cost = calculateCost(duration, ud.drill.pricePerMinute);

      if (!drillMap.has(ud.drillId)) {
        drillMap.set(ud.drillId, {
          drillId: ud.drillId,
          drillTitle: ud.drill.title || `Drill #${ud.drillId}`,
          pricePerMinute: ud.drill.pricePerMinute,
          sessionCount: 0,
          totalDuration: 0,
          totalCost: 0,
        });
      }

      const summary = drillMap.get(ud.drillId)!;
      summary.sessionCount += 1;
      summary.totalDuration += duration;
      summary.totalCost += cost;
    });

    const summariesArray = Array.from(drillMap.values());

    return summariesArray.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'drill':
          comparison = a.drillTitle.localeCompare(b.drillTitle);
          break;
        case 'sessions':
          comparison = a.sessionCount - b.sessionCount;
          break;
        case 'duration':
          comparison = a.totalDuration - b.totalDuration;
          break;
        case 'cost':
          comparison = a.totalCost - b.totalCost;
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [userDrills, currentTime, sortField, sortDirection]);

  const grandTotal = summaries.reduce(
    (acc, s) => ({
      sessions: acc.sessions + s.sessionCount,
      duration: acc.duration + s.totalDuration,
      cost: acc.cost + s.totalCost,
    }),
    { sessions: 0, duration: 0, cost: 0 }
  );

  return (
    <div className="rounded-xl border border-[var(--border)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[var(--background-secondary)] border-b border-[var(--border)]">
              <th
                className="text-left p-4 font-semibold cursor-pointer hover:text-[var(--accent-cyan)] transition-colors"
                onClick={() => handleSort('drill')}
              >
                Назва Drill
                <SortIcon field="drill" />
              </th>
              <th
                className="text-right p-4 font-semibold cursor-pointer hover:text-[var(--accent-cyan)] transition-colors"
                onClick={() => handleSort('sessions')}
              >
                Кількість сесій
                <SortIcon field="sessions" />
              </th>
              <th
                className="text-right p-4 font-semibold cursor-pointer hover:text-[var(--accent-cyan)] transition-colors"
                onClick={() => handleSort('duration')}
              >
                Загальний час
                <SortIcon field="duration" />
              </th>
              <th
                className="text-right p-4 font-semibold cursor-pointer hover:text-[var(--accent-cyan)] transition-colors"
                onClick={() => handleSort('cost')}
              >
                Вартість (грн)
                <SortIcon field="cost" />
              </th>
            </tr>
          </thead>
          <tbody>
            {summaries.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-[var(--foreground-muted)]">
                  Немає даних
                </td>
              </tr>
            ) : (
              summaries.map((summary) => (
                <tr
                  key={summary.drillId}
                  className="border-b border-[var(--border)] hover:bg-[var(--background-secondary)] transition-colors"
                >
                  <td className="p-4">{summary.drillTitle}</td>
                  <td className="p-4 text-right font-mono">{summary.sessionCount}</td>
                  <td className="p-4 text-right font-mono">
                    {formatDuration(summary.totalDuration)}
                  </td>
                  <td className="p-4 text-right font-mono text-[var(--success)]">
                    {formatCost(summary.totalCost)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {summaries.length > 0 && (
            <tfoot>
              <tr className="bg-[var(--card-background)] font-semibold">
                <td className="p-4">Загалом:</td>
                <td className="p-4 text-right font-mono">{grandTotal.sessions}</td>
                <td className="p-4 text-right font-mono">
                  {formatDuration(grandTotal.duration)}
                </td>
                <td className="p-4 text-right font-mono text-[var(--success)]">
                  {formatCost(grandTotal.cost)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
