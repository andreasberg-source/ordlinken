'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { Flame } from 'lucide-react';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [streak, setStreak] = useState<number>(0);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) {
        supabase
          .from('profiles')
          .select('current_streak')
          .eq('id', data.user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile) setStreak(profile.current_streak);
          });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/spill';
  }

  return (
    <header className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
        <Link href="/spill" className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          OrdLinken
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link href="/toppliste" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100">
            Toppliste
          </Link>

          {user ? (
            <>
              <Link
                href="/profil"
                className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
              >
                {streak > 0 && (
                  <span className="flex items-center gap-0.5 font-semibold text-orange-500">
                    <Flame className="h-4 w-4" />
                    {streak}
                  </span>
                )}
                <span>Profil</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
              >
                Logg ut
              </button>
            </>
          ) : (
            <Link
              href="/logg-inn"
              className="rounded-md bg-slate-900 dark:bg-slate-100 px-3 py-1.5 text-white dark:text-slate-900 hover:bg-slate-700 dark:hover:bg-slate-300"
            >
              Logg inn
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
