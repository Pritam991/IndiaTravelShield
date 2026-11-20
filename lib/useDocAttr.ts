"use client";

import { useSyncExternalStore } from "react";

// Reads a data-* attribute on <html> (set by the inline init script and the
// header toggles) without causing hydration mismatches.
export function useDocAttr(name: string): string {
  return useSyncExternalStore(
    (cb) => {
      const mo = new MutationObserver(cb);
      mo.observe(document.documentElement, {
        attributes: true,
        attributeFilter: [`data-${name}`],
      });
      return () => mo.disconnect();
    },
    () => document.documentElement.getAttribute(`data-${name}`) ?? "",
    () => "",
  );
}
