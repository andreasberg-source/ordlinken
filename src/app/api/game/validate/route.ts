import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { puzzleId, guess } = body as { puzzleId: string; guess: string };

  if (!puzzleId || !guess) {
    return NextResponse.json({ error: 'Mangler data.' }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from('puzzles')
    .select('solution')
    .eq('id', puzzleId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Ugyldig oppgave.' }, { status: 404 });
  }

  const correct =
    guess.trim().toLowerCase() === (data.solution as string).toLowerCase();

  // Never return the solution — only whether the guess was correct
  return NextResponse.json({ correct });
}
