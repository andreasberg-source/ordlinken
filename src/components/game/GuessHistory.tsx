import GuessRow from './GuessRow';

interface GuessHistoryProps {
  guesses: string[];
  gameStatus: string;
}

export default function GuessHistory({ guesses, gameStatus }: GuessHistoryProps) {
  if (guesses.length === 0) return null;

  const isCorrectAtIndex = (i: number) =>
    gameStatus === 'won' && i === guesses.length - 1;

  return (
    <div className="flex flex-col gap-2">
      {guesses.map((guess, i) => (
        <GuessRow key={i} guess={guess} isCorrect={isCorrectAtIndex(i)} index={i} />
      ))}
    </div>
  );
}
