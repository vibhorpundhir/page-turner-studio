import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DbFlipbook {
  id: string;
  title: string;
  description: string | null;
  fps: number;
  slug: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbPage {
  id: string;
  flipbook_id: string;
  page_order: number;
  image_url: string;
  source_file_name: string | null;
  source_type: string | null;
  page_number: number | null;
  created_at: string;
  updated_at: string;
}

const generateSlug = () => {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
};

export function useFlipbookStorage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const uploadImage = useCallback(async (file: File): Promise<string | null> => {
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('flipbook-images')
      .upload(fileName, file);

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('flipbook-images')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  }, []);

  const uploadImages = useCallback(async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(file => uploadImage(file));
    const results = await Promise.all(uploadPromises);
    return results.filter((url): url is string => url !== null);
  }, [uploadImage]);

  const saveFlipbook = useCallback(async (
    flipbookData: {
      id?: string;
      title: string;
      description: string;
      fps: number;
      isPublic: boolean;
    },
    pages: { imageUrl: string; order: number; sourceFileName?: string; sourceType?: string; pageNumber?: number }[]
  ): Promise<DbFlipbook | null> => {
    setIsSaving(true);
    try {
      let flipbook: DbFlipbook;

      if (flipbookData.id) {
        // Update existing flipbook
        const { data, error } = await supabase
          .from('flipbooks')
          .update({
            title: flipbookData.title,
            description: flipbookData.description,
            fps: flipbookData.fps,
            is_public: flipbookData.isPublic,
          })
          .eq('id', flipbookData.id)
          .select()
          .single();

        if (error) throw error;
        flipbook = data as DbFlipbook;

        // Delete existing pages
        await supabase
          .from('pages')
          .delete()
          .eq('flipbook_id', flipbookData.id);
      } else {
        // Create new flipbook
        const slug = generateSlug();
        const { data, error } = await supabase
          .from('flipbooks')
          .insert({
            title: flipbookData.title,
            description: flipbookData.description,
            fps: flipbookData.fps,
            slug,
            is_public: flipbookData.isPublic,
          })
          .select()
          .single();

        if (error) throw error;
        flipbook = data as DbFlipbook;
      }

      // Insert pages
      if (pages.length > 0) {
        const { error: pagesError } = await supabase
          .from('pages')
          .insert(
            pages.map((page, index) => ({
              flipbook_id: flipbook.id,
              page_order: page.order ?? index,
              image_url: page.imageUrl,
              source_file_name: page.sourceFileName || null,
              source_type: page.sourceType || 'image',
              page_number: page.pageNumber || index + 1,
            }))
          );

        if (pagesError) throw pagesError;
      }

      toast({
        title: "Saved!",
        description: flipbookData.isPublic ? `Share link: /view/${flipbook.slug}` : "Flipbook saved successfully.",
      });

      return flipbook;
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: "Failed to save flipbook. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [toast]);

  const loadFlipbook = useCallback(async (id: string): Promise<{ flipbook: DbFlipbook; pages: DbPage[] } | null> => {
    setIsLoading(true);
    try {
      const { data: flipbook, error: flipbookError } = await supabase
        .from('flipbooks')
        .select('*')
        .eq('id', id)
        .single();

      if (flipbookError) throw flipbookError;

      const { data: pages, error: pagesError } = await supabase
        .from('pages')
        .select('*')
        .eq('flipbook_id', id)
        .order('page_order');

      if (pagesError) throw pagesError;

      return { flipbook: flipbook as DbFlipbook, pages: pages as DbPage[] };
    } catch (error) {
      console.error('Load error:', error);
      toast({
        title: "Error",
        description: "Failed to load flipbook.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const loadFlipbookBySlug = useCallback(async (slug: string): Promise<{ flipbook: DbFlipbook; pages: DbPage[] } | null> => {
    setIsLoading(true);
    try {
      const { data: flipbook, error: flipbookError } = await supabase
        .from('flipbooks')
        .select('*')
        .eq('slug', slug)
        .eq('is_public', true)
        .single();

      if (flipbookError) throw flipbookError;

      const { data: pages, error: pagesError } = await supabase
        .from('pages')
        .select('*')
        .eq('flipbook_id', (flipbook as DbFlipbook).id)
        .order('page_order');

      if (pagesError) throw pagesError;

      return { flipbook: flipbook as DbFlipbook, pages: pages as DbPage[] };
    } catch (error) {
      console.error('Load error:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const listFlipbooks = useCallback(async (): Promise<DbFlipbook[]> => {
    setIsLoading(true);
    try {
      // For MVP without auth, we list all flipbooks
      const { data, error } = await supabase
        .from('flipbooks')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data as DbFlipbook[];
    } catch (error) {
      console.error('List error:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteFlipbook = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('flipbooks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Deleted",
        description: "Flipbook has been deleted.",
      });
      return true;
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete flipbook.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  return {
    isSaving,
    isLoading,
    uploadImage,
    uploadImages,
    saveFlipbook,
    loadFlipbook,
    loadFlipbookBySlug,
    listFlipbooks,
    deleteFlipbook,
  };
}
