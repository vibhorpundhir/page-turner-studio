import { Play, Pause, SkipBack, SkipForward, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FlipbookControlsProps {
  currentPage: number;
  totalPages: number;
  isPlaying: boolean;
  fps: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onTogglePlay: () => void;
  onGoToPage: (index: number) => void;
}

export function FlipbookControls({
  currentPage,
  totalPages,
  isPlaying,
  fps,
  onPrevPage,
  onNextPage,
  onTogglePlay,
  onGoToPage,
}: FlipbookControlsProps) {
  if (totalPages === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-2 p-4">
      <div className="flex items-center gap-1 bg-card/80 backdrop-blur-sm rounded-full px-2 py-1.5 shadow-lg border border-border/50">
        {/* First page */}
        <Button
          variant="control"
          size="icon-sm"
          onClick={() => onGoToPage(0)}
          disabled={currentPage === 0}
        >
          <SkipBack className="w-4 h-4" />
        </Button>

        {/* Previous page */}
        <Button
          variant="control"
          size="icon-sm"
          onClick={onPrevPage}
          disabled={currentPage === 0 && !isPlaying}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {/* Play/Pause */}
        <Button
          variant="gradient"
          size="icon"
          onClick={onTogglePlay}
          className="mx-1"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </Button>

        {/* Next page */}
        <Button
          variant="control"
          size="icon-sm"
          onClick={onNextPage}
          disabled={currentPage === totalPages - 1 && !isPlaying}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>

        {/* Last page */}
        <Button
          variant="control"
          size="icon-sm"
          onClick={() => onGoToPage(totalPages - 1)}
          disabled={currentPage === totalPages - 1}
        >
          <SkipForward className="w-4 h-4" />
        </Button>
      </div>

      {/* Page counter */}
      <div className="ml-4 px-4 py-2 bg-card/60 backdrop-blur-sm rounded-full border border-border/50">
        <span className="font-display font-medium text-sm">
          <span className="text-primary">{currentPage + 1}</span>
          <span className="text-muted-foreground mx-1">/</span>
          <span className="text-foreground">{totalPages}</span>
        </span>
      </div>

      {/* FPS indicator */}
      {isPlaying && (
        <div className="px-3 py-2 bg-primary/10 rounded-full border border-primary/20">
          <span className="text-xs font-medium text-primary">{fps} FPS</span>
        </div>
      )}
    </div>
  );
}
