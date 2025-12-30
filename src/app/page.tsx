'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { DrillCard } from '@/components/drill/drill-card';
import { CreateDrillCard } from '@/components/drill/create-drill-card';
import { CreateDrillModal } from '@/components/drill/create-drill-modal';
import { EditDrillModal } from '@/components/drill/edit-drill-modal';
import { useDrills } from '@/hooks/use-drills';
import { useUsers } from '@/hooks/use-users';
import { useUserDrills } from '@/hooks/use-userdrills';
import type { DrillDto, UserDrillDto } from '@/lib/api-client';

type ClientDrillDto = Omit<DrillDto, 'users'> & { users: UserDrillDto[] };

export default function Home() {
  const { drills, isLoading: drillsLoading } = useDrills();
  const { users, isLoading: usersLoading } = useUsers();
  const { userDrills, isLoading: userDrillsLoading } = useUserDrills('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDrill, setSelectedDrill] = useState<ClientDrillDto | null>(null);

  const handleEdit = (drill: ClientDrillDto) => {
    setSelectedDrill(drill);
    setIsEditModalOpen(true);
  };

  const isLoading = drillsLoading || usersLoading || userDrillsLoading;

  const drillsWithSessions = useMemo(() => {
    return drills
      .map((drill) => {
        const drillSessions = userDrills.filter((ud) => ud.drillId === drill.id);

        return {
          ...drill,
          users: drillSessions,
        } as ClientDrillDto;
      })
      .sort((a, b) => (a.id || 0) - (b.id || 0));
  }, [drills, userDrills]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-cyan)] mx-auto mb-4" />
              <p className="text-[var(--foreground-muted)]">Loading...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {drillsWithSessions.map((drill) => (
              <DrillCard
                key={drill.id}
                drill={drill}
                availableUsers={users}
                onEdit={handleEdit}
              />
            ))}
            <CreateDrillCard onClick={() => setIsCreateModalOpen(true)} />
          </div>
        )}
      </main>

      <Footer />

      <CreateDrillModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
      <EditDrillModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        drill={selectedDrill}
      />
    </div>
  );
}
