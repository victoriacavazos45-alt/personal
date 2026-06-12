import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseConfigured = Boolean(url && anonKey)

// Per security requirements, auth tokens are never persisted to localStorage.
// sessionStorage scopes the token to the tab and is cleared when it closes;
// Supabase Auth manages refresh in memory while the app is open.
const sessionStorageAdapter = {
  getItem: (key) => window.sessionStorage.getItem(key),
  setItem: (key, value) => window.sessionStorage.setItem(key, value),
  removeItem: (key) => window.sessionStorage.removeItem(key),
}

export const supabase = supabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        storage: sessionStorageAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null
