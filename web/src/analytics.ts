import { inject, pageview } from "@vercel/analytics";

/** `"1"` khi build trên Vercel — xem `vite.config.ts`. */
const builtOnVercel = import.meta.env.VITE_VERCEL_BUILD === "1";

let ready = false;

function shouldTrack(): boolean {
  if (!import.meta.env.PROD || typeof window === "undefined") return false;
  if (builtOnVercel) return true;
  // Fallback: preview / production *.vercel.app
  return window.location.hostname.endsWith(".vercel.app");
}

export function initAnalytics(): void {
  if (!shouldTrack()) return;
  inject({ disableAutoTrack: true, mode: "production" });
  ready = true;
}

/** Gửi pageview cho hash router (`#/hsk1/day/1`, …). */
export function trackPageView(): void {
  if (!ready || typeof window === "undefined") return;
  const hash = window.location.hash || "#/";
  const path = `${window.location.pathname}${window.location.search}${hash}`;
  pageview({ route: hash, path });
}
