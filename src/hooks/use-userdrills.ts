'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, type DeleteUserDrill } from '@/lib/api-client';
import { useToast } from '@/components/providers/toast-provider';

export function useUserDrills(filter?: 'all' | 'active' | 'completed') {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const queryFn = async () => {
    const allData = await apiClient.listAll();

    if (filter === 'active') {
      return (allData || []).filter(ud => ud.stoppedAt === null || ud.stoppedAt === undefined);
    }

    if (filter === 'completed') {
      return (allData || []).filter(ud => ud.stoppedAt !== null && ud.stoppedAt !== undefined);
    }

    return allData || [];
  };

  const userDrillsQuery = useQuery({
    queryKey: ['userdrills', filter || 'all'],
    queryFn: async () => {
      const data = await queryFn();

      if (data.length > 0) {
        const sample = data[0];
        console.log('📊 UserDrills sample:', {
          startedAt: sample.startedAt,
          startedAtType: typeof sample.startedAt,
          stoppedAt: sample.stoppedAt,
          stoppedAtType: typeof sample.stoppedAt,
          startedAtAsUnix: sample.startedAt ? new Date(Number(sample.startedAt) * 1000) : null,
          stoppedAtAsUnix: sample.stoppedAt ? new Date(Number(sample.stoppedAt) * 1000) : null,
        });
      }

      return data;
    },
    refetchInterval: 30000,
  });

  const deleteMutation = useMutation({
    mutationFn: ({ userId, drillId }: { userId: number; drillId: number }) =>
      apiClient.deleteUserDrill({ userId, drillId } as DeleteUserDrill),
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
