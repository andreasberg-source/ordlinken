'use client';

import { Button } from '@/components/ui/button';
import type { LifelineType } from '@/types/game';

interface LifelinePanelProps {
  lifelinesUsed: LifelineType[];
  onUseLifeline: (type: LifelineType) => Promise<void>;
  disabled: boolean;
  solutionLength: number;
  solutionFirstLetter: string;
}

const LIFELINES: { type: LifelineType; label: string; emoji: string }[] = [
  { type: 'position', label: 'Posisjon', emoji: '↔️' },
  { type: 'letter_count', label: 'Antall bokstaver', emoji: '🔢' },
  { type: 'first_letter', label: 'Første bokstav', emoji: '🔤' },
];

export default function LifelinePanel({
  lifelinesUsed,
  onUseLifeline,
  disabled,
}: LifelinePanelProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">Hjelpemidler</p>
      <div className="flex flex-wrap gap-2">
        {LIFELINES.map(({ type, label, emoji }) => {
          const used = lifelinesUsed.includes(type);
          return (
            <Button
              key={type}
              variant="outline"
              size="sm"
              disabled={disabled || used}
              onClick={() => onUseLifeline(type)}
              className={used ? 'opacity-40 line-through' : ''}
            >
              <span>{emoji}</span>
              <span>{used ? `${label} (brukt)` : label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
