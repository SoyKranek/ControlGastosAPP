import type { Category } from '../../domain/entities/finance';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-vivienda', nombre: 'Vivienda', emoji: '🏠', tipo: 'necesidad', color: '#3B82F6' },
  { id: 'cat-transporte', nombre: 'Transporte', emoji: '🚗', tipo: 'necesidad', color: '#3B82F6' },
  { id: 'cat-mercado', nombre: 'Mercado', emoji: '🛒', tipo: 'necesidad', color: '#3B82F6' },
  { id: 'cat-salud', nombre: 'Salud', emoji: '💊', tipo: 'necesidad', color: '#3B82F6' },
  { id: 'cat-servicios', nombre: 'Servicios', emoji: '💡', tipo: 'necesidad', color: '#3B82F6' },
  { id: 'cat-restaurantes', nombre: 'Restaurantes', emoji: '🍽️', tipo: 'deseo', color: '#10B981' },
  {
    id: 'cat-entretenimiento',
    nombre: 'Entretenimiento',
    emoji: '🎮',
    tipo: 'deseo',
    color: '#10B981',
  },
  { id: 'cat-ropa', nombre: 'Ropa', emoji: '👕', tipo: 'deseo', color: '#10B981' },
  { id: 'cat-personal', nombre: 'Personal', emoji: '✂️', tipo: 'deseo', color: '#10B981' },
  {
    id: 'cat-suscripciones',
    nombre: 'Suscripciones',
    emoji: '📱',
    tipo: 'deseo',
    color: '#10B981',
  },
  { id: 'cat-emergencias', nombre: 'Emergencias', emoji: '🛡️', tipo: 'ahorro', color: '#F59E0B' },
  { id: 'cat-metas', nombre: 'Metas', emoji: '🎯', tipo: 'ahorro', color: '#F59E0B' },
];
