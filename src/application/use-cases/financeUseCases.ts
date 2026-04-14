import type { FinanceRepository } from '../../domain/repositories/FinanceRepository';
import type { Expense, UserProfile } from '../../domain/entities/finance';
import { endOfMonth, differenceInCalendarDays, parseISO } from 'date-fns';

export function createFinanceUseCases(repository: FinanceRepository) {
  return {
    getProfile: () => repository.getProfile(),
    saveProfile: (profile: UserProfile) => repository.saveProfile(profile),
    listCategories: () => repository.listCategories(),
    listExpenses: () => repository.listExpenses(),
    createExpense: (input: Omit<Expense, 'id'>) => repository.createExpense(input),
    updateExpense: (expense: Expense) => repository.updateExpense(expense),
    deleteExpense: (id: string) => repository.deleteExpense(id),
    listGoals: () => repository.listGoals(),
    createGoal: (payload: { nombre: string; emoji: string; montoObjetivo: number }) =>
      repository.createGoal(payload),
    addGoalContribution: (goalId: string, amount: number) =>
      repository.addGoalContribution(goalId, amount),
    listPayrolls: () => repository.listPayrolls(),
    addPayroll: (payload: { mes: number; anio: number; ingresoNeto: number }) =>
      repository.addPayroll(payload),
    calculateBudgetSummary: async () => {
      const profile = await repository.getProfile();
      const categories = await repository.listCategories();
      const expenses = await repository.listExpenses();
      const now = new Date();
      const monthExpenses = expenses.filter((expense) => {
        const parsed = parseISO(expense.fecha);
        return parsed.getMonth() === now.getMonth() && parsed.getFullYear() === now.getFullYear();
      });

      const totals = {
        necesidad: 0,
        deseo: 0,
        ahorro: 0,
      };

      monthExpenses.forEach((expense) => {
        const category = categories.find((item) => item.id === expense.categoriaId);
        if (category) {
          totals[category.tipo] += expense.monto;
        }
      });

      const income = profile?.ingresoNeto ?? 0;
      const limits = {
        necesidad: Math.round(income * ((profile?.reglaNecesidades ?? 50) / 100)),
        deseo: Math.round(income * ((profile?.reglaDeseos ?? 30) / 100)),
        ahorro: Math.round(income * ((profile?.reglaAhorro ?? 20) / 100)),
      };

      const today = new Date();
      const remainingDays = Math.max(1, differenceInCalendarDays(endOfMonth(today), today) + 1);
      const dailyFlow = Math.floor((limits.deseo - totals.deseo) / remainingDays);

      return {
        totals,
        limits,
        dailyFlow,
        recentExpenses: monthExpenses.sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 5),
      };
    },
    exportExpensesCsv: async () => {
      const expenses = await repository.listExpenses();
      const header = 'id,fecha,monto,categoriaId,descripcion,porcentajeMio';
      const rows = expenses.map(
        (item) =>
          `${item.id},${item.fecha},${item.monto},${item.categoriaId},"${item.descripcion.replaceAll('"', "'")}",${item.porcentajeMio}`,
      );
      return `${header}\n${rows.join('\n')}`;
    },
  };
}

export type FinanceUseCases = ReturnType<typeof createFinanceUseCases>;
