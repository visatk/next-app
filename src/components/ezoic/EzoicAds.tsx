'use client';

import { useEffect, useRef } from 'react';
import { runEzoic } from '@/lib/ezoic';

interface EzoicPlaceholderProps {
  id: number;
  className?: string;
}

export function EzoicPlaceholder({ id, className }: EzoicPlaceholderProps) {
  const isRendered = useRef(false);

  useEffect(() => {
    if (!isRendered.current) {
      isRendered.current = true;
      runEzoic(() => {
        if (window.ezstandalone?.hasInit) {
           // Use optional chaining to satisfy strict TypeScript execution
           window.ezstandalone.define?.(id);
           window.ezstandalone.display?.();
        }
      });
    }
  }, [id]);

  return (
    <div 
      className={className} 
      id={`ezoic-pub-ad-placeholder-${id}`} 
      suppressHydrationWarning
    />
  );
}
