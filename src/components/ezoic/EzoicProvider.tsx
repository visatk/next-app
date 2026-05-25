'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { runEzoic } from '@/lib/ezoic';

export function EzoicProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    runEzoic(() => {
      if (!window.ezstandalone?.hasInit) {
        // Initial Page Load
        window.ezstandalone?.enable?.();
        window.ezstandalone?.display?.();
        if (window.ezstandalone) window.ezstandalone.hasInit = true;
      } else {
        // Subsequent Route Navigation
        // Ensure you add ?.() to ANY other methods called here
        window.ezstandalone?.destroyAll?.();
        // If your Next.js docs implementation uses getPlaceholders or refresh, 
        // they also need optional chaining:
        // const placeholders = window.ezstandalone?.getPlaceholders?.();
        // window.ezstandalone?.define?.(placeholders);
        window.ezstandalone?.refresh?.();
      }
    });
  }, [pathname, searchParams]);

  return <>{children}</>;
}
