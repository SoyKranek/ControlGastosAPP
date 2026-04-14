import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { buildDependencies } from '../../shared/dependencies';
import { DependenciesContext } from './DependenciesContext';

type AppProviderProps = {
  children: ReactNode;
};

export function AppProvider({ children }: AppProviderProps) {
  const dependencies = useMemo(() => buildDependencies(), []);
  return (
    <DependenciesContext.Provider value={dependencies}>
      {children}
    </DependenciesContext.Provider>
  );
}
