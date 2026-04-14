/**
 * Prueba conexión a Supabase leyendo .env.local o env.local (sin subir secretos al repo).
 * Uso: npm run test:supabase
 */
import { readFileSync, existsSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

function loadEnvFile(name) {
  if (!existsSync(name)) return {};
  const out = {};
  for (const line of readFileSync(name, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

const fromLocal = { ...loadEnvFile('.env.local'), ...loadEnvFile('env.local') };
const url = fromLocal.VITE_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const key =
  fromLocal.VITE_SUPABASE_PUBLISHABLE_KEY ??
  fromLocal.VITE_SUPABASE_ANON_KEY ??
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  process.env.VITE_SUPABASE_ANON_KEY;

console.log('--- Supabase: prueba de conexión ---\n');

if (!url || !key) {
  console.error(
    'Falta VITE_SUPABASE_URL y una clave publica: VITE_SUPABASE_PUBLISHABLE_KEY o VITE_SUPABASE_ANON_KEY en .env.local',
  );
  process.exit(1);
}

if (key.includes('sb_secret_') || key.toLowerCase().includes('secret')) {
  console.error(
    'ERROR: Parece que estás usando una clave SECRETA en el cliente. Eso no es seguro y suele fallar.',
  );
  console.error(
    'Usa solo la clave publica del panel (VITE_SUPABASE_PUBLISHABLE_KEY o VITE_SUPABASE_ANON_KEY), nunca la secret.',
  );
  process.exit(1);
}

const supabase = createClient(url, key);

const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
if (sessionError) {
  console.error('getSession:', sessionError.message);
} else {
  console.log('Cliente creado OK.');
  console.log('Sesión actual:', sessionData.session ? `usuario ${sessionData.session.user.email}` : 'sin login');
}

// Llamada a PostgREST (respeta RLS: sin sesión puede devolver [] o error según políticas)
const { error: qError, count } = await supabase
  .from('perfiles')
  .select('*', { count: 'exact', head: true });

if (qError) {
  console.log('\nConsulta test a `perfiles`:', qError.message);
  if (qError.message.includes('JWT') || qError.message.includes('Invalid API')) {
    console.error('\nRevisa la clave: debe ser la anon/public del proyecto (no la secret).');
    process.exit(1);
  }
} else {
  console.log('\nConsulta test a `perfiles`: OK (PostgREST responde).');
  console.log('Conteo (head):', count ?? 'n/d');
}

console.log('\nListo. Si ves "Cliente creado" y "PostgREST responde", la URL y la clave pública son válidas.');
