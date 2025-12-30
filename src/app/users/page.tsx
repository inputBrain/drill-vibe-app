'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { UsersTable } from '@/components/users/users-table';
import { CreateUserDialog } from '@/components/users/create-user-dialog';
import { EditUserDialog } from '@/components/users/edit-user-dialog';
import { useUsers } from '@/hooks/use-users';
import { Plus } from 'lucide-react';
import type { UserDto } from '@/lib/api-client';

export default function UsersPage() {
  const { users, isLoading } = useUsers();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);

  const handleEdit = (user: UserDto) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Користувачі</h1>
              <p className="text-[var(--foreground-muted)]">
                Управління користувачами системи
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => setIsCreateDialogOpen(true)}
              className="shadow-lg shadow-[var(--accent-cyan)]/20"
            >
              <Plus className="h-5 w-5 mr-2" />
              Створити
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
            <UsersTable users={users} onEdit={handleEdit} />
          )}
        </div>
      </main>

      <Footer />

      <CreateUserDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
      <EditUserDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        user={selectedUser}
      />
    </div>
  );
}
