
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import SummaryCard from '@/components/summary/SummaryCard';

const BookmarksPage = () => {
  const { user } = useAuth();

  const { data: bookmarks, isLoading, error } = useQuery({
    queryKey: ['bookmarks', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('bookmarks')
        .select(`
          id,
          summaries (
            id,
            title,
            body,
            date,
            tags
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-48 bg-muted animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-destructive">Failed to load bookmarks</p>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Your Bookmarks</h2>
        <p className="text-muted-foreground">Saved summaries for later reading</p>
      </div>

      {bookmarks && bookmarks.length > 0 ? (
        <div className="space-y-4">
          {bookmarks.map((bookmark) => {
            const summary = bookmark.summaries;
            if (!summary) return null;
            
            return (
              <SummaryCard
                key={bookmark.id}
                id={summary.id}
                title={summary.title || ''}
                body={summary.body || ''}
                date={summary.date || ''}
                tags={summary.tags || []}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No bookmarks yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Start bookmarking summaries you want to read later
          </p>
        </div>
      )}
    </div>
  );
};

export default BookmarksPage;
