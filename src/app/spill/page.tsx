import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/server';
import { getOsloDateString } from '@/lib/utils';
import GameBoard from '@/components/game/GameBoard';
import type { DailyPuzzle } from '@/types/game';

export const metadata = { title: 'OrdLinken — Spill dagens oppgave' };

export default async function SpillPage() {
  // Get auth session
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch today's puzzle server-side (safe — no solution field)
  const today = getOsloDateString();
  const service = createServiceClient();

  const { data: puzzle } = await service
    .from('puzzles')
    .select('id, hint_word_a, hint_word_b, solution, puzzle_number, play_date')
    .eq('play_date', today)
    .single();

  if (!puzzle) {
    return (
      <main className="mx-auto mt-16 max-w-lg px-4 text-center">
        <p className="text-slate-500 dark:text-slate-400">Ingen oppgave tilgjengelig i dag. Kom tilbake i morgen!</p>
      </main>
    );
  }

  const dailyPuzzle: DailyPuzzle = {
    puzzleId: puzzle.id,
    hintWordA: puzzle.hint_word_a,
    hintWordB: puzzle.hint_word_b,
    solutionLength: (puzzle.solution as string).length,
    solutionFirstLetter: (puzzle.solution as string)[0],
    puzzleNumber: puzzle.puzzle_number ?? 1,
    playDate: puzzle.play_date,
  };

  // Check if logged-in user already played today
  if (user) {
    const { data: existing } = await service
      .from('game_results')
      .select('solved, guess_count, lifeline_count, elapsed_seconds')
      .eq('user_id', user.id)
      .eq('puzzle_id', puzzle.id)
      .single();

    if (existing) {
      return (
        <main className="mx-auto mt-8 max-w-lg px-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 text-center shadow-sm">
            <p className="text-lg font-semibold">Du har allerede spilt i dag!</p>
            <p className="mt-1 text-slate-500 dark:text-slate-400 text-sm">
              {existing.solved
                ? `Løst på ${existing.guess_count} forsøk med ${existing.lifeline_count} hjelpemiddel(er).`
                : 'Ikke løst i dag — prøv igjen i morgen!'}
            </p>
            <p className="mt-4 text-sm text-slate-400 dark:text-slate-500">Kom tilbake i morgen for ny oppgave.</p>
          </div>
        </main>
      );
    }
  }

  return (
    <main className="mx-auto mt-8 max-w-lg px-4 pb-16">
      <GameBoard puzzle={dailyPuzzle} isLoggedIn={!!user} />
    </main>
  );
}
