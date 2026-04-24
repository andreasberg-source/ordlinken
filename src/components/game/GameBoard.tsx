'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import HintDisplay from './HintDisplay';
import GuessInput from './GuessInput';
import GuessHistory from './GuessHistory';
import LifelinePanel from './LifelinePanel';
import GameTimer from './GameTimer';
import GameResult from './GameResult';
import type { DailyPuzzle, LifelineType, CompletedGame } from '@/types/game';
import type { SaveResultRequest } from '@/types/api';

interface GameBoardProps {
  puzzle: DailyPuzzle;
  isLoggedIn: boolean;
}

export default function GameBoard({ puzzle, isLoggedIn }: GameBoardProps) {
  const {
    status,
    guesses,
    lifelinesUsed,
    elapsedSeconds,
    aIsBefore,
    initPuzzle,
    startPlaying,
    addGuess,
    useLifeline,
    revealPosition,
  } = useGameStore();

  const [newStreak, setNewStreak] = useState<number | undefined>(undefined);
  const [resultSaved, setResultSaved] = useState(false);

  useEffect(() => {
    initPuzzle(puzzle);
  }, [puzzle, initPuzzle]);

  const isFinished = status === 'won' || status === 'failed';

  // Save result when game ends (once)
  useEffect(() => {
    if (isFinished && isLoggedIn && !resultSaved) {
      setResultSaved(true);
      const body: SaveResultRequest = {
        puzzleId: puzzle.puzzleId,
        solved: status === 'won',
        guesses,
        guessCount: guesses.length,
        lifelinesUsed,
        lifelineCount: lifelinesUsed.length,
        elapsedSeconds,
        playDate: puzzle.playDate,
      };
      fetch('/api/result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.newStreak !== undefined) setNewStreak(data.newStreak);
        })
        .catch(console.error);
    }
  }, [isFinished, isLoggedIn, resultSaved, puzzle, status, guesses, lifelinesUsed, elapsedSeconds]);

  async function handleGuess(guess: string) {
    const res = await fetch('/api/game/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ puzzleId: puzzle.puzzleId, guess }),
    });
    const { correct } = await res.json();
    addGuess(guess, correct);
  }

  async function handleLifeline(type: LifelineType) {
    useLifeline(type);

    if (type === 'position') {
      const res = await fetch('/api/game/lifeline/position', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ puzzleId: puzzle.puzzleId }),
      });
      const { aIsBefore: revealed } = await res.json();
      revealPosition(revealed);
    }
    // letter_count and first_letter data is already in puzzle — handled in HintDisplay
  }

  const completedGame: CompletedGame | null =
    isFinished
      ? {
          puzzleId: puzzle.puzzleId,
          solved: status === 'won',
          guesses,
          guessCount: guesses.length,
          lifelinesUsed,
          lifelineCount: lifelinesUsed.length,
          elapsedSeconds,
        }
      : null;

  const guessesLeft = 5 - guesses.length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header: puzzle number + timer */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Oppgave #{puzzle.puzzleNumber}
        </span>
        <GameTimer />
      </div>

      {/* Hint words */}
      <HintDisplay
        hintWordA={puzzle.hintWordA}
        hintWordB={puzzle.hintWordB}
        aIsBefore={aIsBefore}
        lifelineLetterCount={lifelinesUsed.includes('letter_count')}
        lifelineFirstLetter={lifelinesUsed.includes('first_letter')}
        solutionLength={puzzle.solutionLength}
        solutionFirstLetter={puzzle.solutionFirstLetter}
      />

      {/* Guess history */}
      <GuessHistory guesses={guesses} gameStatus={status} />

      {/* Input */}
      {!isFinished && (
        <GuessInput
          onGuess={handleGuess}
          disabled={isFinished}
          guessesLeft={guessesLeft}
          onFirstInput={startPlaying}
        />
      )}

      {/* Lifelines */}
      {!isFinished && (
        <LifelinePanel
          lifelinesUsed={lifelinesUsed}
          onUseLifeline={handleLifeline}
          disabled={isFinished}
          solutionLength={puzzle.solutionLength}
          solutionFirstLetter={puzzle.solutionFirstLetter}
        />
      )}

      {/* Result modal */}
      {completedGame && (
        <GameResult
          game={completedGame}
          puzzleNumber={puzzle.puzzleNumber}
          playDate={puzzle.playDate}
          isLoggedIn={isLoggedIn}
          newStreak={newStreak}
        />
      )}
    </div>
  );
}
