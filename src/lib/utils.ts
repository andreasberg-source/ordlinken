import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns today's date as YYYY-MM-DD in the Europe/Oslo timezone.
 * Use this everywhere "today" is needed — never rely on UTC.
 */
export function getOsloDateString(date: Date = new Date()): string {
  return date.toLocaleDateString('sv-SE', { timeZone: 'Europe/Oslo' });
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function formatNorwegianDate(isoDate: string): string {
  const months = [
    'jan', 'feb', 'mar', 'apr', 'mai', 'jun',
    'jul', 'aug', 'sep', 'okt', 'nov', 'des',
  ];
  const [, mm, dd] = isoDate.split('-');
  return `${parseInt(dd)}. ${months[parseInt(mm) - 1]}`;
}
