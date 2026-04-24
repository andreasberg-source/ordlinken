'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';

export function useTimer() {
  const status = useGameStore((s) => s.status);
  const setElapsed = useGameStore((s) => s.setElapsed);
  const elapsedSeconds = useGameStore((s) => s.elapsedSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (status === 'playing') {
      // Resume from persisted elapsed time
      startTimeRef.current = Date.now() - elapsedSeconds * 1000;
      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current!) / 1000);
        setElapsed(elapsed);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return elapsedSeconds;
}
