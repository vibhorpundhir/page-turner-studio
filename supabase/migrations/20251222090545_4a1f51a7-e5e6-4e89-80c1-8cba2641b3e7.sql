-- Create flipbooks table
CREATE TABLE public.flipbooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Untitled Flipbook',
  description TEXT,
  fps INTEGER NOT NULL DEFAULT 12,
  slug TEXT NOT NULL UNIQUE,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pages table
CREATE TABLE public.pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  flipbook_id UUID NOT NULL REFERENCES public.flipbooks(id) ON DELETE CASCADE,
  page_order INTEGER NOT NULL DEFAULT 0,
  image_url TEXT NOT NULL,
  source_file_name TEXT,
  source_type TEXT, -- 'image', 'pdf', 'pptx', 'docx'
  page_number INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.flipbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- RLS policies for flipbooks - anyone can view public flipbooks
CREATE POLICY "Public flipbooks are viewable by everyone" 
ON public.flipbooks 
FOR SELECT 
USING (is_public = true);

-- Anyone can create flipbooks (no auth for MVP)
CREATE POLICY "Anyone can create flipbooks" 
ON public.flipbooks 
FOR INSERT 
WITH CHECK (true);

-- Anyone can update flipbooks (no auth for MVP)
CREATE POLICY "Anyone can update flipbooks" 
ON public.flipbooks 
FOR UPDATE 
USING (true);

-- Anyone can delete flipbooks (no auth for MVP)
CREATE POLICY "Anyone can delete flipbooks" 
ON public.flipbooks 
FOR DELETE 
USING (true);

-- RLS policies for pages
CREATE POLICY "Pages are viewable if flipbook is public" 
ON public.pages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.flipbooks 
    WHERE flipbooks.id = pages.flipbook_id 
    AND flipbooks.is_public = true
  )
);

-- Anyone can manage pages (no auth for MVP)
CREATE POLICY "Anyone can insert pages" 
ON public.pages 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update pages" 
ON public.pages 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete pages" 
ON public.pages 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_flipbooks_updated_at
BEFORE UPDATE ON public.flipbooks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pages_updated_at
BEFORE UPDATE ON public.pages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster slug lookups
CREATE INDEX idx_flipbooks_slug ON public.flipbooks(slug);
CREATE INDEX idx_pages_flipbook_order ON public.pages(flipbook_id, page_order);

-- Create storage bucket for flipbook images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('flipbook-images', 'flipbook-images', true);

-- Storage policies for flipbook images
CREATE POLICY "Flipbook images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'flipbook-images');

CREATE POLICY "Anyone can upload flipbook images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'flipbook-images');

CREATE POLICY "Anyone can update flipbook images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'flipbook-images');

CREATE POLICY "Anyone can delete flipbook images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'flipbook-images');