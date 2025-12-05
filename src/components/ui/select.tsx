'use client';

import { cn } from '@/lib/utils';
import { Check, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { UserDto } from '@/types';

interface MultiSelectProps {
  users: UserDto[];
  selectedUserIds: number[];
  onChange: (userIds: number[]) => void;
  placeholder?: string;
}

export function MultiSelect({
  users,
  selectedUserIds,
  onChange,
  placeholder = 'Select users...',
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleUser = (userId: number) => {
    if (selectedUserIds.includes(userId)) {
      onChange(selectedUserIds.filter((id) => id !== userId));
    } else {
      onChange([...selectedUserIds, userId]);
    }
  };

  const selectedUsers = users.filter((user) =>
    selectedUserIds.includes(user.id)
  );

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between gap-2 rounded-lg border border-[var(--border)]',
          'bg-[var(--background-secondary)] px-4 py-2.5 text-sm',
          'hover:border-[var(--accent-cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-cyan)]',
          'transition-colors'
        )}
      >
        <span className="flex-1 text-left truncate">
          {selectedUsers.length > 0
            ? selectedUsers
                .map((u) => `${u.firstName} ${u.lastName}`)
                .join(', ')
            : placeholder}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-[var(--foreground-muted)] transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--card-background)] shadow-xl max-h-60 overflow-y-auto">
          {users.length === 0 ? (
            <div className="px-4 py-3 text-sm text-[var(--foreground-muted)]">
              No users available
            </div>
          ) : (
            users.map((user) => {
              const isSelected = selectedUserIds.includes(user.id);
              return (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => toggleUser(user.id)}
                  className={cn(
                    'w-full flex items-center gap-2 px-4 py-2.5 text-sm',
                    'hover:bg-[var(--background-secondary)] transition-colors',
                    isSelected && 'bg-[var(--accent-blue)]/10'
                  )}
                >
                  <div
                    className={cn(
                      'flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center',
                      isSelected
                        ? 'bg-[var(--accent-cyan)] border-[var(--accent-cyan)]'
                        : 'border-[var(--border)]'
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3 text-black" />}
                  </div>
                  <span className="flex-1 text-left">
                    {user.firstName} {user.lastName}
                  </span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
