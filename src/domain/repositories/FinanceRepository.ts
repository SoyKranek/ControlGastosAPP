import type {
  Category,
  Expense,
  PayrollRecord,
  SavingGoal,
  UserProfile,
} from '../entities/finance';

export type CreateExpenseInput = Omit<Expense, 'id'>;
export type CreateGoalInput = Omit<SavingGoal, 'id' | 'montoActual'>;

export interface FinanceRepository {
  getProfile(): Promise<UserProfile | null>;
  saveProfile(profile: UserProfile): Promise<void>;
  listCategories(): Promise<Category[]>;
  listExpenses(): Promise<Expense[]>;
  createExpense(input: CreateExpenseInput): Promise<Expense>;
  updateExpense(expense: Expense): Promise<Expense>;
  deleteExpense(id: string): Promise<void>;
  listGoals(): Promise<SavingGoal[]>;
  createGoal(input: CreateGoalInput): Promise<SavingGoal>;
  addGoalContribution(goalId: string, amount: number): Promise<SavingGoal>;
  listPayrolls(): Promise<PayrollRecord[]>;
  addPayroll(record: Omit<PayrollRecord, 'id'>): Promise<PayrollRecord>;
}
