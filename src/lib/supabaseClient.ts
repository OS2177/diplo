// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY ?? '';

// 👉 Log what’s actually coming through
console.log('⛵️ Supabase URL:', SUPABASE_URL);
console.log('🔑 Supabase Key:', SUPABASE_KEY);

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
