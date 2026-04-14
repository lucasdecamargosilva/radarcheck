-- Create table for disclaimer acceptances
CREATE TABLE public.disclaimer_aceites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo_disclaimer TEXT NOT NULL DEFAULT 'recurso_administrativo',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.disclaimer_aceites ENABLE ROW LEVEL SECURITY;

-- Users can insert their own acceptances
CREATE POLICY "Users can insert their own disclaimer acceptances"
ON public.disclaimer_aceites
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can view their own acceptances
CREATE POLICY "Users can view their own disclaimer acceptances"
ON public.disclaimer_aceites
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admins can view all acceptances for audit purposes
CREATE POLICY "Admins can view all disclaimer acceptances"
ON public.disclaimer_aceites
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Create index for faster queries
CREATE INDEX idx_disclaimer_aceites_user_id ON public.disclaimer_aceites(user_id);
CREATE INDEX idx_disclaimer_aceites_created_at ON public.disclaimer_aceites(created_at DESC);