'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { Trash2, Edit, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import type { UserDto } from '@/types';
import { useUsers } from '@/hooks/use-users';

type SortField = 'id' | 'firstName' | 'lastName' | 'email' | 'createdAt';
type SortDirection = 'asc' | 'desc';

interface UsersTableProps {
  users: UserDto[];
  onEdit: (user: UserDto) => void;
}

export function UsersTable({ users, onEdit }: UsersTableProps) {
  const { deleteUser } = useUsers();
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  const [confirmDeleteUserId, setConfirmDeleteUserId] = useState<number | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'id':
          comparison = a.id - b.id;
          break;
        case 'firstName':
          comparison = a.firstName.localeCompare(b.firstName);
          break;
        case 'lastName':
          comparison = a.lastName.localeCompare(b.lastName);
          break;
        case 'email':
          const emailA = a.email || '';
          const emailB = b.email || '';
          comparison = emailA.localeCompare(emailB);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [users, sortField, sortDirection]);

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

  return (
    <div className="rounded-xl border border-[var(--border)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[var(--background-secondary)] border-b border-[var(--border)]">
              <th
                className="text-left p-4 font-semibold cursor-pointer hover:text-[var(--accent-cyan)] transition-colors"
                onClick={() => handleSort('id')}
              >
                ID
                <SortIcon field="id" />
              </th>
              <th
                className="text-left p-4 font-semibold cursor-pointer hover:text-[var(--accent-cyan)] transition-colors"
                onClick={() => handleSort('firstName')}
              >
                Ім'я
                <SortIcon field="firstName" />
              </th>
              <th
                className="text-left p-4 font-semibold cursor-pointer hover:text-[var(--accent-cyan)] transition-colors"
                onClick={() => handleSort('lastName')}
              >
                Прізвище
                <SortIcon field="lastName" />
              </th>
              <th
                className="text-left p-4 font-semibold cursor-pointer hover:text-[var(--accent-cyan)] transition-colors"
                onClick={() => handleSort('email')}
              >
                Email
                <SortIcon field="email" />
              </th>
              <th
                className="text-left p-4 font-semibold cursor-pointer hover:text-[var(--accent-cyan)] transition-colors"
                onClick={() => handleSort('createdAt')}
              >
                Дата створення
                <SortIcon field="createdAt" />
              </th>
              <th className="text-center p-4 font-semibold w-32">Дії</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-[var(--foreground-muted)]">
                  Немає користувачів
                </td>
              </tr>
            ) : (
              sortedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-[var(--border)] hover:bg-[var(--background-secondary)] transition-colors"
                >
                  <td className="p-4 font-mono text-sm text-[var(--foreground-muted)]">
                    {user.id}
                  </td>
                  <td className="p-4">{user.firstName}</td>
                  <td className="p-4">{user.lastName}</td>
                  <td className="p-4">
                    {user.email ? (
                      <span className="text-[var(--foreground-muted)]">{user.email}</span>
                    ) : (
                      <span className="text-[var(--foreground-muted)] italic">Не вказано</span>
                    )}
                  </td>
                  <td className="p-4 font-mono text-sm">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(user)}
                        className="text-[var(--accent-cyan)] hover:text-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)]/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                          if (deletingUserId === user.id) return;

                          if (confirmDeleteUserId === user.id) {
                            setDeletingUserId(user.id);
                            setConfirmDeleteUserId(null);
                            try {
                              await deleteUser(user.id);
                            } finally {
                              setDeletingUserId(null);
                            }
                          } else {
                            setConfirmDeleteUserId(user.id);
                            setTimeout(() => setConfirmDeleteUserId(null), 3000);
                          }
                        }}
                        disabled={deletingUserId === user.id}
                        className={
                          deletingUserId === user.id
                            ? 'text-[var(--danger)] bg-[var(--danger)]/30 animate-pulse cursor-wait'
                            : confirmDeleteUserId === user.id
                            ? 'text-[var(--danger)] bg-[var(--danger)]/20 hover:bg-[var(--danger)]/30 animate-pulse'
                            : 'text-[var(--danger)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10'
                        }
                      >
                        <span className="sr-only">
                          {deletingUserId === user.id
                            ? 'Видалення користувача...'
                            : confirmDeleteUserId === user.id
                            ? 'Натисніть ще раз для підтвердження видалення'
                            : 'Видалити користувача'}
                        </span>
                        <div className="relative group">
                          {deletingUserId === user.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--danger)]" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[var(--card-background)] border border-[var(--border)] rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-50">
                            {deletingUserId === user.id
                              ? '⏳ Видалення...'
                              : confirmDeleteUserId === user.id
                              ? '⚠️ Клікни ще раз для підтвердження'
                              : '🗑️ Видалити користувача'}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[var(--border)]" />
                          </div>
                        </div>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
