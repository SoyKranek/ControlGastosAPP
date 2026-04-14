import { useState } from 'react';
import { useAddGoalContribution, useCreateGoal, useGoals } from '../../hooks/useFinance';
import { formatCOP } from '../../../shared/utils/currency';
import type { FormEvent } from 'react';

export function SavingsPage() {
  const goalsQuery = useGoals();
  const createGoal = useCreateGoal();
  const contribute = useAddGoalContribution();
  const goals = goalsQuery.data ?? [];
  const [nombre, setNombre] = useState('Fondo de emergencia');
  const [emoji, setEmoji] = useState('🎯');
  const [montoObjetivo, setMontoObjetivo] = useState(1000000);
  const [abono, setAbono] = useState(50000);

  const handleCreateGoal = async (event: FormEvent) => {
    event.preventDefault();
    await createGoal.mutateAsync({ nombre, emoji, montoObjetivo });
  };

  return (
    <section className="grid-cols-2">
      <article className="card">
        <p className="eyebrow">Planifica</p>
        <h2>Nueva meta</h2>
        <p className="support-text">Define una meta clara y empieza con pequeños abonos.</p>
        <form className="grid-form" onSubmit={handleCreateGoal}>
          <label>
            Nombre
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </label>
          <label>
            Emoji
            <input value={emoji} onChange={(e) => setEmoji(e.target.value)} required />
          </label>
          <label>
            Monto objetivo
            <input
              type="number"
              min={0}
              value={montoObjetivo}
              onChange={(e) => setMontoObjetivo(Number(e.target.value))}
              required
            />
          </label>
          <button type="submit">Crear meta</button>
        </form>
      </article>

      <article className="card">
        <p className="eyebrow">Seguimiento</p>
        <h2>Metas actuales</h2>
        <ul className="list">
          {goals.map((goal) => {
            const progress = goal.montoObjetivo === 0 ? 0 : Math.round((goal.montoActual / goal.montoObjetivo) * 100);
            return (
              <li key={goal.id}>
                <div>
                  <strong>
                    {goal.emoji} {goal.nombre}
                  </strong>
                  <p>
                    {formatCOP(goal.montoActual)} / {formatCOP(goal.montoObjetivo)} ({progress}%)
                  </p>
                </div>
                <div className="inline-actions">
                  <input
                    type="number"
                    min={0}
                    value={abono}
                    onChange={(e) => setAbono(Number(e.target.value))}
                  />
                  <button
                    type="button"
                    onClick={() => contribute.mutate({ goalId: goal.id, amount: Math.round(abono) })}
                  >
                    Abonar
                  </button>
                </div>
              </li>
            );
          })}
          {goals.length === 0 && <li>No tienes metas creadas. Crea una para iniciar tu ahorro.</li>}
        </ul>
      </article>
    </section>
  );
}
