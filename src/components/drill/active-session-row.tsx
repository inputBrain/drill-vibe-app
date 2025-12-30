'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { calculateDuration, formatDuration, parseDate } from '@/lib/utils';
import { useTimer } from '@/hooks/use-timer';
import { Square, Play } from 'lucide-react';
import type { UserDrillDto } from '@/types';

interface ActiveSessionRowProps {
  session: UserDrillDto;
  onStop: (userId: number) => void;
}

export function ActiveSessionRow({ session, onStop }: ActiveSessionRowProps) {
  const currentTime = useTimer();
  const isActive = session.stoppedAt === null;

  const duration = calculateDuration(session.startedAt, session.stoppedAt, currentTime);
  const formattedDuration = formatDuration(duration);

  if (!session.user) {
    console.error('ActiveSessionRow: session.user is undefined', session);
  }

  const userName = session.user
    ? `${session.user.firstName} ${session.user.lastName}`
    : `User #${session.userId}`;

  return (
    <div className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-[var(--background-secondary)] transition-colors">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {isActive && (
          <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
        )}
        {!isActive && (
          <Play className="flex-shrink-0 h-3 w-3 text-[var(--foreground-muted)]" />
        )}
        <span className="text-sm truncate">
          {userName}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant={isActive ? 'active' : 'completed'}>
          {isActive ? 'Active' : 'Completed'}
        </Badge>

        <span className="text-sm font-mono tabular-nums min-w-[80px] text-right">
          {formattedDuration}
        </span>

        {isActive && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onStop(session.userId)}
            className="ml-1 text-[var(--danger)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10"
            title="Stop session"
          >
            <Square className="h-5 w-5 fill-current" />
          </Button>
        )}
      </div>
    </div>
  );
}
