"use client";
import { trackError } from "@/lib/analytics";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

declare global {
  interface Window {
    turnstile?: { render: (el: HTMLElement, o: Record<string, unknown>) => string; reset: (id?: string) => void; remove: (id?: string) => void };
  }
}

let scriptPromise: Promise<void> | null = null;
const loadScript = () =>
  (scriptPromise ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => { scriptPromise = null; reject(new Error("turnstile")); };
    document.head.appendChild(s);
  }));

// Cloudflare Turnstile (privacy-friendly CAPTCHA). No site key = renders nothing and the form works as before.
// Usage: `const [token, widget, reset] = useTurnstile();` put {widget} above the submit button, send `token` with the form, call reset() after.
export function useTurnstile(): [string, ReactNode, () => void, boolean] {
  const [token, setToken] = useState("");
  // callback ref in state: the effect runs again when the widget element appears (forms that open on click mount it late)
  const [box, setBox] = useState<HTMLDivElement | null>(null);
  const id = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!SITE_KEY || !box) return;
    let dead = false;
    loadScript().then(() => {
      if (dead || !window.turnstile || id.current) return;
      id.current = window.turnstile.render(box, {
        sitekey: SITE_KEY,
        theme: "auto",
        language: "ro",
        callback: (t: string) => setToken(t),
        "expired-callback": () => setToken(""),
        "error-callback": (code?: string) => { setToken(""); trackError("turnstile_error", String(code ?? "")); },
      });
    }).catch(() => undefined);
    return () => { dead = true; if (id.current && window.turnstile) { window.turnstile.remove(id.current); id.current = undefined; } };
  }, [box]);

  const reset = useCallback(() => {
    setToken("");
    if (id.current && window.turnstile) window.turnstile.reset(id.current);
  }, []);

  const widget = SITE_KEY ? <div ref={setBox} className="min-h-[65px]" /> : null;
  return [token, widget, reset, !!SITE_KEY];
}
