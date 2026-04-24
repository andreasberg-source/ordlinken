import LeaderboardTable from '@/components/leaderboard/LeaderboardTable';
import { formatNorwegianDate, getOsloDateString } from '@/lib/utils';

export const metadata = { title: 'Toppliste — OrdLinken' };

export default function ToplistePage() {
  const today = getOsloDateString();
  const dateStr = formatNorwegianDate(today);

  return (
    <main className="mx-auto mt-8 max-w-lg px-4 pb-16">
      <h1 className="mb-1 text-2xl font-bold">Toppliste</h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">Dagens resultater — {dateStr}</p>
      <LeaderboardTable />
    </main>
  );
}
