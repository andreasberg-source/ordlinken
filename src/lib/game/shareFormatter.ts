import type { CompletedGame } from '@/types/game';
import { formatTime, formatNorwegianDate } from '@/lib/utils';

export function buildShareText(game: CompletedGame, puzzleNumber: number, playDate: string): string {
  const dateStr = formatNorwegianDate(playDate);
  const header = `OrdLinken #${puzzleNumber} — ${dateStr}`;

  const statusLine = game.solved
    ? `✅ Løst på ${game.guessCount}/5 forsøk (${formatTime(game.elapsedSeconds)})`
    : `❌ Ikke løst (${formatTime(game.elapsedSeconds)})`;

  const lifelineLine =
    game.lifelineCount === 0
      ? `💡 Ingen hjelpemidler brukt`
      : `💡 Hjelpemidler brukt: ${game.lifelineCount}/3`;

  // Build guess grid: one emoji per guess
  const grid = game.guesses
    .map((_, i) => (i === game.guesses.length - 1 && game.solved ? '🟩' : '🟥'))
    .join('');

  const lines = [header, statusLine, lifelineLine, '', grid];
  return lines.join('\n');
}
