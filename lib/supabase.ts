import { createClient, SupabaseClient } from "@supabase/supabase-js";

// A single browser/server-safe anon client. Uses the public anon key, which is
// safe to expose (row-level security in Supabase governs what it can read/write).
// NEVER put the service-role key in NEXT_PUBLIC_* — keep it server-only.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!url || !anonKey) return null; // not configured yet — callers fall back to example data
  if (!client) client = createClient(url, anonKey);
  return client;
}

// Server-only client using the service-role key, for privileged writes
// (e.g. inserting enquiries). Only import this from server code / route handlers.
export function getServiceSupabase(): SupabaseClient | null {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}
