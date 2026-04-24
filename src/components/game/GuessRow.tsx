interface GuessRowProps {
  guess: string;
  isCorrect: boolean;
  index: number;
}

export default function GuessRow({ guess, isCorrect, index }: GuessRowProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-5 text-right text-sm text-slate-400 dark:text-slate-500">{index + 1}.</span>
      <div
        className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium ${
          isCorrect
            ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200'
            : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
        }`}
      >
        {guess}
      </div>
      <span className="text-lg">{isCorrect ? '🟩' : '🟥'}</span>
    </div>
  );
}
