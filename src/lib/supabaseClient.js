import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL ?? "";
const supabaseAnonKey =
  import.meta.env?.VITE_SUPABASE_ANON_KEY ??
  import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY ??
  "";

function createStubClient() {
  return {
    auth: {
      signInWithPassword: async () => ({ data: null, error: { message: "Supabase is not configured yet." } }),
      signOut: async () => ({ error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ subscription: { unsubscribe: () => {} } }),
    },
    from: () => ({
      select: async () => ({ data: [], error: null }),
      insert: async () => ({ data: null, error: null }),
      order: async () => ({ data: [], error: null }),
      eq: () => ({
        select: async () => ({ data: [], error: null }),
        single: async () => ({ data: null, error: null }),
      }),
      limit: async () => ({ data: [], error: null }),
    }),
    storage: {
      from: () => ({
        upload: async () => ({ error: { message: "Supabase storage is not configured yet." } }),
      }),
    },
  };
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createStubClient();