import { supabase } from "./supabaseClient";

export async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export function getCurrentUser() {
  return supabase.auth.getUser();
}

export async function isAdminUser(userId) {
  // Assumes a `profiles` table with `id` = auth.user.id and boolean `is_admin` column.
  if (!userId) return { isAdmin: false, error: null };

  const { data, error } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", userId)
    .maybeSingle();

  if (error) return { isAdmin: false, error };

  return { isAdmin: Boolean(data?.is_admin), error: null };
}

export function hasAdminRole(user) {
  return user?.app_metadata?.role === "admin";
}

export async function getAdminAccess(user) {
  if (!user) return { isAdmin: false, error: null };
  if (hasAdminRole(user)) return { isAdmin: true, error: null };

  return isAdminUser(user.id);
}

export async function getAdminSession({ refresh = false } = {}) {
  const { data, error } = refresh
    ? await supabase.auth.refreshSession()
    : await supabase.auth.getSession();
  const session = data?.session ?? null;

  if (error || !session) {
    return { session, isAdmin: false, error };
  }

  const adminAccess = await getAdminAccess(session.user);

  return {
    session,
    isAdmin: adminAccess.isAdmin,
    error: adminAccess.error,
  };
}

// Optional: listen for auth changes (exported for use in app entry if needed)
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback).subscription;
}


