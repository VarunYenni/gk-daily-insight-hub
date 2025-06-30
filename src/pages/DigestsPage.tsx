
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';

const DigestsPage = () => {
  const { data: files, isLoading, error } = useQuery({
    queryKey: ['digest-files'],
    queryFn: async () => {
      const { data, error } = await supabase.storage
        .from('weekly-digests')
        .list('', {
          limit: 50,
          sortBy: { column: 'created_at', order: 'desc' }
        });
      
      if (error) throw error;
      return data;
    }
  });

  const downloadFile = async (fileName: string) => {
    const { data, error } = await supabase.storage
      .from('weekly-digests')
      .download(fileName);
    
    if (error) {
      console.error('Error downloading file:', error);
      return;
    }

    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-muted animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-destructive">Failed to load digests</p>
      </div>
    );
  }

  const pdfFiles = files?.filter(file => file.name.endsWith('.pdf')) || [];

  return (
    <div className="p-4 pb-20">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Weekly Digests</h2>
        <p className="text-muted-foreground">Download comprehensive weekly summaries</p>
      </div>

      {pdfFiles.length > 0 ? (
        <div className="space-y-4">
          {pdfFiles.map((file) => (
            <Card key={file.name}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <FileText className="text-primary" size={24} />
                  <span>{file.name.replace('.pdf', '').replace(/-/g, ' ')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {file.updated_at && (
                      <span>
                        Updated: {new Date(file.updated_at).toLocaleDateString('en-IN')}
                      </span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => downloadFile(file.name)}
                    className="flex items-center gap-2"
                  >
                    <Download size={16} />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <FileText className="mx-auto mb-4 text-muted-foreground" size={48} />
          <p className="text-muted-foreground">No weekly digests available yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Check back later for comprehensive weekly summaries
          </p>
        </div>
      )}
    </div>
  );
};

export default DigestsPage;
