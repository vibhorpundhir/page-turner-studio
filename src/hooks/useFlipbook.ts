import { useState, useCallback, useEffect, useRef } from 'react';
import { FlipbookPage } from '@/types/flipbook';

const generateId = () => Math.random().toString(36).substring(2, 15);

export function useFlipbook() {
  const [pages, setPages] = useState<FlipbookPage[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fps, setFps] = useState(12);
  const [title, setTitle] = useState('Untitled Flipbook');
  const [description, setDescription] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const addPages = useCallback((imageUrls: string[]) => {
    const newPages: FlipbookPage[] = imageUrls.map((url, index) => ({
      id: generateId(),
      imageUrl: url,
      order: pages.length + index,
    }));
    setPages(prev => [...prev, ...newPages]);
  }, [pages.length]);

  const removePage = useCallback((pageId: string) => {
    setPages(prev => {
      const filtered = prev.filter(p => p.id !== pageId);
      return filtered.map((p, i) => ({ ...p, order: i }));
    });
    setCurrentPage(prev => Math.min(prev, Math.max(0, pages.length - 2)));
  }, [pages.length]);

  const duplicatePage = useCallback((pageId: string) => {
    const pageIndex = pages.findIndex(p => p.id === pageId);
    if (pageIndex === -1) return;
    
    const page = pages[pageIndex];
    const newPage: FlipbookPage = {
      id: generateId(),
      imageUrl: page.imageUrl,
      order: pageIndex + 1,
    };
    
    setPages(prev => {
      const newPages = [...prev];
      newPages.splice(pageIndex + 1, 0, newPage);
      return newPages.map((p, i) => ({ ...p, order: i }));
    });
  }, [pages]);

  const reorderPages = useCallback((fromIndex: number, toIndex: number) => {
    setPages(prev => {
      const newPages = [...prev];
      const [movedPage] = newPages.splice(fromIndex, 1);
      newPages.splice(toIndex, 0, movedPage);
      return newPages.map((p, i) => ({ ...p, order: i }));
    });
  }, []);

  const nextPage = useCallback(() => {
    setCurrentPage(prev => (prev + 1) % Math.max(1, pages.length));
  }, [pages.length]);

  const prevPage = useCallback(() => {
    setCurrentPage(prev => (prev - 1 + pages.length) % Math.max(1, pages.length));
  }, [pages.length]);

  const goToPage = useCallback((index: number) => {
    setCurrentPage(Math.max(0, Math.min(index, pages.length - 1)));
  }, [pages.length]);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const clearPages = useCallback(() => {
    setPages([]);
    setCurrentPage(0);
    setIsPlaying(false);
  }, []);

  // Autoplay effect
  useEffect(() => {
    if (isPlaying && pages.length > 1) {
      intervalRef.current = setInterval(() => {
        nextPage();
      }, 1000 / fps);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, fps, pages.length, nextPage]);

  return {
    pages,
    currentPage,
    isPlaying,
    fps,
    title,
    description,
    addPages,
    removePage,
    duplicatePage,
    reorderPages,
    nextPage,
    prevPage,
    goToPage,
    togglePlay,
    setFps,
    setTitle,
    setDescription,
    clearPages,
  };
}
