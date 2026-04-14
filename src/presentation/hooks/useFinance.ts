import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDependencies } from '../app/useDependencies';
import type { Expense, UserProfile } from '../../domain/entities/finance';

export function useProfile() {
  const { finance } = useDependencies();
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => finance.getProfile(),
  });
}

export function useSaveProfile() {
  const queryClient = useQueryClient();
  const { finance } = useDependencies();
  return useMutation({
    mutationFn: (profile: UserProfile) => finance.saveProfile(profile),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['profile'] });
      void queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
  });
}

export function useCategories() {
  const { finance } = useDependencies();
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => finance.listCategories(),
  });
}

export function useExpenses() {
  const { finance } = useDependencies();
  return useQuery({
    queryKey: ['expenses'],
    queryFn: () => finance.listExpenses(),
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  const { finance } = useDependencies();
  return useMutation({
    mutationFn: (expense: Omit<Expense, 'id'>) => finance.createExpense(expense),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['expenses'] });
      void queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  const { finance } = useDependencies();
  return useMutation({
    mutationFn: (id: string) => finance.deleteExpense(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['expenses'] });
      void queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
  });
}

export function useSummary() {
  const { finance } = useDependencies();
  return useQuery({
    queryKey: ['summary'],
    queryFn: () => finance.calculateBudgetSummary(),
  });
}

export function useGoals() {
  const { finance } = useDependencies();
  return useQuery({
    queryKey: ['goals'],
    queryFn: () => finance.listGoals(),
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();
  const { finance } = useDependencies();
  return useMutation({
    mutationFn: (payload: { nombre: string; emoji: string; montoObjetivo: number }) =>
      finance.createGoal(payload),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['goals'] }),
  });
}

export function useAddGoalContribution() {
  const queryClient = useQueryClient();
  const { finance } = useDependencies();
  return useMutation({
    mutationFn: (payload: { goalId: string; amount: number }) =>
      finance.addGoalContribution(payload.goalId, payload.amount),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['goals'] }),
  });
}

export function usePayrolls() {
  const { finance } = useDependencies();
  return useQuery({
    queryKey: ['payrolls'],
    queryFn: () => finance.listPayrolls(),
  });
}

export function useAddPayroll() {
  const queryClient = useQueryClient();
  const { finance } = useDependencies();
  return useMutation({
    mutationFn: (payload: { mes: number; anio: number; ingresoNeto: number }) => finance.addPayroll(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['payrolls'] });
      void queryClient.invalidateQueries({ queryKey: ['profile'] });
      void queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
  });
}
