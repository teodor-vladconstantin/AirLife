"use client";
import { useCallback, useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";
import { untypedDb } from "@/lib/untypedDb";

// Wishlist ("Favorite"): product ids kept in this browser; for a signed-in customer they are also saved in the account
// (table wishlist_items) and merged on sign-in, so the list follows the customer to any device. If the table is missing
// (migration not run yet) everything keeps working locally.
const KEY = "airlife_wishlist";
let ids: string[] = [];
let loaded = false;
const subs = new Set<() => void>();

const load = () => {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    ids = Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch { ids = []; }
  window.addEventListener("storage", (e) => {
    if (e.key !== KEY) return;
    try { ids = JSON.parse(e.newValue || "[]"); } catch { ids = []; }
    subs.forEach((f) => f());
  });
};

const emit = (next: string[]) => {
  ids = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* storage blocked */ }
  subs.forEach((f) => f());
};

let userId: string | null = null;
let syncing = false;

// Merge browser list and account list (union, account first), upload what the account does not have yet.
async function syncAccount(uid: string) {
  if (syncing) return;
  syncing = true;
  try {
    const { data, error } = await untypedDb.from("wishlist_items").select("product_id,created_at").eq("user_id", uid).order("created_at", { ascending: false });
    if (error) return; // table missing or no access: stay local
    const remote = (data ?? []).map((r: { product_id: string }) => r.product_id);
    const merged = [...remote, ...ids.filter((x) => !remote.includes(x))].slice(0, 100);
    const missing = merged.filter((x) => !remote.includes(x));
    if (missing.length) await untypedDb.from("wishlist_items").upsert(missing.map((product_id) => ({ user_id: uid, product_id })), { onConflict: "user_id,product_id", ignoreDuplicates: true });
    emit(merged);
  } catch { /* offline: stay local */ } finally { syncing = false; }
}

let authWired = false;
function wireAuth() {
  if (authWired || typeof window === "undefined") return;
  authWired = true;
  supabase.auth.getSession().then(({ data }) => { userId = data.session?.user.id ?? null; if (userId) void syncAccount(userId); });
  supabase.auth.onAuthStateChange((_e, session) => {
    const next = session?.user.id ?? null;
    if (next && next !== userId) { userId = next; void syncAccount(next); }
    if (!next) userId = null;
  });
}

const subscribe = (cb: () => void) => { load(); wireAuth(); subs.add(cb); return () => { subs.delete(cb); }; };
const snapshot = () => { load(); return ids; };
const empty: string[] = [];

export function useWishlist() {
  const list = useSyncExternalStore(subscribe, snapshot, () => empty);
  const has = useCallback((id: string) => list.includes(id), [list]);
  const toggle = useCallback((id: string) => {
    const removing = ids.includes(id);
    emit(removing ? ids.filter((x) => x !== id) : [id, ...ids].slice(0, 100));
    if (userId) {
      const q = removing
        ? untypedDb.from("wishlist_items").delete().eq("user_id", userId).eq("product_id", id)
        : untypedDb.from("wishlist_items").upsert({ user_id: userId, product_id: id }, { onConflict: "user_id,product_id", ignoreDuplicates: true });
      void Promise.resolve(q).catch(() => {});
    }
  }, []);
  return { ids: list, count: list.length, has, toggle };
}
