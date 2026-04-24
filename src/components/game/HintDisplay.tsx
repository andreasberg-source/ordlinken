'use client';

interface HintDisplayProps {
  hintWordA: string;
  hintWordB: string;
  aIsBefore: boolean | null; // null = position not yet revealed
  lifelineLetterCount: boolean;
  lifelineFirstLetter: boolean;
  solutionLength: number;
  solutionFirstLetter: string;
}

export default function HintDisplay({
  hintWordA,
  hintWordB,
  aIsBefore,
  lifelineLetterCount,
  lifelineFirstLetter,
  solutionLength,
  solutionFirstLetter,
}: HintDisplayProps) {
  const wordBefore = aIsBefore === null ? null : aIsBefore ? hintWordA : hintWordB;
  const wordAfter = aIsBefore === null ? null : aIsBefore ? hintWordB : hintWordA;

  // Build the solution placeholder
  let placeholder: string;
  if (lifelineFirstLetter && lifelineLetterCount) {
    placeholder = solutionFirstLetter + '_ '.repeat(solutionLength - 1).trim();
  } else if (lifelineFirstLetter) {
    placeholder = solutionFirstLetter + '...';
  } else if (lifelineLetterCount) {
    placeholder = '_ '.repeat(solutionLength).trim();
  } else {
    placeholder = '???';
  }

  if (aIsBefore === null) {
    // Position not revealed — show both hints with anonymous placeholder
    return (
      <div className="flex flex-col items-center gap-3">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Finn ordet som danner sammensatte ord med begge hint-ordene
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 text-lg font-semibold">
          <span className="rounded-lg bg-blue-100 dark:bg-blue-900/50 px-4 py-2 text-blue-800 dark:text-blue-200">{hintWordA}</span>
          <span className="text-slate-400 dark:text-slate-500">+</span>
          <span className="rounded-lg bg-slate-100 dark:bg-slate-700 px-4 py-2 text-slate-500 dark:text-slate-300 font-mono">{placeholder}</span>
          <span className="text-slate-400 dark:text-slate-500">+</span>
          <span className="rounded-lg bg-blue-100 dark:bg-blue-900/50 px-4 py-2 text-blue-800 dark:text-blue-200">{hintWordB}</span>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          (hvilket hint-ord kommer før, og hvilket etter, er ukjent)
        </p>
      </div>
    );
  }

  // Position revealed
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Finn løsningsordet som fyller inn mellomrommet
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2 text-lg font-semibold">
        <span className="rounded-lg bg-green-100 dark:bg-green-900/50 px-4 py-2 text-green-800 dark:text-green-200">{wordBefore}</span>
        <span className="text-slate-400 dark:text-slate-500">+</span>
        <span className="rounded-lg bg-slate-100 dark:bg-slate-700 px-4 py-2 text-slate-500 dark:text-slate-300 font-mono">{placeholder}</span>
        <span className="text-slate-400 dark:text-slate-500">+</span>
        <span className="rounded-lg bg-green-100 dark:bg-green-900/50 px-4 py-2 text-green-800 dark:text-green-200">{wordAfter}</span>
      </div>
    </div>
  );
}
