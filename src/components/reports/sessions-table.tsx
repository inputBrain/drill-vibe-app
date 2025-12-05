'use client';

import { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  calculateCost,
  calculateDuration,
  formatCost,
  formatDate,
  formatDuration,
} from '@/lib/utils';
import { useTimer } from '@/hooks/use-timer';
import { Trash2, Square, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import type { UserDrillDto } from '@/types';
import { useUserDrills } from '@/hooks/use-userdrills';
import { useDrills } from '@/hooks/use-drills';

type SortField = 'startedAt' | 'stoppedAt' | 'user' | 'drill' | 'duration' | 'pricePerMinute' | 'cost';
type SortDirection = 'asc' | 'desc';

interface SessionsTableProps {
  userDrills: UserDrillDto[];
}

export function SessionsTable({ userDrills }: SessionsTableProps) {
  const currentTime = useTimer();
  const { deleteUserDrill } = useUserDrills();
  const { stopDrill } = useDrills();
  const [sortField, setSortField] = useState<SortField>('startedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [deletingSessionId, setDeletingSessionId] = useState<number | null>(null);
  const [stoppingSessionId, setStoppingSessionId] = useState<number | null>(null);
  const [confirmDeleteSessionId, setConfirmDeleteSessionId] = useState<number | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedUserDrills = useMemo(() => {
    return [...userDrills].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'startedAt':
          comparison = new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime();
          break;
        case 'stoppedAt':
          // Active sessions (null stoppedAt) should be first when sorting descending
          if (a.stoppedAt === null && b.stoppedAt === null) {
            comparison = 0;
          } else if (a.stoppedAt === null) {
            comparison = 1; // a is active, put it after when asc, before when desc
          } else if (b.stoppedAt === null) {
            comparison = -1; // b is active
          } else {
            comparison = new Date(a.stoppedAt).getTime() - new Date(b.stoppedAt).getTime();
          }
          break;
        case 'user':
          const nameA = a.user ? `${a.user.firstName} ${a.user.lastName}` : '';
          const nameB = b.user ? `${b.user.firstName} ${b.user.lastName}` : '';
          comparison = nameA.localeCompare(nameB);
          break;
        case 'drill':
          const drillA = a.drill?.title || '';
          const drillB = b.drill?.title || '';
          comparison = drillA.localeCompare(drillB);
          break;
        case 'duration':
          const durationA = calculateDuration(a.startedAt, a.stoppedAt, currentTime);
          const durationB = calculateDuration(b.startedAt, b.stoppedAt, currentTime);
          comparison = durationA - durationB;
          break;
        case 'pricePerMinute':
          const priceA = a.drill?.pricePerMinute || 0;
          const priceB = b.drill?.pricePerMinute || 0;
          comparison = priceA - priceB;
          break;
        case 'cost':
          const costA = a.drill ? calculateCost(calculateDuration(a.startedAt, a.stoppedAt, currentTime), a.drill.pricePerMinute) : 0;
          const costB = b.drill ? calculateCost(calculateDuration(b.startedAt, b.stoppedAt, currentTime), b.drill.pricePerMinute) : 0;
          comparison = costA - costB;
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [userDrills, sortField, sortDirection, currentTime]);

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

  const grandTotal = sortedUserDrills.reduce(
    (acc, ud) => {
      if (!ud.drill) {
        console.error('SessionsTable grandTotal: ud.drill is undefined', ud);
        return acc;
      }
      const duration = calculateDuration(ud.startedAt, ud.stoppedAt, currentTime);
      const cost = calculateCost(duration, ud.drill.pricePerMinute);
      return {
        duration: acc.duration + duration,
        cost: acc.cost + cost,
      };
    },
    { duration: 0, cost: 0 }
  );

  return (
    <div className="rounded-xl border border-[var(--border)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[var(--background-secondary)] border-b border-[var(--border)]">
              <th
                className="text-left p-4 font-semibold cursor-pointer hover:text-[var(--accent-cyan)] transition-colors"
                onClick={() => handleSort('user')}
              >
                Користувач
                <SortIcon field="user" />
              </th>
              <th
                className="text-left p-4 font-semibold cursor-pointer hover:text-[var(--accent-cyan)] transition-colors"
                onClick={() => handleSort('drill')}
              >
                Drill
                <SortIcon field="drill" />
              </th>
              <th
                className="text-left p-4 font-semibold cursor-pointer hover:text-[var(--accent-cyan)] transition-colors"
                onClick={() => handleSort('startedAt')}
              >
                Початок
                <SortIcon field="startedAt" />
              </th>
              <th
                className="text-left p-4 font-semibold cursor-pointer hover:text-[var(--accent-cyan)] transition-colors"
                onClick={() => handleSort('stoppedAt')}
              >
                Зупинка
                <SortIcon field="stoppedAt" />
              </th>
              <th
                className="text-right p-4 font-semibold cursor-pointer hover:text-[var(--accent-cyan)] transition-colors"
                onClick={() => handleSort('duration')}
              >
                Тривалість
                <SortIcon field="duration" />
              </th>
              <th
                className="text-right p-4 font-semibold cursor-pointer hover:text-[var(--accent-cyan)] transition-colors"
                onClick={() => handleSort('pricePerMinute')}
              >
                Ціна/хв
                <SortIcon field="pricePerMinute" />
              </th>
              <th
                className="text-right p-4 font-semibold cursor-pointer hover:text-[var(--accent-cyan)] transition-colors"
                onClick={() => handleSort('cost')}
              >
                Вартість
                <SortIcon field="cost" />
              </th>
              <th className="text-center p-4 font-semibold w-32">Дії</th>
            </tr>
          </thead>
          <tbody>
            {userDrills.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-[var(--foreground-muted)]">
                  Немає даних
                </td>
              </tr>
            ) : (
              sortedUserDrills.map((ud) => {
                if (!ud.drill) {
                  console.error('SessionsTable row: ud.drill is undefined', ud);
                  return null;
                }

                const duration = calculateDuration(ud.startedAt, ud.stoppedAt, currentTime);
                const cost = calculateCost(duration, ud.drill.pricePerMinute);
                const isActive = ud.stoppedAt === null;

                const userName = ud.user
                  ? `${ud.user.firstName} ${ud.user.lastName}`
                  : `User #${ud.userId}`;
                const drillTitle = ud.drill?.title || `Drill #${ud.drillId}`;

                return (
                  <tr
                    key={ud.id}
                    className="border-b border-[var(--border)] hover:bg-[var(--background-secondary)] transition-colors"
                  >
                    <td className="p-4">
                      {userName}
                    </td>
                    <td className="p-4">{drillTitle}</td>
                    <td className="p-4 font-mono text-sm">
                      {formatDate(ud.startedAt)}
                    </td>
                    <td className="p-4">
                      {isActive ? (
                        <Badge variant="active">Active</Badge>
                      ) : (
                        <span className="font-mono text-sm">
                          {formatDate(ud.stoppedAt!)}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right font-mono">
                      {formatDuration(duration)}
                    </td>
                    <td className="p-4 text-right font-mono">
                      {ud.drill.pricePerMinute} грн
                    </td>
                    <td className="p-4 text-right font-mono text-[var(--success)]">
                      {formatCost(cost)} грн
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={async () => {
                            if (!isActive || stoppingSessionId === ud.id) return;
                            setStoppingSessionId(ud.id);
                            try {
                              await stopDrill({ drillId: ud.drillId, userIds: [ud.userId] });
                            } finally {
                              setStoppingSessionId(null);
                            }
                          }}
                          disabled={!isActive || stoppingSessionId === ud.id}
                          className={
                            stoppingSessionId === ud.id
                              ? 'text-[var(--danger)] bg-[var(--danger)]/30 animate-pulse cursor-wait'
                              : isActive
                              ? 'text-[var(--danger)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10'
                              : 'opacity-30 cursor-not-allowed'
                          }
                          title={
                            stoppingSessionId === ud.id
                              ? 'Зупинка...'
                              : isActive
                              ? 'Stop session'
                              : 'Session already stopped'
                          }
                        >
                          {stoppingSessionId === ud.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--danger)]" />
                          ) : (
                            <Square className={isActive ? 'h-4 w-4 fill-current' : 'h-4 w-4'} />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={async () => {
                            if (deletingSessionId === ud.id) return;

                            if (confirmDeleteSessionId === ud.id) {
                              // Second click - delete
                              setDeletingSessionId(ud.id);
                              setConfirmDeleteSessionId(null);
                              try {
                                await deleteUserDrill(ud.userId, ud.drillId);
                              } finally {
                                setDeletingSessionId(null);
                              }
                            } else {
                              // First click - ask for confirmation
                              setConfirmDeleteSessionId(ud.id);
                              setTimeout(() => setConfirmDeleteSessionId(null), 3000);
                            }
                          }}
                          disabled={deletingSessionId === ud.id}
                          className={
                            deletingSessionId === ud.id
                              ? 'text-[var(--danger)] bg-[var(--danger)]/30 animate-pulse cursor-wait'
                              : confirmDeleteSessionId === ud.id
                              ? 'text-[var(--danger)] bg-[var(--danger)]/20 hover:bg-[var(--danger)]/30 animate-pulse'
                              : 'text-[var(--danger)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10'
                          }
                        >
                          <span className="sr-only">
                            {deletingSessionId === ud.id
                              ? 'Видалення сесії...'
                              : confirmDeleteSessionId === ud.id
                              ? 'Натисніть ще раз для підтвердження видалення'
                              : 'Видалити сесію'}
                          </span>
                          <div className="relative group">
                            {deletingSessionId === ud.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--danger)]" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[var(--card-background)] border border-[var(--border)] rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-50">
                              {deletingSessionId === ud.id
                                ? '⏳ Видалення...'
                                : confirmDeleteSessionId === ud.id
                                ? '⚠️ Клікни ще раз для підтвердження'
                                : '🗑️ Видалити сесію'}
                              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[var(--border)]" />
                            </div>
                          </div>
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          {userDrills.length > 0 && (
            <tfoot>
              <tr className="bg-[var(--card-background)] font-semibold">
                <td colSpan={4} className="p-4">
                  Загальний підсумок:
                </td>
                <td className="p-4 text-right font-mono">
                  {formatDuration(grandTotal.duration)}
                </td>
                <td className="p-4"></td>
                <td className="p-4 text-right font-mono text-[var(--success)]">
                  {formatCost(grandTotal.cost)} грн
                </td>
                <td className="p-4"></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
