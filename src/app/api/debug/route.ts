import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { getOsloDateString } from '@/lib/utils';

export const runtime = 'nodejs';

export async function GET() {
  const today = getOsloDateString();

  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌ missing',
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ? '✅' : '❌ missing',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅' : '❌ missing',
  };

  let puzzle = 'not checked';
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('puzzles')
      .select('play_date, hint_word_a, hint_word_b, puzzle_number')
      .eq('play_date', today)
      .single();
    puzzle = error ? `❌ ${error.message}` : data ? `✅ #${data.puzzle_number}: ${data.hint_word_a}/${data.hint_word_b}` : '❌ no row found';
  } catch (err) {
    puzzle = `❌ ${String(err)}`;
  }

  return NextResponse.json({ today, envVars, puzzle });
}
