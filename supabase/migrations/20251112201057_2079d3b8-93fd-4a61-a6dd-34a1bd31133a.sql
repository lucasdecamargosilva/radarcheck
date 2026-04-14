-- Add admin-only SELECT policy for consultas table
-- This allows admins to view all consultation records for support and auditing purposes
-- while maintaining user isolation for regular users

CREATE POLICY "Admins can view all consultas"
ON public.consultas
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add comment documenting the sensitive nature of this table
COMMENT ON TABLE public.consultas IS 'Contains sensitive PII including CPF/CNPJ, driver names, and violation details. Protected by RLS policies that restrict access to record owners and admins only.';

-- Add indexes to improve query performance while maintaining security
CREATE INDEX IF NOT EXISTS idx_consultas_user_id ON public.consultas(user_id);
CREATE INDEX IF NOT EXISTS idx_consultas_created_at ON public.consultas(created_at DESC);