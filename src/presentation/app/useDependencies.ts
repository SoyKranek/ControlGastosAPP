import { useContext } from 'react';
import { DependenciesContext } from './DependenciesContext';

export function useDependencies() {
  const ctx = useContext(DependenciesContext);
  if (!ctx) {
    throw new Error('useDependencies debe usarse dentro de AppProvider');
  }
  return ctx;
}
