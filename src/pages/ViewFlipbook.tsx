import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFlipbookStorage, DbFlipbook, DbPage } from '@/hooks/useFlipbookStorage';
import { FlipbookPage } from '@/types/flipbook';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Play, Pause, Home, Loader2 } from 'lucide-react';

export default function ViewFlipbook() {
  const { slug } = useParams<{ slug: string }>();
  const { loadFlipbookBySlug, isLoading } = useFlipbookStorage();
  
  const [flipbook, setFlipbook] = useState<DbFlipbook | null>(null);
  const [pages, setPages] = useState<FlipbookPage[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [displayPage, setDisplayPage] = useState(0);
  const [notFound, setNotFound] = useState(false);
  
  const prevPageRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (slug) {
      loadFlipbookBySlug(slug).then(result => {
        if (result) {
          setFlipbook(result.flipbook);
          setPages(result.pages.map((p, i) => ({
            id: p.id,
            imageUrl: p.image_url,
            order: p.page_order,
          })));
        } else {
          setNotFound(true);
        }
      });
    }
  }, [slug, loadFlipbookBySlug]);

  const nextPage = useCallback(() => {
    setCurrentPage(prev => (prev + 1) % Math.max(1, pages.length));
  }, [pages.length]);

  const prevPage = useCallback(() => {
    setCurrentPage(prev => (prev - 1 + pages.length) % Math.max(1, pages.length));
  }, [pages.length]);

  // Page flip animation
  useEffect(() => {
    if (currentPage !== prevPageRef.current) {
      setIsFlipping(true);
      const timeout = setTimeout(() => {
        setDisplayPage(currentPage);
        setIsFlipping(false);
      }, 300);
      prevPageRef.current = currentPage;
      return () => clearTimeout(timeout);
    }
  }, [currentPage]);

  // Autoplay
  useEffect(() => {
    if (isPlaying && pages.length > 1 && flipbook) {
      intervalRef.current = setInterval(() => {
        nextPage();
      }, 1000 / flipbook.fps);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, flipbook?.fps, pages.length, nextPage]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-display font-bold text-foreground">Flipbook Not Found</h1>
        <p className="text-muted-foreground">This flipbook doesn't exist or is not public.</p>
        <Button asChild>
          <Link to="/">
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Link>
        </Button>
      </div>
    );
  }

  if (!flipbook || pages.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-display font-bold text-foreground">Empty Flipbook</h1>
        <p className="text-muted-foreground">This flipbook has no pages.</p>
        <Button asChild>
          <Link to="/">
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Link>
        </Button>
      </div>
    );
  }

  const currentPageData = pages[displayPage];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-xl text-foreground">{flipbook.title}</h1>
            {flipbook.description && (
              <p className="text-sm text-muted-foreground">{flipbook.description}</p>
            )}
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Link>
          </Button>
        </div>
      </header>

      {/* Preview */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="relative w-full max-w-3xl aspect-[4/3]">
          {/* Book shadow */}
          <div className="absolute -bottom-6 inset-x-4 h-12 bg-gradient-to-t from-background/80 to-transparent blur-xl" />
          
          {/* Book container */}
          <div className="flipbook-page relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-card" />
            
            <div
              className={`absolute inset-0 transition-all duration-300 ${
                isFlipping ? 'scale-[0.98] opacity-90' : 'scale-100 opacity-100'
              }`}
            >
              {currentPageData && (
                <img
                  src={currentPageData.imageUrl}
                  alt={`Page ${displayPage + 1}`}
                  className="w-full h-full object-contain bg-muted"
                />
              )}
            </div>

            {/* Page flip effect overlay */}
            <div
              className={`absolute inset-y-0 right-0 w-1/2 transition-all duration-300 pointer-events-none ${
                isFlipping ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="h-full page-shadow" />
            </div>

            {/* Subtle page edge effect */}
            <div className="absolute inset-y-2 left-0 w-1 bg-gradient-to-r from-muted-foreground/10 to-transparent rounded-l-sm" />
          </div>
        </div>
      </main>

      {/* Controls */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm py-4">
        <div className="container mx-auto px-4 flex items-center justify-center gap-4">
          <Button variant="control" size="icon" onClick={prevPage}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          
          <Button variant="control" size="icon" onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </Button>
          
          <Button variant="control" size="icon" onClick={nextPage}>
            <ChevronRight className="w-5 h-5" />
          </Button>

          <div className="ml-4 text-sm text-muted-foreground">
            Page {currentPage + 1} of {pages.length}
          </div>
        </div>
      </footer>
    </div>
  );
}
