import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { getOsloDateString } from '@/lib/utils';
import type { SaveResultRequest } from '@/types/api';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Ikke innlogget.' }, { status: 401 });
  }

  const body: SaveResultRequest = await request.json();
  const { puzzleId, solved, guesses, guessCount, lifelinesUsed, lifelineCount, elapsedSeconds, playDate } = body;

  const service = createServiceClient();

  // Insert game result (upsert to handle retry if a prior save failed)
  const { error: insertError } = await service
    .from('game_results')
    .upsert({
      user_id: user.id,
      puzzle_id: puzzleId,
      play_date: playDate,
      solved,
      guess_count: guessCount,
      lifelines_used: lifelinesUsed,
      lifeline_count: lifelineCount,
      elapsed_seconds: elapsedSeconds,
    }, { onConflict: 'user_id,puzzle_id' });

  if (insertError) {
    console.error('Insert error:', insertError);
    return NextResponse.json({ error: 'Kunne ikke lagre resultat.' }, { status: 500 });
  }

  // Update streak and stats in profiles
  const { data: profile } = await service
    .from('profiles')
    .select('current_streak, longest_streak, last_played_date, total_games, total_wins')
    .eq('id', user.id)
    .single();

  if (profile) {
    const today = getOsloDateString();
    const yesterday = getOsloDateString(new Date(Date.now() - 86400000));
    const lastPlayed = profile.last_played_date;

    let newStreak = profile.current_streak;
    if (lastPlayed === yesterday) {
      newStreak = profile.current_streak + 1;
    } else if (lastPlayed === today) {
      // Already counted for today
      newStreak = profile.current_streak;
    } else {
      newStreak = 1;
    }

    const newLongest = Math.max(newStreak, profile.longest_streak);
    const totalGames = lastPlayed !== today ? profile.total_games + 1 : profile.total_games;
    const totalWins = (lastPlayed !== today && solved)
      ? profile.total_wins + 1
      : profile.total_wins;

    await service
      .from('profiles')
      .update({
        current_streak: newStreak,
        longest_streak: newLongest,
        last_played_date: today,
        total_games: totalGames,
        total_wins: totalWins,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    return NextResponse.json({ ok: true, newStreak });
  }

  return NextResponse.json({ ok: true });
}
