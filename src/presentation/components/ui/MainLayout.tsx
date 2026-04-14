import type { ReactNode } from 'react';
import { NavLink, Link } from 'react-router-dom';

type MainLayoutProps = { children: ReactNode };

const links = [
  { to: '/', label: 'Dashboard', icon: '🏠' },
  { to: '/gastos', label: 'Gastos', icon: '💸' },
  { to: '/presupuesto', label: 'Presupuesto', icon: '📊' },
  { to: '/ahorro', label: 'Ahorro', icon: '🎯' },
  { to: '/perfil', label: 'Perfil', icon: '👤' },
  { to: '/onboarding', label: 'Onboarding', icon: '⚙️' },
];

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <span className="brand-chip">Finanzas personales</span>
          <h1>FLUJO</h1>
          <p>Tu dinero, claro.</p>
        </div>
      </header>
      <nav className="app-nav" aria-label="Navegacion principal">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => (isActive ? 'active-link' : 'inactive-link')}
          >
            {link.icon} {link.label}
          </NavLink>
        ))}
      </nav>
      <main className="app-main">{children}</main>
      <nav className="mobile-nav" aria-label="Navegacion movil">
        {links.slice(0, 5).map((link) => (
          <NavLink
            key={`mobile-${link.to}`}
            to={link.to}
            className={({ isActive }) => (isActive ? 'mobile-link active-mobile-link' : 'mobile-link')}
          >
            <span>{link.icon}</span>
            <small>{link.label}</small>
          </NavLink>
        ))}
      </nav>
      <Link className="fab-add" to="/gastos" aria-label="Registrar gasto rapido" data-tour-id="tour-target-fab">
        +
      </Link>
    </div>
  );
}
