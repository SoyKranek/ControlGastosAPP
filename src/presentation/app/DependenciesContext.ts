import { createContext } from 'react';
import type { AppDependencies } from '../../shared/dependencies';

export const DependenciesContext = createContext<AppDependencies | null>(null);
