
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

interface SummaryCardProps {
  id: string;
  title: string;
  body: string;
  date: string;
  tags?: string[];
}

const SummaryCard: React.FC<SummaryCardProps> = ({ id, title, body, date, tags }) => {
  const truncatedBody = body?.split('\n').slice(0, 2).join('\n') || '';
  const formattedDate = new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Calendar size={14} />
          <span>{formattedDate}</span>
        </div>
        <CardTitle className="text-lg leading-tight">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {truncatedBody}
        </p>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}
        <Link to={`/summary/${id}`}>
          <Button variant="outline" size="sm" className="w-full">
            Read more
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
