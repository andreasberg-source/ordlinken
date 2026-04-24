import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/server';
import { Flame, Trophy, Target } from 'lucide-react';

export const metadata = { title: 'Profil — OrdLinken' };

export default async function ProfilPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/logg-inn');
  }

  const service = createServiceClient();

  const { data: profile } = await service
    .from('profiles')
    .select('username, current_streak, longest_streak, total_games, total_wins')
    .eq('id', user.id)
    .single();

  if (!profile) {
    return <main className="mx-auto mt-16 max-w-lg px-4 text-center text-slate-500 dark:text-slate-400">Profil ikke funnet.</main>;
  }

  const winRate = profile.total_games > 0
    ? Math.round((profile.total_wins / profile.total_games) * 100)
    : 0;

  const stats = [
    { label: 'Nåværende rekke', value: profile.current_streak, icon: Flame, color: 'text-orange-500' },
    { label: 'Lengste rekke', value: profile.longest_streak, icon: Trophy, color: 'text-yellow-500' },
    { label: 'Spilte dager', value: profile.total_games, icon: Target, color: 'text-blue-500' },
    { label: 'Vinnerprosent', value: `${winRate}%`, icon: Trophy, color: 'text-green-500' },
  ];

  return (
    <main className="mx-auto mt-8 max-w-lg px-4 pb-16">
      <h1 className="mb-1 text-2xl font-bold">{profile.username}</h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">{user.email}</p>

      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm">
            <div className={`mb-1 ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="text-3xl font-bold">{value}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
