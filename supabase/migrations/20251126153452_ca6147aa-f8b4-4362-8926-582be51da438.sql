-- Allow users to delete their own consultations
-- Note: Deleting consultations does NOT affect the uso_consultas table
-- This ensures plan limits remain enforced even if users delete consultation history
CREATE POLICY "Users can delete their own consultas"
ON public.consultas
FOR DELETE
USING (auth.uid() = user_id);