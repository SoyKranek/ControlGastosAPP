# FLUJO — Control de gastos personales

Aplicación web **progresiva (PWA)** para llevar tus ingresos, gastos y metas de ahorro con una regla de presupuesto tipo **50 / 30 / 20** (necesidades, deseos y ahorro), adaptable a tus porcentajes.

## Qué hace la app

- **Onboarding**: creación del perfil (nombre, ingreso neto y reparto del presupuesto).
- **Dashboard**: resumen del mes, flujo del día y comparativas con la regla elegida.
- **Gastos**: alta, edición y borrado de movimientos por categoría, filtros y registro rápido con actualización optimista en la interfaz.
- **Presupuesto**: vista alineada con necesidades / deseos / ahorro.
- **Ahorro**: metas con abonos y seguimiento del progreso.
- **Perfil**: datos del perfil, historial de nómina (ingresos por mes) y **exportación CSV** de gastos.
- **Tour de bienvenida** la primera vez que entras al panel (se guarda en el navegador).

Los datos se guardan **en el dispositivo** (`localStorage`) mediante un repositorio local. El cliente **Supabase** está preparado en el código para cuando quieras enlazar backend en la nube; hoy el arranque de la app usa solo almacenamiento local.

## Stack técnico

- React 19, TypeScript, Vite 7  
- React Router, TanStack Query, Zustand, React Hook Form, Zod  
- Tailwind CSS 4, Recharts  
- Vitest y pruebas de casos de uso  
- `vite-plugin-pwa` (service worker y manifest)

Arquitectura por capas: **dominio → casos de uso → infraestructura (repositorio) → presentación**.

## Requisitos

- Node.js **20+** (recomendado LTS)

## Puesta en marcha

```bash
npm install
npm run dev
```

Abre la URL que muestra Vite (por defecto `http://localhost:5173`).

## Scripts

| Comando | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compilación de producción |
| `npm run preview` | Vista previa del build |
| `npm run lint` | ESLint |
| `npm run test` | Vitest |
| `npm run test:supabase` | Comprueba URL y clave pública contra tu proyecto (lee `.env.local`) |

## Variables de entorno (Supabase, opcional)

Copia `.env.example` a `.env.local` y rellena:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY` (o `VITE_SUPABASE_ANON_KEY` con la JWT anon)

**No** uses la clave *secret* / *service_role* en el frontend. En Vercel, Netlify u otro hosting, define las mismas variables `VITE_*` en el panel del proyecto (`.env.local` no se sube al repositorio).

## Despliegue

Build estático: `npm run build` genera la carpeta `dist`. Configura las variables `VITE_*` en tu plataforma y, si usas autenticación con redirecciones, añade la URL de producción en Supabase → Authentication → URL configuration.

## Licencia

Uso del repositorio según lo definas como autor del proyecto.
