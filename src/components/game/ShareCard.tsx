'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { buildShareText } from '@/lib/game/shareFormatter';
import type { CompletedGame } from '@/types/game';
import { Share2, Check } from 'lucide-react';

interface ShareCardProps {
  game: CompletedGame;
  puzzleNumber: number;
  playDate: string;
}

export default function ShareCard({ game, puzzleNumber, playDate }: ShareCardProps) {
  const [copied, setCopied] = useState(false);

  const text = buildShareText(game, puzzleNumber, playDate);

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers that block clipboard
      window.prompt('Kopier dette:', text);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <pre className="rounded-md bg-slate-100 dark:bg-slate-800 p-3 text-sm whitespace-pre-wrap font-mono border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100">
        {text}
      </pre>
      <Button onClick={handleShare} variant={copied ? 'success' : 'default'} className="w-full">
        {copied ? (
          <>
            <Check className="h-4 w-4" /> Kopiert!
          </>
        ) : (
          <>
            <Share2 className="h-4 w-4" /> Del resultat
          </>
        )}
      </Button>
    </div>
  );
}
