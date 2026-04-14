import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
/** Publica: `publishable` (Supabase nuevo) o `anon` JWT (legado). Nunca secret/service_role en el cliente. */
const supabasePublicKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

export const supabaseClient =
  supabaseUrl && supabasePublicKey ? createClient(supabaseUrl, supabasePublicKey) : null;
