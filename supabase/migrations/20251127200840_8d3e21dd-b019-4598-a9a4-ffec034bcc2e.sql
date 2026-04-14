-- Remover política antiga que permitia acesso público
DROP POLICY IF EXISTS "Health checks are viewable by everyone" ON public.api_health_checks;

-- Criar nova política que permite apenas admins visualizarem
CREATE POLICY "Only admins can view health checks"
ON public.api_health_checks
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Adicionar política para admins poderem inserir health checks (para edge functions)
CREATE POLICY "Service role can insert health checks"
ON public.api_health_checks
FOR INSERT
WITH CHECK (true);