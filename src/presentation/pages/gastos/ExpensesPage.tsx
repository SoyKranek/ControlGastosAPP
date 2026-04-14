import { useState } from 'react';
import { useCategories, useCreateExpense, useDeleteExpense, useExpenses } from '../../hooks/useFinance';
import { formatCOP } from '../../../shared/utils/currency';
import type { FormEvent } from 'react';

export function ExpensesPage() {
  const categoriesQuery = useCategories();
  const expensesQuery = useExpenses();
  const createExpense = useCreateExpense();
  const deleteExpense = useDeleteExpense();
  const categories = categoriesQuery.data ?? [];
  const expenses = expensesQuery.data ?? [];
  const [categoriaId, setCategoriaId] = useState('cat-mercado');
  const [monto, setMonto] = useState(0);
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [focusMode, setFocusMode] = useState(false);

  const filteredExpenses =
    filtroCategoria.length > 0
      ? expenses.filter((item) => item.categoriaId === filtroCategoria)
      : expenses;

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await createExpense.mutateAsync({
      categoriaId,
      monto: Math.round(monto),
      descripcion,
      fecha,
      porcentajeMio: 100,
    });
    setMonto(0);
    setDescripcion('');
  };

  return (
    <section className={focusMode ? 'grid-cols-1' : 'grid-cols-2'}>
      <article className="card">
        <p className="eyebrow">Accion rapida</p>
        <h2>Registrar gasto</h2>
        <p className="support-text">Completa estos campos y guarda en segundos.</p>
        <div className="inline-actions">
          <button type="button" onClick={() => setFocusMode((prev) => !prev)}>
            {focusMode ? 'Salir modo enfoque' : 'Activar modo enfoque'}
          </button>
        </div>
        <form className="grid-form" onSubmit={onSubmit}>
          <label>
            Monto (COP)
            <input
              type="number"
              min={0}
              value={monto}
              onChange={(e) => setMonto(Number(e.target.value))}
              required
            />
          </label>
          <label>
            Categoria
            <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.emoji} {item.nombre}
                </option>
              ))}
            </select>
          </label>
          <label>
            Descripcion
            <input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
          </label>
          <label>
            Fecha
            <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </label>
          <button type="submit">Guardar gasto</button>
        </form>
      </article>

      {!focusMode && (
        <article className="card">
        <p className="eyebrow">Historial</p>
        <h2>Listado de gastos</h2>
        <label>
          Filtrar categoria
          <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
            <option value="">Todas</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nombre}
              </option>
            ))}
          </select>
        </label>
        <ul className="list">
          {filteredExpenses.map((expense) => (
            <li key={expense.id}>
              <div>
                <strong>{formatCOP(expense.monto)}</strong>
                <p>{expense.descripcion || 'Sin descripcion'}</p>
                <small>{expense.fecha}</small>
              </div>
              <button onClick={() => deleteExpense.mutate(expense.id)} type="button">
                Eliminar
              </button>
            </li>
          ))}
          {filteredExpenses.length === 0 && (
            <li>No hay gastos para este filtro. Intenta con otra categoria o crea uno nuevo.</li>
          )}
        </ul>
        </article>
      )}
    </section>
  );
}
