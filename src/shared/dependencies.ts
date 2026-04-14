import { createFinanceUseCases } from '../application/use-cases/financeUseCases';
import { LocalFinanceRepository } from '../infrastructure/repositories/LocalFinanceRepository';

export function buildDependencies() {
  const repository = new LocalFinanceRepository();
  const finance = createFinanceUseCases(repository);

  return {
    repository,
    finance,
  };
}

export type AppDependencies = ReturnType<typeof buildDependencies>;
