"use client";
import { useEffect } from "react";

// Fixed bars at the bottom of the screen (phones) publish their height as a CSS variable, so other floating things
// (the "Top" button, a second bar) can stack above them instead of overlapping. A bar that is hidden reports 0.
export function useBarOffset(el: HTMLElement | null, name: "--bar-contact" | "--bar-buy") {
  useEffect(() => {
    if (!el) return;
    const root = document.documentElement;
    const set = () => root.style.setProperty(name, `${el.offsetHeight}px`);
    set();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(set) : null;
    ro?.observe(el);
    window.addEventListener("resize", set);
    return () => { ro?.disconnect(); window.removeEventListener("resize", set); root.style.removeProperty(name); };
  }, [el, name]);
}
