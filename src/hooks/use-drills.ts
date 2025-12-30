'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, type CreateDrill, type StartDrill, type StopDrill, type UpdateDrill, type DeleteDrill } from '@/lib/api-client';
import { useToast } from '@/components/providers/toast-provider';

export function useDrills() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const drillsQuery = useQuery({
    queryKey: ['drills'],
    queryFn: async () => {
      const response = await apiClient.listAllDrills();
      return response || [];
    },
    refetchInterval: 30000,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateDrill) => apiClient.createDrill(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['drills'] });
      success('Drill успішно створено!');
    },
    onError: (err) => {
      error(`Помилка при створенні drill: ${err.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateDrill) => apiClient.updateDrill(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['drills'] });
      success('Drill успішно оновлено!');
    },
    onError: (err) => {
      error(`Помилка при оновленні drill: ${err.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (drillId: number) => apiClient.deleteDrill({ drillId } as DeleteDrill),
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
    mutationFn: (data: StartDrill) => apiClient.startDrill(data),
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
    mutationFn: (data: StopDrill) => apiClient.stopDrill(data),
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
