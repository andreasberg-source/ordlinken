import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { puzzleId } = body as { puzzleId: string };

  if (!puzzleId) {
    return NextResponse.json({ error: 'Mangler puzzleId.' }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from('puzzles')
    .select('a_position')
    .eq('id', puzzleId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Ugyldig oppgave.' }, { status: 404 });
  }

  // a_position = 'before' means hint_word_a comes before the solution
  return NextResponse.json({ aIsBefore: data.a_position === 'before' });
}
