'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { CreateDrill, StartDrill, StopDrill, UpdateDrill } from '@/types';
import { useToast } from '@/components/providers/toast-provider';

export function useDrills() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const drillsQuery = useQuery({
    queryKey: ['drills'],
    queryFn: api.drills.list,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const createMutation = useMutation({
    mutationFn: api.drills.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['drills'] });
      success('Drill успішно створено!');
    },
    onError: (err) => {
      error(`Помилка при створенні drill: ${err.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: api.drills.update,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['drills'] });
      success('Drill успішно оновлено!');
    },
    onError: (err) => {
      error(`Помилка при оновленні drill: ${err.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.drills.delete,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['drills'] }),
        queryClient.invalidateQueries({ queryKey: ['userdrills'] }),
      ]);
      success('Drill успішно видалено!');
    },
    onError: (err) => {
      error(`Помилка при видаленні drill: ${err.message}`);
    },
  });

  const startMutation = useMutation({
    mutationFn: api.drills.start,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['drills'] }),
        queryClient.invalidateQueries({ queryKey: ['userdrills'] }),
      ]);
      success('Drill запущено!');
    },
    onError: (err) => {
      error(`Помилка при запуску drill: ${err.message}`);
    },
  });

  const stopMutation = useMutation({
    mutationFn: api.drills.stop,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['drills'] }),
        queryClient.invalidateQueries({ queryKey: ['userdrills'] }),
      ]);
      success('Drill зупинено!');
    },
    onError: (err) => {
      error(`Помилка при зупинці drill: ${err.message}`);
    },
  });

  return {
    drills: drillsQuery.data || [],
    isLoading: drillsQuery.isLoading,
    isError: drillsQuery.isError,
    createDrill: (data: CreateDrill) => createMutation.mutate(data),
    updateDrill: (data: UpdateDrill) => updateMutation.mutate(data),
    deleteDrill: (drillId: number) => deleteMutation.mutate(drillId),
    startDrill: (data: StartDrill) => startMutation.mutate(data),
    stopDrill: (data: StopDrill) => stopMutation.mutate(data),
  };
}
