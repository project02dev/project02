"use client";

import { useEffect, useState } from "react";

/**
 * Custom hook to prevent hydration mismatches by ensuring components
 * only render client-specific content after mounting on the client side.
 * 
 * @returns boolean - true when component has mounted on client side
 */
export function useClientMount(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
