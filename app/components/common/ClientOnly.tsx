"use client";

import { useClientMount } from "@/lib/hooks/useClientMount";

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component that only renders its children on the client side,
 * preventing hydration mismatches.
 */
export default function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const mounted = useClientMount();

  if (!mounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
