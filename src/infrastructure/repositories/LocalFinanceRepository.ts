import type {
  CreateExpenseInput,
  CreateGoalInput,
  FinanceRepository,
} from '../../domain/repositories/FinanceRepository';
import type { Expense, PayrollRecord, SavingGoal, UserProfile } from '../../domain/entities/finance';
import { DEFAULT_CATEGORIES } from '../../shared/constants/categories';

type LocalData = {
  profile: UserProfile | null;
  expenses: Expense[];
  goals: SavingGoal[];
  payrolls: PayrollRecord[];
};

const STORAGE_KEY = 'flujo.local.data';

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function readData(): LocalData {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {
      profile: null,
      expenses: [],
      goals: [],
      payrolls: [],
    };
  }
  return JSON.parse(raw) as LocalData;
}

function writeData(data: LocalData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export class LocalFinanceRepository implements FinanceRepository {
  async getProfile() {
    return readData().profile;
  }

  async saveProfile(profile: UserProfile) {
    const data = readData();
    writeData({ ...data, profile });
  }

  async listCategories() {
    return DEFAULT_CATEGORIES;
  }

  async listExpenses() {
    return readData().expenses;
  }

  async createExpense(input: CreateExpenseInput) {
    const expense: Expense = { ...input, id: createId('exp') };
    const data = readData();
    writeData({ ...data, expenses: [expense, ...data.expenses] });
    return expense;
  }

  async updateExpense(expense: Expense) {
    const data = readData();
    const next = data.expenses.map((item) => (item.id === expense.id ? expense : item));
    writeData({ ...data, expenses: next });
    return expense;
  }

  async deleteExpense(id: string) {
    const data = readData();
    writeData({ ...data, expenses: data.expenses.filter((item) => item.id !== id) });
  }

  async listGoals() {
    return readData().goals;
  }

  async createGoal(input: CreateGoalInput) {
    const goal: SavingGoal = {
      ...input,
      id: createId('goal'),
      montoActual: 0,
    };
    const data = readData();
    writeData({ ...data, goals: [goal, ...data.goals] });
    return goal;
  }

  async addGoalContribution(goalId: string, amount: number) {
    const data = readData();
    let updatedGoal: SavingGoal | null = null;
    const goals = data.goals.map((goal) => {
      if (goal.id !== goalId) {
        return goal;
      }
      updatedGoal = { ...goal, montoActual: goal.montoActual + amount };
      return updatedGoal;
    });
    writeData({ ...data, goals });
    if (!updatedGoal) {
      throw new Error('Meta no encontrada');
    }
    return updatedGoal;
  }

  async listPayrolls() {
    return readData().payrolls;
  }

  async addPayroll(record: Omit<PayrollRecord, 'id'>) {
    const payroll = { ...record, id: createId('pay') };
    const data = readData();
    writeData({ ...data, payrolls: [payroll, ...data.payrolls] });
    return payroll;
  }
}
