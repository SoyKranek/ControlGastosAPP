import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useProfile, useSummary } from '../../hooks/useFinance';
import { formatCOP } from '../../../shared/utils/currency';
import { TourHeaderIllustration } from '../../components/ui/TourHeaderIllustration';

const TOUR_QUICK_GUIDE_DONE_KEY = 'flujo.tour.quickGuide.done';
const TOUR_DISMISSED_LEGACY_KEY = 'flujo.tour.dismissed';

function readQuickGuideAlreadyDone(): boolean {
  try {
    if (localStorage.getItem(TOUR_QUICK_GUIDE_DONE_KEY) === 'true') {
      return true;
    }
    if (localStorage.getItem(TOUR_DISMISSED_LEGACY_KEY) === 'true') {
      localStorage.setItem(TOUR_QUICK_GUIDE_DONE_KEY, 'true');
      return true;
    }
  } catch {
    /* storage no disponible */
  }
  return false;
}

export function DashboardPage() {
  const navigate = useNavigate();
  const profileQuery = useProfile();
  const summaryQuery = useSummary();
  const profile = profileQuery.data;
  const summary = summaryQuery.data;
  const totalSpent =
    (summary?.totals.necesidad ?? 0) + (summary?.totals.deseo ?? 0) + (summary?.totals.ahorro ?? 0);
  const totalLimit =
    (summary?.limits.necesidad ?? 0) + (summary?.limits.deseo ?? 0) + (summary?.limits.ahorro ?? 0);
  const progress = totalLimit > 0 ? Math.min(100, Math.round((totalSpent / totalLimit) * 100)) : 0;
  const remaining = Math.max(0, totalLimit - totalSpent);
  const needProgress =
    (summary?.limits.necesidad ?? 0) > 0
      ? Math.round(((summary?.totals.necesidad ?? 0) / (summary?.limits.necesidad ?? 1)) * 100)
      : 0;
  const wantProgress =
    (summary?.limits.deseo ?? 0) > 0
      ? Math.round(((summary?.totals.deseo ?? 0) / (summary?.limits.deseo ?? 1)) * 100)
      : 0;
  const saveProgress =
    (summary?.limits.ahorro ?? 0) > 0
      ? Math.round(((summary?.totals.ahorro ?? 0) / (summary?.limits.ahorro ?? 1)) * 100)
      : 0;
  const [tourStep, setTourStep] = useState(0);
  /** true = guía ya vista o finalizada: no se vuelve a mostrar sola (solo primera vez). */
  const [tourDismissed, setTourDismissed] = useState<boolean>(() => readQuickGuideAlreadyDone());
  const [animatedDailyFlow, setAnimatedDailyFlow] = useState(0);
  const [animatedRemaining, setAnimatedRemaining] = useState(0);
  const [animatedSpent, setAnimatedSpent] = useState(0);
  const isLoading = profileQuery.isLoading || summaryQuery.isLoading;

  const tourSteps = useMemo(
    () => [
      {
        text: 'Este bloque te muestra cuanto puedes gastar hoy sin salirte del plan.',
        target: 'tour-target-hero',
      },
      {
        text: 'Estas tarjetas te muestran como vas en necesidades, deseos y ahorro.',
        target: 'tour-target-stats',
      },
      {
        text: 'Usa este boton flotante para registrar gastos en segundos.',
        target: 'tour-target-fab',
      },
    ],
    [],
  );

  useEffect(() => {
    const targetDailyFlow = summary?.dailyFlow ?? 0;
    const targetRemaining = remaining;
    const targetSpent = totalSpent;
    const steps = 24;
    let current = 0;

    const timer = window.setInterval(() => {
      current += 1;
      const progressRatio = current / steps;
      setAnimatedDailyFlow(Math.round(targetDailyFlow * progressRatio));
      setAnimatedRemaining(Math.round(targetRemaining * progressRatio));
      setAnimatedSpent(Math.round(targetSpent * progressRatio));
      if (current >= steps) {
        window.clearInterval(timer);
      }
    }, 16);

    return () => window.clearInterval(timer);
  }, [summary?.dailyFlow, remaining, totalSpent]);

  const dismissTour = () => {
    try {
      localStorage.setItem(TOUR_QUICK_GUIDE_DONE_KEY, 'true');
      localStorage.removeItem(TOUR_DISMISSED_LEGACY_KEY);
    } catch {
      /* ignore */
    }
    setTourDismissed(true);
  };

  const onNextTour = () => {
    if (tourStep === tourSteps.length - 1) {
      dismissTour();
      return;
    }
    setTourStep((prev) => prev + 1);
  };

  const onPreviousTour = () => {
    setTourStep((prev) => (prev <= 0 ? 0 : prev - 1));
  };

  /** Solo si el usuario quiere repetir la guía manualmente. */
  const resetTour = () => {
    try {
      localStorage.removeItem(TOUR_QUICK_GUIDE_DONE_KEY);
      localStorage.removeItem(TOUR_DISMISSED_LEGACY_KEY);
    } catch {
      /* ignore */
    }
    setTourDismissed(false);
    setTourStep(0);
  };

  if (!profile) {
    return (
      <section className="card">
        <h2>Bienvenido a FLUJO</h2>
        <p>Completa el onboarding para comenzar a registrar tus finanzas.</p>
        <Link to="/onboarding">Ir al onboarding</Link>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <article key={`skeleton-${index}`} className="card skeleton-card" />
        ))}
      </section>
    );
  }

  return (
    <section className={`grid-cols-2 ${!tourDismissed ? 'tour-active' : ''}`}>
      <article
        className={`card card-hero reveal ${tourStep === 0 && !tourDismissed ? 'tour-highlight' : ''}`}
        data-tour-id="tour-target-hero"
      >
        <p className="eyebrow">Resumen inteligente</p>
        <h2>Estado del mes</h2>
        <p>
          Hola {profile.nombre}. Flujo del dia:{' '}
          <strong className="big-number">{formatCOP(animatedDailyFlow)}</strong>
        </p>
        <p className="support-text">Este valor te ayuda a gastar con control sin perder libertad.</p>
        <div className="progress-wrap">
          <div className="progress-top">
            <span>Progreso mensual</span>
            <strong>{progress}%</strong>
          </div>
          <div className="progress-bar" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
            <span style={{ width: `${progress}%` }} />
          </div>
          <small>
            Gastado: {formatCOP(animatedSpent)} · Disponible: {formatCOP(animatedRemaining)}
          </small>
        </div>
      </article>
      <article className="card reveal">
        <p className="eyebrow">Configuracion activa</p>
        <h2>Regla activa</h2>
        <p className="big-number">
          {profile.reglaNecesidades}/{profile.reglaDeseos}/{profile.reglaAhorro}
        </p>
        <p className="support-text">Puedes ajustar esta regla en onboarding o perfil.</p>
      </article>
      <article
        className={`card stat-need reveal ${tourStep === 1 && !tourDismissed ? 'tour-highlight' : ''}`}
        data-tour-id="tour-target-stats"
      >
        <p className="eyebrow">Bloque 1</p>
        <h3>Necesidades</h3>
        <p>
          {formatCOP(summary?.totals.necesidad ?? 0)} / {formatCOP(summary?.limits.necesidad ?? 0)}
        </p>
        <small className="trend-positive">Uso: {needProgress}% del limite</small>
      </article>
      <article
        className={`card stat-want reveal ${tourStep === 1 && !tourDismissed ? 'tour-highlight' : ''}`}
        data-tour-id="tour-target-stats"
      >
        <p className="eyebrow">Bloque 2</p>
        <h3>Deseos</h3>
        <p>
          {formatCOP(summary?.totals.deseo ?? 0)} / {formatCOP(summary?.limits.deseo ?? 0)}
        </p>
        <small className={wantProgress > 80 ? 'trend-warning' : 'trend-positive'}>
          Uso: {wantProgress}% del limite
        </small>
      </article>
      <article
        className={`card stat-save reveal ${tourStep === 1 && !tourDismissed ? 'tour-highlight' : ''}`}
        data-tour-id="tour-target-stats"
      >
        <p className="eyebrow">Bloque 3</p>
        <h3>Ahorro</h3>
        <p>
          {formatCOP(summary?.totals.ahorro ?? 0)} / {formatCOP(summary?.limits.ahorro ?? 0)}
        </p>
        <small className="trend-positive">Avance: {saveProgress}% de objetivo mensual</small>
      </article>
      <article className="card reveal">
        <h3>Ultimos gastos</h3>
        <ul className="list">
          {(summary?.recentExpenses ?? []).map((expense) => (
            <li key={expense.id}>
              {expense.fecha} - {expense.descripcion || 'Sin descripcion'} - {formatCOP(expense.monto)}
            </li>
          ))}
          {(summary?.recentExpenses ?? []).length === 0 && (
            <li>Aun no hay movimientos. Ve a Gastos y registra el primero.</li>
          )}
        </ul>
      </article>
      {tourDismissed ? (
        <button type="button" className="tour-reopen" onClick={resetTour}>
          Mostrar tour rapido
        </button>
      ) : (
        <div className="tour-overlay">
          <aside className="tour-card tour-card-premium">
            <div className="tour-head">
              <div className="tour-heading-wrap">
                <p className="eyebrow">Guia rapida</p>
                <small className="tour-counter">
                  Paso {tourStep + 1} de {tourSteps.length}
                </small>
              </div>
              <div className="tour-mini-illustration" aria-hidden="true">
                <TourHeaderIllustration />
              </div>
              <button type="button" className="tour-close" onClick={dismissTour} aria-label="Cerrar tour">
                ✕
              </button>
            </div>
            <h3>Tour de inicio</h3>
            <p>{tourSteps[tourStep].text}</p>
            <div className="tour-steps">
              {tourSteps.map((_, index) => (
                <span key={`step-${index}`} className={index === tourStep ? 'tour-step active-step' : 'tour-step'} />
              ))}
            </div>
            <div className="tour-actions">
              <button type="button" className="tour-btn-secondary" onClick={onPreviousTour}>
                Anterior
              </button>
              <button type="button" className="tour-btn-primary" onClick={onNextTour}>
                {tourStep === tourSteps.length - 1 ? 'Finalizar' : 'Siguiente'}
              </button>
            </div>
            <button type="button" className="tour-skip" onClick={dismissTour}>
              Omitir guia por ahora
            </button>
          </aside>
        </div>
      )}
      {!tourDismissed && tourStep === 2 && (
        <button
          type="button"
          className="tour-fab-hint"
          data-tour-id="tour-target-fab"
          onClick={() => {
            navigate('/gastos');
            dismissTour();
          }}
        >
          Toca + para gasto rapido
        </button>
      )}
    </section>
  );
}
