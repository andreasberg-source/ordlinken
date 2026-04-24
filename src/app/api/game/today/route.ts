import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { getOsloDateString } from '@/lib/utils';

export async function GET() {
  const today = getOsloDateString();
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from('puzzles')
    .select('id, hint_word_a, hint_word_b, solution, puzzle_number, play_date')
    .eq('play_date', today)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: 'Ingen oppgave funnet for i dag.' },
      { status: 404 },
    );
  }

  // Never expose solution or a_position to the client
  return NextResponse.json({
    puzzleId: data.id,
    hintWordA: data.hint_word_a,
    hintWordB: data.hint_word_b,
    solutionLength: (data.solution as string).length,
    solutionFirstLetter: (data.solution as string)[0],
    puzzleNumber: data.puzzle_number ?? 1,
    playDate: data.play_date,
  });
}
