'use client';

import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ShareCard from './ShareCard';
import type { CompletedGame } from '@/types/game';
import { formatTime } from '@/lib/utils';
import { Flame } from 'lucide-react';

interface GameResultProps {
  game: CompletedGame;
  puzzleNumber: number;
  playDate: string;
  isLoggedIn: boolean;
  newStreak?: number;
}

export default function GameResult({
  game,
  puzzleNumber,
  playDate,
  isLoggedIn,
  newStreak,
}: GameResultProps) {
  return (
    <Dialog open>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            {game.solved ? '🎉 Bra jobba!' : '😔 Neste gang!'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 pt-2">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-slate-100 dark:bg-slate-800 p-3">
              <div className="text-2xl font-bold">{game.solved ? game.guessCount : '–'}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Forsøk</div>
            </div>
            <div className="rounded-lg bg-slate-100 dark:bg-slate-800 p-3">
              <div className="text-2xl font-bold">{game.lifelineCount}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Hjelpemidler</div>
            </div>
            <div className="rounded-lg bg-slate-100 dark:bg-slate-800 p-3">
              <div className="text-2xl font-mono font-bold">{formatTime(game.elapsedSeconds)}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Tid</div>
            </div>
          </div>

          {/* Streak */}
          {isLoggedIn && newStreak !== undefined && newStreak > 0 && (
            <div className="flex items-center justify-center gap-2 text-orange-500 font-semibold">
              <Flame className="h-5 w-5" />
              <span>{newStreak} dagers rekke!</span>
            </div>
          )}

          {/* Share */}
          <ShareCard game={game} puzzleNumber={puzzleNumber} playDate={playDate} />

          {/* Guest login prompt */}
          {!isLoggedIn && (
            <div className="rounded-md border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/30 p-3 text-center text-sm">
              <p className="text-blue-800 dark:text-blue-200">
                Logg inn for å lagre rekken din og se topplisten
              </p>
              <div className="mt-2 flex gap-2 justify-center">
                <Button asChild size="sm" variant="outline">
                  <Link href="/logg-inn">Logg inn</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/register">Registrer deg</Link>
                </Button>
              </div>
            </div>
          )}

          {/* Leaderboard link for logged-in */}
          {isLoggedIn && (
            <Button asChild variant="outline" className="w-full">
              <Link href="/toppliste">Se topplisten</Link>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
