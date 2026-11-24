"use client";
import { useCallback, useSyncExternalStore } from "react";

// Wishlist ("Favorite"): product ids kept in this browser only (no account needed).
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

const subscribe = (cb: () => void) => { load(); subs.add(cb); return () => { subs.delete(cb); }; };
const snapshot = () => { load(); return ids; };
const empty: string[] = [];

export function useWishlist() {
  const list = useSyncExternalStore(subscribe, snapshot, () => empty);
  const has = useCallback((id: string) => list.includes(id), [list]);
  const toggle = useCallback((id: string) => emit(ids.includes(id) ? ids.filter((x) => x !== id) : [id, ...ids].slice(0, 100)), []);
  return { ids: list, count: list.length, has, toggle };
}
