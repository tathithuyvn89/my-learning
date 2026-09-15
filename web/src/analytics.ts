import { inject, pageview } from "@vercel/analytics";

/** `"1"` khi build trên Vercel — xem `vite.config.ts`. */
const enabled = import.meta.env.VITE_VERCEL_BUILD === "1";

let ready = false;

export function initAnalytics(): void {
  if (!enabled || typeof window === "undefined") return;
  inject({ disableAutoTrack: true });
  ready = true;
}

/** Gửi pageview cho hash router (`#/hsk1/day/1`, …). */
export function trackPageView(): void {
  if (!ready || typeof window === "undefined") return;
  const hash = window.location.hash || "#/";
  const path = `${window.location.pathname}${window.location.search}${hash}`;
  pageview({ route: hash, path });
}
