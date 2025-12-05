'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { CreateUser, UpdateUser } from '@/types';
import { useToast } from '@/components/providers/toast-provider';

export function useUsers() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: api.users.list,
  });

  const createMutation = useMutation({
    mutationFn: api.users.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      success('Користувача успішно створено!');
    },
    onError: (err) => {
      error(`Помилка при створенні користувача: ${err.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: api.users.update,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      success('Користувача успішно оновлено!');
    },
    onError: (err) => {
      error(`Помилка при оновленні користувача: ${err.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.users.delete,
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
