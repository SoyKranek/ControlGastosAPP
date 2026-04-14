import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSaveProfile } from '../../hooks/useFinance';
import type { FormEvent } from 'react';

export function OnboardingPage() {
  const navigate = useNavigate();
  const saveProfile = useSaveProfile();
  const [nombre, setNombre] = useState('Henry');
  const [ingresoNeto, setIngresoNeto] = useState(2348012);
  const [reglaNecesidades, setReglaNecesidades] = useState(50);
  const [reglaDeseos, setReglaDeseos] = useState(30);
  const [reglaAhorro, setReglaAhorro] = useState(20);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await saveProfile.mutateAsync({
      id: 'local-user',
      nombre,
      ingresoNeto,
      reglaNecesidades,
      reglaDeseos,
      reglaAhorro,
    });
    navigate('/');
  };

  return (
    <section className="card card-hero">
      <p className="eyebrow">Configuracion inicial</p>
      <h2>Onboarding inicial</h2>
      <p>Configura tu ingreso neto y regla mensual para empezar.</p>
      <form className="grid-form" onSubmit={handleSubmit}>
        <label>
          Nombre
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </label>
        <label>
          Ingreso neto mensual (COP)
          <input
            type="number"
            min={0}
            value={ingresoNeto}
            onChange={(e) => setIngresoNeto(Number(e.target.value))}
            required
          />
        </label>
        <label>
          % Necesidades
          <input
            type="number"
            min={0}
            max={100}
            value={reglaNecesidades}
            onChange={(e) => setReglaNecesidades(Number(e.target.value))}
            required
          />
        </label>
        <label>
          % Deseos
          <input
            type="number"
            min={0}
            max={100}
            value={reglaDeseos}
            onChange={(e) => setReglaDeseos(Number(e.target.value))}
            required
          />
        </label>
        <label>
          % Ahorro
          <input
            type="number"
            min={0}
            max={100}
            value={reglaAhorro}
            onChange={(e) => setReglaAhorro(Number(e.target.value))}
            required
          />
        </label>
        <div className="rule-preview">
          <span>Vista previa regla:</span>
          <strong>
            {reglaNecesidades}% / {reglaDeseos}% / {reglaAhorro}%
          </strong>
        </div>
        <button type="submit" disabled={saveProfile.isPending}>
          Guardar configuracion
        </button>
      </form>
    </section>
  );
}
