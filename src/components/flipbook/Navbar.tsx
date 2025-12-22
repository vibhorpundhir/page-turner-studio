import { Book, Menu, Plus, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface NavbarProps {
  title: string;
  onTitleChange?: (title: string) => void;
  onNewProject?: () => void;
  onOpenProjects?: () => void;
  showActions?: boolean;
}

export function Navbar({ 
  title, 
  onTitleChange, 
  onNewProject, 
  onOpenProjects,
  showActions = true 
}: NavbarProps) {
  return (
    <nav className="h-16 border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <Book className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl text-foreground hidden sm:block">
            Flipbook Maker
          </span>
        </Link>

        <div className="flex-1 max-w-md mx-4 hidden md:block">
          {onTitleChange ? (
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="w-full bg-transparent border-none text-center font-display font-semibold text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-lg px-4 py-2"
              placeholder="Untitled Flipbook"
            />
          ) : (
            <h1 className="text-center font-display font-semibold text-lg text-foreground">
              {title}
            </h1>
          )}
        </div>

        {showActions && (
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onNewProject}
              className="text-muted-foreground hover:text-foreground"
            >
              <Plus className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onOpenProjects}
              className="text-muted-foreground hover:text-foreground"
            >
              <FolderOpen className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
