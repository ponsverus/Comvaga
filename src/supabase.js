import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const PASSWORD_RECOVERY_STORAGE_KEY = 'comvaga-password-recovery';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

try {
  const url = new URL(window.location.href);
  const hashRaw = (url.hash || '').replace(/^#/, '');
  const hashParams = new URLSearchParams(
    hashRaw.startsWith('?') ? hashRaw.slice(1) : hashRaw
  );
  const type = url.searchParams.get('type') || hashParams.get('type');
  const hasRecoveryToken = url.searchParams.has('code')
    || url.searchParams.has('access_token')
    || hashParams.has('access_token');

  if (url.pathname === '/reset-password' || type === 'recovery' || hasRecoveryToken) {
    window.sessionStorage?.setItem(PASSWORD_RECOVERY_STORAGE_KEY, '1');
  }
} catch {
  // Ignore browser storage/url parsing issues and let Supabase handle auth normally.
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'comvaga-auth',
      lock: async (_name, _timeout, fn) => fn()
    },
    global: {
      headers: {
        'X-Client-Info': 'comvaga-web'
      }
    }
  }
);
