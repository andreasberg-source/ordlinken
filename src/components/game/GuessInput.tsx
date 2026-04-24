'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface GuessInputProps {
  onGuess: (guess: string) => Promise<void>;
  disabled: boolean;
  guessesLeft: number;
  onFirstInput: () => void;
}

export default function GuessInput({ onGuess, disabled, guessesLeft, onFirstInput }: GuessInputProps) {
  const [value, setValue] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [shake, setShake] = useState(false);
  const firstInputFired = useRef(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim().toLowerCase();
    if (trimmed.length < 2 || submitting) return;

    setSubmitting(true);
    await onGuess(trimmed);
    setValue('');
    setSubmitting(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    // Only letters and Norwegian characters
    if (/[^a-zæøåA-ZÆØÅ\s]/.test(val)) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    if (!firstInputFired.current && val.length > 0) {
      firstInputFired.current = true;
      onFirstInput();
    }
    setValue(val);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Skriv inn gjettet ord..."
        disabled={disabled}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
        className={shake ? 'border-red-400' : ''}
      />
      <Button type="submit" disabled={disabled || submitting || value.trim().length < 2}>
        Gjett
      </Button>
      <span className="flex items-center text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
        {guessesLeft}/5
      </span>
    </form>
  );
}
