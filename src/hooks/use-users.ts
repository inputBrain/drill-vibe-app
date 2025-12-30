'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, type CreateUser, type UpdateUser, type DeleteUser } from '@/lib/api-client';
import { useToast } from '@/components/providers/toast-provider';

export function useUsers() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await apiClient.listAllUsers();
      return response || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateUser) => apiClient.createUser(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      success('Користувача успішно створено!');
    },
    onError: (err) => {
      error(`Помилка при створенні користувача: ${err.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateUser) => apiClient.updateUser(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      success('Користувача успішно оновлено!');
    },
    onError: (err) => {
      error(`Помилка при оновленні користувача: ${err.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (userId: number) => apiClient.deleteUser({ userId } as DeleteUser),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      success('Користувача успішно видалено!');
    },
    onError: (err) => {
      error(`Помилка при видаленні користувача: ${err.message}`);
    },
  });

  return {
    users: usersQuery.data || [],
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    createUser: (data: CreateUser) => createMutation.mutate(data),
    updateUser: (data: UpdateUser) => updateMutation.mutate(data),
    deleteUser: (userId: number) => deleteMutation.mutate(userId),
  };
}
