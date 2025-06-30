
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bookmark, BookmarkCheck, Calendar, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SummaryPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: summary, isLoading } = useQuery({
    queryKey: ['summary', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('summaries')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  const { data: bookmark } = useQuery({
    queryKey: ['bookmark', id, user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('summary_id', id)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!id
  });

  const bookmarkMutation = useMutation({
    mutationFn: async () => {
      if (!user || !id) throw new Error('User or summary ID not found');

      if (bookmark) {
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('id', bookmark.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('bookmarks')
          .insert([{ summary_id: id, user_id: user.id }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmark', id, user?.id] });
      toast({
        title: bookmark ? 'Bookmark removed' : 'Bookmark added',
        description: bookmark ? 'Summary removed from bookmarks' : 'Summary added to bookmarks'
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update bookmark',
        variant: 'destructive'
      });
    }
  });

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="space-y-4">
          <div className="h-8 bg-muted animate-pulse rounded"></div>
          <div className="h-4 bg-muted animate-pulse rounded w-1/2"></div>
          <div className="h-64 bg-muted animate-pulse rounded"></div>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="p-4 text-center">
        <p className="text-destructive">Summary not found</p>
      </div>
    );
  }

  const formattedDate = new Date(summary.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="p-4 pb-20">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Calendar size={14} />
            <span>{formattedDate}</span>
          </div>
          <CardTitle className="text-xl leading-tight">{summary.title}</CardTitle>
          {user && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => bookmarkMutation.mutate()}
              disabled={bookmarkMutation.isPending}
              className="w-fit"
            >
              {bookmark ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
              <span className="ml-2">
                {bookmark ? 'Bookmarked' : 'Bookmark'}
              </span>
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose prose-sm max-w-none">
            {summary.body?.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-3 text-sm leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {summary.tags && summary.tags.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {summary.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {summary.source_url && (
            <div className="pt-4 border-t">
              <a
                href={summary.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <ExternalLink size={14} />
                View Source
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryPage;
