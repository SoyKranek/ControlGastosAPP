import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { MainLayout } from '../components/ui/MainLayout';
import { OnboardingPage } from '../pages/auth/OnboardingPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { ExpensesPage } from '../pages/gastos/ExpensesPage';
import { BudgetPage } from '../pages/presupuesto/BudgetPage';
import { SavingsPage } from '../pages/ahorro/SavingsPage';
import { ProfilePage } from '../pages/perfil/ProfilePage';

export function App() {
  const location = useLocation();

  return (
    <MainLayout>
      <div className="route-view" key={location.pathname}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/gastos" element={<ExpensesPage />} />
          <Route path="/presupuesto" element={<BudgetPage />} />
          <Route path="/ahorro" element={<SavingsPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </div>
    </MainLayout>
  );
}
