'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useToast } from '@/components/providers/toast-provider';

export function useUserDrills(filter?: 'all' | 'active' | 'completed') {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const queryFn =
    filter === 'active'
      ? api.userDrills.active
      : filter === 'completed'
      ? api.userDrills.completed
      : api.userDrills.list;

  const userDrillsQuery = useQuery({
    queryKey: ['userdrills', filter || 'all'],
    queryFn: async () => {
      const data = await queryFn();

      // Debug: log first item to check date format
      if (data.length > 0) {
        const sample = data[0];
        console.log('📊 UserDrills sample:', {
          startedAt: sample.startedAt,
          startedAtType: typeof sample.startedAt,
          stoppedAt: sample.stoppedAt,
          stoppedAtType: typeof sample.stoppedAt,
          // Try parsing as Unix timestamp (seconds)
          startedAtAsUnix: sample.startedAt ? new Date(Number(sample.startedAt) * 1000) : null,
          stoppedAtAsUnix: sample.stoppedAt ? new Date(Number(sample.stoppedAt) * 1000) : null,
        });
      }

      return data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });

  const deleteMutation = useMutation({
    mutationFn: ({ userId, drillId }: { userId: number; drillId: number }) =>
      api.userDrills.delete(userId, drillId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['userdrills'] }),
        queryClient.invalidateQueries({ queryKey: ['drills'] }),
      ]);
      success('Сесію успішно видалено!');
    },
    onError: (err) => {
      error(`Помилка при видаленні сесії: ${err.message}`);
    },
  });

  return {
    userDrills: userDrillsQuery.data || [],
    isLoading: userDrillsQuery.isLoading,
    isError: userDrillsQuery.isError,
    deleteUserDrill: (userId: number, drillId: number) =>
      deleteMutation.mutate({ userId, drillId }),
  };
}
