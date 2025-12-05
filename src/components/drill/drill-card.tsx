'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MultiSelect } from '@/components/ui/select';
import { ActiveSessionRow } from './active-session-row';
import { Edit, Trash2 } from 'lucide-react';
import type { DrillDto, UserDto } from '@/types';
import { useDrills } from '@/hooks/use-drills';

interface DrillCardProps {
  drill: DrillDto;
  availableUsers: UserDto[];
  onEdit: (drill: DrillDto) => void;
}

export function DrillCard({ drill, availableUsers, onEdit }: DrillCardProps) {
  const { startDrill, stopDrill, deleteDrill } = useDrills();
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get active sessions (only users with stoppedAt === null)
  const activeSessions = drill.users?.filter((ud) => ud.stoppedAt === null) || [];

  // Get users that have active sessions in this drill
  const activeUserIds = activeSessions.map((ud) => ud.userId);

  // Users can be selected if they don't have an ACTIVE session
  const selectableUsers = availableUsers.filter(
    (user) => !activeUserIds.includes(user.id)
  );

  const handleStart = async () => {
    if (selectedUserIds.length > 0) {
      setIsStarting(true);
      try {
        await startDrill({ drillId: drill.id, userIds: selectedUserIds });
        setSelectedUserIds([]);
      } finally {
        setIsStarting(false);
      }
    }
  };

  const handleStopUser = (userId: number) => {
    stopDrill({ drillId: drill.id, userIds: [userId] });
  };

  const handleStopAll = async () => {
    const activeUserIds = activeSessions.map((s) => s.userId);
    if (activeUserIds.length > 0) {
      setIsStopping(true);
      try {
        await stopDrill({ drillId: drill.id, userIds: activeUserIds });
      } finally {
        setIsStopping(false);
      }
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return; // Prevent multiple clicks

    if (showDeleteConfirm) {
      setIsDeleting(true);
      try {
        await deleteDrill(drill.id);
        setShowDeleteConfirm(false);
      } finally {
        setIsDeleting(false);
      }
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  return (
    <Card className="flex flex-col min-h-[520px]">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold truncate">{drill.title}</h3>
            <p className="text-sm text-[var(--foreground-muted)]">
              {drill.pricePerMinute} грн/хв
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(drill)}
              className="text-[var(--accent-cyan)] hover:text-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)]/10"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className={
                isDeleting
                  ? 'text-[var(--danger)] bg-[var(--danger)]/30 animate-pulse cursor-wait'
                  : showDeleteConfirm
                  ? 'text-[var(--danger)] bg-[var(--danger)]/20 hover:bg-[var(--danger)]/30 animate-pulse'
                  : 'text-[var(--danger)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10'
              }
            >
              <span className="sr-only">
                {isDeleting
                  ? 'Видалення drill...'
                  : showDeleteConfirm
                  ? 'Натисніть ще раз для підтвердження видалення'
                  : 'Видалити drill'}
              </span>
              <div className="relative group">
                {isDeleting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--danger)]" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[var(--card-background)] border border-[var(--border)] rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-50">
                  {isDeleting
                    ? '⏳ Видалення...'
                    : showDeleteConfirm
                    ? '⚠️ Натисти ще раз для підтвердження'
                    : '🗑️ Видалити drill'}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[var(--border)]" />
                </div>
              </div>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {/* Active Users Section */}
        <div>
          <h4 className="text-sm font-medium mb-2 text-[var(--foreground-muted)]">
            Active Users:
          </h4>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {activeSessions.length === 0 ? (
              <p className="text-sm text-[var(--foreground-muted)] text-center py-4">
                No active users
              </p>
            ) : (
              activeSessions.map((session) => (
                <ActiveSessionRow
                  key={session.id}
                  session={session}
                  onStop={handleStopUser}
                />
              ))
            )}
          </div>
        </div>

        {/* Add Users Section */}
        <div>
          <h4 className="text-sm font-medium mb-2 text-[var(--foreground-muted)]">
            Add Users:
          </h4>
          <MultiSelect
            users={selectableUsers}
            selectedUserIds={selectedUserIds}
            onChange={setSelectedUserIds}
            placeholder="Select users..."
          />
        </div>
      </CardContent>

      <CardFooter>
        <Button
          variant="secondary"
          size="md"
          className="flex-1 border-[var(--success)]/30 hover:border-[var(--success)] hover:bg-[var(--success)]/10 disabled:opacity-50 disabled:hover:border-[var(--border)]"
          onClick={handleStart}
          disabled={selectedUserIds.length === 0 || isStarting}
        >
          {isStarting ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--success)]" />
              STARTING...
            </div>
          ) : (
            'START'
          )}
        </Button>
        <Button
          variant="secondary"
          size="md"
          className="flex-1 border-[var(--danger)]/30 hover:border-[var(--danger)] hover:bg-[var(--danger)]/10 disabled:opacity-50 disabled:hover:border-[var(--border)]"
          onClick={handleStopAll}
          disabled={activeSessions.length === 0 || isStopping}
        >
          {isStopping ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--danger)]" />
              STOPPING...
            </div>
          ) : (
            'STOP ALL'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
