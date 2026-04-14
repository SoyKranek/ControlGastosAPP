import { useState } from 'react';
import { useAddPayroll, usePayrolls, useProfile, useSaveProfile } from '../../hooks/useFinance';
import { useDependencies } from '../../app/useDependencies';
import type { FormEvent } from 'react';

export function ProfilePage() {
  const profileQuery = useProfile();
  const saveProfile = useSaveProfile();
  const payrollsQuery = usePayrolls();
  const addPayroll = useAddPayroll();
  const { finance } = useDependencies();

  const profile = profileQuery.data;
  const [nombre, setNombre] = useState(profile?.nombre ?? 'Henry');
  const [ingresoNeto, setIngresoNeto] = useState(profile?.ingresoNeto ?? 2348012);
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [anio, setAnio] = useState(new Date().getFullYear());

  const handleSaveProfile = async (event: FormEvent) => {
    event.preventDefault();
    await saveProfile.mutateAsync({
      id: 'local-user',
      nombre,
      ingresoNeto,
      reglaNecesidades: profile?.reglaNecesidades ?? 50,
      reglaDeseos: profile?.reglaDeseos ?? 30,
      reglaAhorro: profile?.reglaAhorro ?? 20,
    });
  };

  const downloadCsv = async () => {
    const csv = await finance.exportExpensesCsv();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'gastos-flujo.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="grid-cols-2">
      <article className="card">
        <p className="eyebrow">Tu cuenta</p>
        <h2>Perfil</h2>
        <p className="support-text">Mantener estos datos actualizados mejora todos los calculos.</p>
        <form className="grid-form" onSubmit={handleSaveProfile}>
          <label>
            Nombre
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </label>
          <label>
            Ingreso neto
            <input
              type="number"
              min={0}
              value={ingresoNeto}
              onChange={(e) => setIngresoNeto(Number(e.target.value))}
            />
          </label>
          <button type="submit">Guardar perfil</button>
        </form>
      </article>

      <article className="card">
        <p className="eyebrow">Historial financiero</p>
        <h2>Nomina mensual</h2>
        <form
          className="grid-form"
          onSubmit={(e) => {
            e.preventDefault();
            addPayroll.mutate({ mes, anio, ingresoNeto });
          }}
        >
          <label>
            Mes
            <input type="number" min={1} max={12} value={mes} onChange={(e) => setMes(Number(e.target.value))} />
          </label>
          <label>
            Anio
            <input type="number" value={anio} onChange={(e) => setAnio(Number(e.target.value))} />
          </label>
          <button type="submit">Agregar nomina</button>
        </form>
        <ul className="list">
          {(payrollsQuery.data ?? []).map((payroll) => (
            <li key={payroll.id}>
              {payroll.mes}/{payroll.anio} - ${payroll.ingresoNeto}
            </li>
          ))}
          {(payrollsQuery.data ?? []).length === 0 && (
            <li>No hay nominas registradas aun. Agrega una para tener historial.</li>
          )}
        </ul>
      </article>

      <article className="card">
        <p className="eyebrow">Respaldo</p>
        <h2>Exportar datos</h2>
        <p className="support-text">Descarga tus movimientos cuando quieras en formato CSV.</p>
        <button type="button" onClick={downloadCsv}>
          Descargar CSV de gastos
        </button>
      </article>
    </section>
  );
}
