import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import SummaryCard from '@/components/summary/SummaryCard';
import { useAuth } from '@/components/auth/AuthProvider';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menubar, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar';

/* ─── helper: YYYY-MM-DD for n days ago ─── */
const isoDaysAgo = (n: number) => {
    const utcOffset = 5.5 * 60 * 60 * 1000;
    return new Date(Date.now() - n * 86_400_000 + utcOffset).toISOString().slice(0, 10);
}

const LAST_7_DATES = [...Array(7)].map((_, i) => isoDaysAgo(i + 1));

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string>(LAST_7_DATES[0]); // yesterday

  /* ─── fetch summaries for selectedDate ─── */
  const {
    data: summaries = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['summaries', selectedDate],
    queryFn: async () => {
      const { data, error } = await supabase
          .from('summaries')
          .select('*')
          .eq('date', selectedDate)
          .order('id', { ascending: false });

      if (error) throw error;
      return data;
    },
    staleTime: 100000 * 60, // 100 minutes
  });

  /* ─── unauthenticated landing ─── */
  if (!user) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to Daily GK</h1>
          <p className="text-muted-foreground mb-6">
            Your daily dose of current affairs for UPSC preparation
          </p>
          <Link to="/auth">
            <Button size="lg">Get Started</Button>
          </Link>
        </div>
    );
  }

  /* ─── loading skeleton ─── */
  if (isLoading) {
    return (
        <div className="p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
              <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
    );
  }

  /* ─── fetch error ─── */
  if (error) {
    return (
        <div className="p-4 text-center">
          <p className="text-destructive">Failed to load summaries</p>
        </div>
    );
  }

  /* ─── page UI ─── */
  return (
      <div className="p-4 pb-20 space-y-4">
        <header className="mb-4">
          <h2 className="text-2xl font-bold">Latest Current Affairs</h2>
          <p className="text-muted-foreground">
            Stay updated with daily summaries
          </p>

          {/* ─── menubar with last 7 days ─── */}
        </header>
        <div className="sticky top-20 z-20 bg-background">
          <Menubar className="mt-3 flex overflow-x-auto whitespace-nowrap overflow-y-hidden">
            <MenubarMenu>
              {LAST_7_DATES.map((d) => (
                  <MenubarTrigger
                      key={d}
                      className={`px-3 py-1 h-9 rounded-md transition-colors flex-shrink-0 ${
                          d === selectedDate
                              ? 'bg-primary/10 font-semibold pointer-events-none opacity-70'
                              : 'font-normal'
                      }`}
                      onClick={() => d !== selectedDate && setSelectedDate(d)}
                  >
                    {new Date(d).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </MenubarTrigger>
              ))}
            </MenubarMenu>
          </Menubar>
        </div>

        {summaries.length ? (
            <div className="space-y-4">
              {summaries.map((s) => (
                  <SummaryCard
                      key={s.id}
                      id={s.id}
                      title={s.title ?? ''}
                      body={s.body ?? ''}
                      date={s.date ?? ''}
                      tags={s.tags ?? []}
                  />
              ))}
            </div>
        ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No summaries for {new Date(selectedDate).toLocaleDateString('en-IN')}
              </p>
            </div>
        )}
      </div>
  );
};

export default HomePage;