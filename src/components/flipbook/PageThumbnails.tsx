import { useState, useCallback } from 'react';
import { Copy, Trash2, GripVertical } from 'lucide-react';
import { FlipbookPage } from '@/types/flipbook';
import { Button } from '@/components/ui/button';

interface PageThumbnailsProps {
  pages: FlipbookPage[];
  currentPage: number;
  onPageSelect: (index: number) => void;
  onPageDelete: (pageId: string) => void;
  onPageDuplicate: (pageId: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export function PageThumbnails({
  pages,
  currentPage,
  onPageSelect,
  onPageDelete,
  onPageDuplicate,
  onReorder,
}: PageThumbnailsProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  }, [draggedIndex]);

  const handleDragEnd = useCallback(() => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      onReorder(draggedIndex, dragOverIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, [draggedIndex, dragOverIndex, onReorder]);

  if (pages.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
          <GripVertical className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-display font-semibold text-foreground mb-2">No Pages Yet</h3>
        <p className="text-sm text-muted-foreground">
          Upload images to start creating your flipbook
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="font-display font-semibold text-foreground">
          Pages ({pages.length})
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {pages.map((page, index) => (
          <div
            key={page.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            onClick={() => onPageSelect(index)}
            className={`thumbnail-item group ${
              currentPage === index ? 'active' : ''
            } ${
              draggedIndex === index ? 'dragging' : ''
            } ${
              dragOverIndex === index ? 'ring-2 ring-accent' : ''
            }`}
          >
            <div className="relative aspect-[4/3] bg-muted">
              <img
                src={page.imageUrl}
                alt={`Page ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Page number badge */}
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-background/80 backdrop-blur-sm text-xs font-medium text-foreground">
                {index + 1}
              </div>

              {/* Drag handle */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="w-4 h-4 text-foreground/70" />
              </div>

              {/* Actions overlay */}
              <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex justify-center gap-1">
                  <Button
                    variant="icon"
                    size="icon-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPageDuplicate(page.id);
                    }}
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="icon"
                    size="icon-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPageDelete(page.id);
                    }}
                    className="hover:bg-destructive/20 hover:text-destructive"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
