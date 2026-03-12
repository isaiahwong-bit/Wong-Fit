"use client";

import { useEffect, useState } from "react";

/**
 * Returns true once the client has mounted and Zustand stores have rehydrated from localStorage.
 * Use this to avoid SSR/hydration mismatches with persisted state.
 */
export function useHydration() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
