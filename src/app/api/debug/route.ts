import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { getOsloDateString } from '@/lib/utils';

export const runtime = 'nodejs';

export async function GET() {
  const vars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
  ];

  const envResult = Object.fromEntries(
    vars.map((key) => {
      const val = process.env[key];
      return [key, val ? `✅ set (${val.slice(0, 8)}...)` : '❌ missing'];
    }),
  );

  const today = getOsloDateString();
  let puzzleResult: string;

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('puzzles')
      .select('play_date, hint_word_a, hint_word_b, puzzle_number')
      .eq('play_date', today)
      .single();

    if (error) puzzleResult = `❌ query error: ${error.message}`;
    else if (!data) puzzleResult = `❌ no puzzle found for ${today}`;
    else puzzleResult = `✅ found puzzle #${data.puzzle_number} (${data.hint_word_a} / ${data.hint_word_b})`;
  } catch (e: unknown) {
    puzzleResult = `❌ exception: ${e instanceof Error ? e.message : String(e)}`;
  }

  return NextResponse.json({
    env: envResult,
    serverDate: today,
    puzzle: puzzleResult,
  });
}
