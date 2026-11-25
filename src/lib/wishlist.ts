"use client";
import { useCallback, useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";
import { untypedDb } from "@/lib/untypedDb";

// Wishlist ("Favorite"): belongs to the customer ACCOUNT (table wishlist_items), never to the browser.
// Nothing is stored locally: the list is read from the account after sign-in and cleared on sign-out, so a shared
// computer never shows one person's favorites to another. Visitors who are not signed in are asked to sign in.
let ids: string[] = [];
let userId: string | null = null;
let ready = false; // true once we know whether someone is signed in (and, if so, their list is loaded)
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());

// leftover from the old browser-only version: remove it so it can never reappear
const dropLegacy = () => { try { localStorage.removeItem("airlife_wishlist"); } catch { /* storage blocked */ } };

async function loadAccount(uid: string) {
  try {
    const { data, error } = await untypedDb.from("wishlist_items").select("product_id,created_at").eq("user_id", uid).order("created_at", { ascending: false });
    if (userId !== uid) return; // signed out / switched account while loading
    ids = error ? [] : (data ?? []).map((r: { product_id: string }) => r.product_id);
  } catch { ids = []; }
  ready = true;
  emit();
}

function setUser(uid: string | null) {
  if (uid === userId && ready) return;
  userId = uid;
  ids = [];
  if (uid) { ready = false; emit(); void loadAccount(uid); } else { ready = true; emit(); }
}

let wired = false;
function wireAuth() {
  if (wired || typeof window === "undefined") return;
  wired = true;
  dropLegacy();
  supabase.auth.getSession().then(({ data }) => setUser(data.session?.user.id ?? null));
  supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user.id ?? null));
}

const subscribe = (cb: () => void) => { wireAuth(); subs.add(cb); return () => { subs.delete(cb); }; };
const snapshot = () => ids;
const empty: string[] = [];

export type ToggleResult = "added" | "removed" | "login_required" | "error";

export function useWishlist() {
  const list = useSyncExternalStore(subscribe, snapshot, () => empty);
  const has = useCallback((id: string) => list.includes(id), [list]);
  const toggle = useCallback(async (id: string): Promise<ToggleResult> => {
    if (!userId) return "login_required";
    const uid = userId;
    const removing = ids.includes(id);
    ids = removing ? ids.filter((x) => x !== id) : [id, ...ids].slice(0, 100); // optimistic
    emit();
    const { error } = removing
      ? await untypedDb.from("wishlist_items").delete().eq("user_id", uid).eq("product_id", id)
      : await untypedDb.from("wishlist_items").upsert({ user_id: uid, product_id: id }, { onConflict: "user_id,product_id", ignoreDuplicates: true });
    if (error) { // undo
      ids = removing ? [id, ...ids] : ids.filter((x) => x !== id);
      emit();
      return "error";
    }
    return removing ? "removed" : "added";
  }, []);
  return { ids: list, count: list.length, has, toggle, signedIn: userId !== null, ready };
}
