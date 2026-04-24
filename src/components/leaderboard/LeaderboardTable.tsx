'use client';

import { useEffect, useState } from 'react';
import { formatTime } from '@/lib/utils';
import type { LeaderboardEntry } from '@/types/api';
import { Trophy } from 'lucide-react';

export default function LeaderboardTable() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then((r) => r.json())
      .then((data) => {
        setEntries(data.entries ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-center text-slate-400 dark:text-slate-500 py-8">Laster...</p>;
  }

  if (entries.length === 0) {
    return <p className="text-center text-slate-400 dark:text-slate-500 py-8">Ingen resultater ennå i dag.</p>;
  }

  const medalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `${rank}.`;
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-left text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Spiller</th>
            <th className="px-4 py-3 text-center">Forsøk</th>
            <th className="px-4 py-3 text-center">Hjelp</th>
            <th className="px-4 py-3 text-right">Tid</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => (
            <tr
              key={i}
              className={`border-b border-slate-100 dark:border-slate-800 last:border-0 ${
                !entry.solved ? 'opacity-60' : ''
              }`}
            >
              <td className="px-4 py-3 text-lg">{medalEmoji(entry.rank)}</td>
              <td className="px-4 py-3 font-medium">
                {entry.username}
                {!entry.solved && (
                  <span className="ml-2 text-xs text-red-400 dark:text-red-500">ikke løst</span>
                )}
              </td>
              <td className="px-4 py-3 text-center">
                {entry.solved ? `${entry.guessCount}/5` : '–'}
              </td>
              <td className="px-4 py-3 text-center">{entry.lifelineCount}/3</td>
              <td className="px-4 py-3 text-right font-mono">{formatTime(entry.elapsedSeconds)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
