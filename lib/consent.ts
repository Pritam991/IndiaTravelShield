"use client";

import { useSyncExternalStore } from "react";

// The visitor's choice about ads and the cookies they bring. "unset" means they
// have not chosen yet; "unknown" is only used while the page is being server
// rendered, so the banner never appears in the server HTML.
export const CONSENT_KEY = "its-consent";
export type Consent = "granted" | "denied" | "unset" | "unknown";

const listeners = new Set<() => void>();
let memory: "granted" | "denied" | null = null; // used when storage is blocked

function read(): Consent {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    if (v === "granted" || v === "denied") return v;
  } catch {
    /* storage can be blocked; fall back to this visit only */
  }
  return memory ?? "unset";
}

export function setConsent(v: "granted" | "denied" | "unset") {
  memory = v === "unset" ? null : v;
  try {
    if (v === "unset") localStorage.removeItem(CONSENT_KEY);
    else localStorage.setItem(CONSENT_KEY, v);
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

export const useConsent = (): Consent =>
  useSyncExternalStore(subscribe, read, () => "unknown" as Consent);

// True once Google's ad script has been added to this page. A loaded script
// cannot be unloaded, so withdrawing consent after that needs a page reload.
export const adScriptIsLoaded = () => !!document.querySelector('script[src*="adsbygoogle"]');
