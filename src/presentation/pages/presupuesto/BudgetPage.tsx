import { useSummary } from '../../hooks/useFinance';
import { formatCOP } from '../../../shared/utils/currency';

export function BudgetPage() {
  const summaryQuery = useSummary();
  const summary = summaryQuery.data;

  return (
    <section className="grid-cols-2">
      <article className="card card-hero">
        <p className="eyebrow">Analitica mensual</p>
        <h2>Presupuesto mensual</h2>
        <p>Compara lo ideal vs lo real para ajustar tus decisiones a tiempo.</p>
      </article>
      <article className="card stat-need">
        <h3>Necesidades</h3>
        <p className="support-text">Gastos obligatorios del mes.</p>
        <p>
          Real: {formatCOP(summary?.totals.necesidad ?? 0)} | Ideal:{' '}
          {formatCOP(summary?.limits.necesidad ?? 0)}
        </p>
      </article>
      <article className="card stat-want">
        <h3>Deseos</h3>
        <p className="support-text">Consumo flexible y estilo de vida.</p>
        <p>
          Real: {formatCOP(summary?.totals.deseo ?? 0)} | Ideal: {formatCOP(summary?.limits.deseo ?? 0)}
        </p>
      </article>
      <article className="card stat-save">
        <h3>Ahorro</h3>
        <p className="support-text">Construccion de metas y fondo de seguridad.</p>
        <p>
          Real: {formatCOP(summary?.totals.ahorro ?? 0)} | Ideal:{' '}
          {formatCOP(summary?.limits.ahorro ?? 0)}
        </p>
      </article>
    </section>
  );
}
