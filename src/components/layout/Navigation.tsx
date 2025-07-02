
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Bookmark, Brain, FileText, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Bookmark, label: 'Bookmarks', path: '/bookmarks' },
    { icon: Brain, label: 'Quiz', path: '/quiz' },
    { icon: FileText, label: 'Digests', path: '/digests' },
    { icon: User, label: 'Profile', path: '/profile' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map(({ icon: Icon, label, path }) => (
          <Link
            key={path}
            to={path}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
              location.pathname === path
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon size={20} />
            <span className="text-xs font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
