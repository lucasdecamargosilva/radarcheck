-- Drop the existing public access policy
DROP POLICY IF EXISTS "Anyone can view radares cache" ON public.radares;

-- Add new policy requiring authentication
CREATE POLICY "Authenticated users can view radares cache"
ON public.radares
FOR SELECT
TO authenticated
USING (true);

-- Add comment documenting the data source and access control
COMMENT ON TABLE public.radares IS 'Cache of speed camera data from INMETRO. Contains public government data but access restricted to authenticated users to prevent scraping by competitors.';