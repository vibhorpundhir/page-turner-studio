-- Drop restrictive SELECT policies
DROP POLICY IF EXISTS "Public flipbooks are viewable by everyone" ON public.flipbooks;
DROP POLICY IF EXISTS "Pages are viewable if flipbook is public" ON public.pages;

-- Create new SELECT policies that allow viewing all flipbooks (for MVP without auth)
CREATE POLICY "Anyone can view all flipbooks"
ON public.flipbooks FOR SELECT
USING (true);

CREATE POLICY "Anyone can view all pages"
ON public.pages FOR SELECT
USING (true);