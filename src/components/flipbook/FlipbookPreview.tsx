import { useState, useEffect, useRef } from 'react';
import { FlipbookPage } from '@/types/flipbook';
import { Book } from 'lucide-react';

interface FlipbookPreviewProps {
  pages: FlipbookPage[];
  currentPage: number;
  isPlaying: boolean;
}

export function FlipbookPreview({ pages, currentPage, isPlaying }: FlipbookPreviewProps) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [displayPage, setDisplayPage] = useState(currentPage);
  const prevPageRef = useRef(currentPage);

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

  if (pages.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 animate-float">
          <Book className="w-12 h-12 text-primary" />
        </div>
        <h2 className="font-display font-bold text-2xl text-foreground mb-3">
          Create Your Flipbook
        </h2>
        <p className="text-muted-foreground max-w-sm">
          Upload images to start building your animated flipbook. Drag and drop or use the upload panel on the right.
        </p>
      </div>
    );
  }

  const currentPageData = pages[displayPage];

  return (
    <div className="h-full flex items-center justify-center p-4 md:p-8">
      <div className="relative w-full max-w-2xl aspect-[4/3]">
        {/* Book shadow */}
        <div className="absolute -bottom-6 inset-x-4 h-12 bg-gradient-to-t from-background/80 to-transparent blur-xl" />
        
        {/* Book container */}
        <div className="flipbook-page relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
          {/* Page background */}
          <div className="absolute inset-0 bg-card" />
          
          {/* Current page */}
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
          
          {/* Corner curl effect */}
          <div className="absolute bottom-0 right-0 w-16 h-16">
            <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[40px] border-l-transparent border-b-[40px] border-b-muted/50 opacity-50" />
          </div>
        </div>

        {/* Page indicator */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-1.5">
            {pages.slice(0, Math.min(pages.length, 10)).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === displayPage
                    ? 'bg-primary w-6'
                    : 'bg-muted-foreground/30'
                }`}
              />
            ))}
            {pages.length > 10 && (
              <span className="text-xs text-muted-foreground ml-2">
                +{pages.length - 10} more
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
