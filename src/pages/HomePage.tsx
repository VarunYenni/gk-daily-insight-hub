
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import SummaryCard from '@/components/summary/SummaryCard';
import { useAuth } from '@/components/auth/AuthProvider';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  const { user } = useAuth();

  const { data: summaries, isLoading, error } = useQuery({
    queryKey: ['summaries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('summaries')
        .select('*')
        .order('date', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data;
    }
  });

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

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-48 bg-muted animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-destructive">Failed to load summaries</p>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20 space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Latest Current Affairs</h2>
        <p className="text-muted-foreground">Stay updated with daily summaries</p>
      </div>
      
      {summaries && summaries.length > 0 ? (
        <div className="space-y-4">
          {summaries.map((summary) => (
            <SummaryCard
              key={summary.id}
              id={summary.id}
              title={summary.title || ''}
              body={summary.body || ''}
              date={summary.date || ''}
              tags={summary.tags || []}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No summaries available yet</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
