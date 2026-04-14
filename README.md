# FLUJO

PWA para llevar el día a día del dinero: ingresos, gastos por categoría y metas de ahorro, con una regla tipo **50 / 30 / 20** (necesidades, deseos, ahorro) que se puede ajustar a gusto.

## Qué incluye

Monté un onboarding para el perfil y el reparto del presupuesto, un dashboard con el mes en curso y comparativas, pantalla de gastos con filtros y altas rápidas (la UI actualiza al tiro y después confirma contra el repo local), vista de presupuesto alineada a esos tres bloques, metas de ahorro con abonos, y perfil con historial de nómina y descarga de gastos en CSV. La primera vez que entras al panel aparece un tour corto; después no molesta más.

Hoy los datos viven en el navegador (`localStorage`). Dejé armado el cliente de Supabase en el proyecto por si más adelante quiero sincronizar o sumar auth; el flujo que corre ahora no depende de eso.

## Tecnología

React 19, TypeScript, Vite, Tailwind, React Router, TanStack Query, Zustand, React Hook Form y Zod. Gráficos con Recharts. Tests con Vitest sobre los casos de uso. PWA con `vite-plugin-pwa`. La estructura la fui ordenando en capas: dominio, aplicación, infraestructura (repositorio) y presentación.

## Local

Necesitas Node 20 en adelante. Después es lo de siempre:

```bash
npm install
npm run dev
```

`npm run build` deja el estático en `dist/`. `npm run test` corre la suite. `npm run test:supabase` es un script mío que levanta el `.env.local` y prueba URL + clave pública contra el proyecto; sirve para no estar adivinando si pegué mal la key del panel (la pública, nunca la service_role).

Si lo subo a Vercel, Netlify o similar, las variables `VITE_SUPABASE_*` las cargo ahí: el `.env.local` no va al git por el `.gitignore`.
