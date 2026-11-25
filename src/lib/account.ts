import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

// Customer profile and saved addresses live in the Supabase auth user's metadata (no extra table needed).
export interface SavedAddress {
  id: string;
  label: string; // "Acasă", "Birou"…
  name: string;
  phone: string;
  county: string;
  city: string;
  address: string;
  postalCode: string;
  isDefault?: boolean;
}

export interface Profile { name: string; phone: string; addresses: SavedAddress[] }

export function readProfile(user: User | null): Profile {
  const m = (user?.user_metadata ?? {}) as Record<string, unknown>;
  const addresses = Array.isArray(m.addresses) ? (m.addresses as SavedAddress[]).filter((a) => a && a.id && a.address) : [];
  return {
    name: typeof m.full_name === "string" ? m.full_name : typeof m.name === "string" ? m.name : "",
    phone: typeof m.phone === "string" ? m.phone : "",
    addresses,
  };
}

export async function saveProfile(p: Profile) {
  const { data, error } = await supabase.auth.updateUser({ data: { full_name: p.name, phone: p.phone, addresses: p.addresses } });
  if (error) throw error;
  return data.user;
}

export const newId = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now() + Math.random()));

// at most one default
export function withDefault(list: SavedAddress[], id: string): SavedAddress[] {
  return list.map((a) => ({ ...a, isDefault: a.id === id }));
}
