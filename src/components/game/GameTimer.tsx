'use client';

import { useTimer } from '@/hooks/useTimer';
import { formatTime } from '@/lib/utils';
import { Timer } from 'lucide-react';

export default function GameTimer() {
  const elapsed = useTimer();

  return (
    <div className="flex items-center gap-1.5 text-sm font-mono text-slate-600">
      <Timer className="h-4 w-4" />
      <span>{formatTime(elapsed)}</span>
    </div>
  );
}
