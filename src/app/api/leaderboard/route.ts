import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { getOsloDateString } from '@/lib/utils';
import type { LeaderboardEntry } from '@/types/api';

export async function GET() {
  const today = getOsloDateString();
  const service = createServiceClient();

  const { data, error } = await service
    .from('game_results')
    .select('user_id, solved, guess_count, lifeline_count, elapsed_seconds, profiles(username)')
    .eq('play_date', today)
    .order('solved', { ascending: false })
    .order('guess_count', { ascending: true })
    .order('lifeline_count', { ascending: true })
    .order('elapsed_seconds', { ascending: true })
    .limit(50);

  if (error) {
    return NextResponse.json({ entries: [] });
  }

  type Row = {
    user_id: string;
    solved: boolean;
    guess_count: number;
    lifeline_count: number;
    elapsed_seconds: number;
    profiles: { username: string } | null;
  };

  const entries: LeaderboardEntry[] = ((data ?? []) as Row[]).map((row, i) => ({
    username: row.profiles?.username ?? 'Ukjent',
    solved: row.solved,
    guessCount: row.guess_count,
    lifelineCount: row.lifeline_count,
    elapsedSeconds: row.elapsed_seconds,
    rank: i + 1,
  }));

  return NextResponse.json({ entries });
}
