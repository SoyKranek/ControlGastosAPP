import { describe, expect, it } from 'vitest';
import { createFinanceUseCases } from './financeUseCases';
import type { FinanceRepository } from '../../domain/repositories/FinanceRepository';
import type { Expense, PayrollRecord, SavingGoal, UserProfile } from '../../domain/entities/finance';
import { DEFAULT_CATEGORIES } from '../../shared/constants/categories';

function createFakeRepository(): FinanceRepository {
  let profile: UserProfile | null = null;
  const expenses: Expense[] = [];
  const goals: SavingGoal[] = [];
  const payrolls: PayrollRecord[] = [];

  return {
    getProfile: async () => profile,
    saveProfile: async (nextProfile) => {
      profile = nextProfile;
    },
    listCategories: async () => DEFAULT_CATEGORIES,
    listExpenses: async () => expenses,
    createExpense: async (input) => {
      const expense = { ...input, id: `exp-${expenses.length + 1}` };
      expenses.push(expense);
      return expense;
    },
    updateExpense: async (expense) => expense,
    deleteExpense: async () => undefined,
    listGoals: async () => goals,
    createGoal: async (input) => {
      const goal = { ...input, id: `goal-${goals.length + 1}`, montoActual: 0 };
      goals.push(goal);
      return goal;
    },
    addGoalContribution: async (goalId, amount) => {
      const goal = goals.find((item) => item.id === goalId);
      if (!goal) {
        throw new Error('goal not found');
      }
      goal.montoActual += amount;
      return goal;
    },
    listPayrolls: async () => payrolls,
    addPayroll: async (record) => {
      const payroll = { ...record, id: `pay-${payrolls.length + 1}` };
      payrolls.push(payroll);
      return payroll;
    },
  };
}

describe('financeUseCases', () => {
  it('calcula flujo del dia y limites para regla 50/30/20', async () => {
    const repository = createFakeRepository();
    const useCases = createFinanceUseCases(repository);

    await useCases.saveProfile({
      id: 'local-user',
      nombre: 'Henry',
      ingresoNeto: 1000000,
      reglaNecesidades: 50,
      reglaDeseos: 30,
      reglaAhorro: 20,
    });

    await useCases.createExpense({
      categoriaId: 'cat-restaurantes',
      monto: 50000,
      descripcion: 'Cena',
      fecha: new Date().toISOString().slice(0, 10),
      porcentajeMio: 100,
    });

    const summary = await useCases.calculateBudgetSummary();

    expect(summary.limits.deseo).toBe(300000);
    expect(summary.totals.deseo).toBe(50000);
    expect(summary.dailyFlow).toBeTypeOf('number');
  });
});
