export type BudgetType = 'necesidad' | 'deseo' | 'ahorro';

export type UserProfile = {
  id: string;
  nombre: string;
  ingresoNeto: number;
  reglaNecesidades: number;
  reglaDeseos: number;
  reglaAhorro: number;
};

export type Category = {
  id: string;
  nombre: string;
  emoji: string;
  tipo: BudgetType;
  color: string;
};

export type Expense = {
  id: string;
  categoriaId: string;
  monto: number;
  descripcion: string;
  fecha: string;
  porcentajeMio: number;
};

export type SavingGoal = {
  id: string;
  nombre: string;
  emoji: string;
  montoObjetivo: number;
  montoActual: number;
};

export type PayrollRecord = {
  id: string;
  mes: number;
  anio: number;
  ingresoNeto: number;
};
