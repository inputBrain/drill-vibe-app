'use client';

import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface CreateDrillCardProps {
  onClick: () => void;
}

export function CreateDrillCard({ onClick }: CreateDrillCardProps) {
  return (
    <Card
      className="flex flex-col items-center justify-center min-h-[420px] cursor-pointer hover:scale-105 transition-all"
      onClick={onClick}
    >
      <Plus className="h-12 w-12 text-[var(--accent-cyan)] mb-4" />
      <p className="text-lg font-medium text-[var(--foreground-muted)]">
        Додати новий Drill
      </p>
    </Card>
  );
}
