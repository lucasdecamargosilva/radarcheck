-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

-- Security definer function to check if user has a role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
END;
$$;

-- Function to get admin stats
CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_stats JSONB;
  v_total_users INTEGER;
  v_active_users INTEGER;
  v_total_consultas INTEGER;
  v_consultas_mes INTEGER;
  v_assinaturas_ativas INTEGER;
  v_mrr DECIMAL(10,2);
  v_receita_avulsa DECIMAL(10,2);
  v_mes_atual TEXT;
BEGIN
  -- Check if user is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  v_mes_atual := to_char(now(), 'YYYY-MM');

  -- Total users
  SELECT COUNT(*) INTO v_total_users FROM auth.users;

  -- Active users (users who made at least one consultation)
  SELECT COUNT(DISTINCT user_id) INTO v_active_users FROM public.consultas;

  -- Total consultations
  SELECT COUNT(*) INTO v_total_consultas FROM public.consultas;

  -- Consultations this month
  SELECT COUNT(*) INTO v_consultas_mes 
  FROM public.consultas 
  WHERE to_char(created_at, 'YYYY-MM') = v_mes_atual;

  -- Active subscriptions
  SELECT COUNT(*) INTO v_assinaturas_ativas
  FROM public.assinaturas
  WHERE status = 'active';

  -- MRR (Monthly Recurring Revenue)
  SELECT COALESCE(SUM(p.preco), 0) INTO v_mrr
  FROM public.assinaturas a
  JOIN public.planos p ON p.id = a.plano_id
  WHERE a.status = 'active' AND p.slug != 'payperuse';

  -- Revenue from pay-per-use
  SELECT COALESCE(SUM(u.consultas_pagas * 4.90), 0) INTO v_receita_avulsa
  FROM public.uso_consultas u
  WHERE u.mes_referencia = v_mes_atual;

  -- Build result
  v_stats := jsonb_build_object(
    'total_users', v_total_users,
    'active_users', v_active_users,
    'total_consultas', v_total_consultas,
    'consultas_mes', v_consultas_mes,
    'assinaturas_ativas', v_assinaturas_ativas,
    'mrr', v_mrr,
    'receita_avulsa', v_receita_avulsa,
    'receita_total_mes', v_mrr + v_receita_avulsa
  );

  RETURN v_stats;
END;
$$;

-- Function to get consultations by plan
CREATE OR REPLACE FUNCTION public.get_consultas_por_plano()
RETURNS TABLE(
  plano_nome TEXT,
  total_consultas BIGINT,
  usuarios_unicos BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  RETURN QUERY
  WITH user_plans AS (
    SELECT DISTINCT ON (c.user_id)
      c.user_id,
      COALESCE(p.nome, 'Gratuito') as plano_nome
    FROM public.consultas c
    LEFT JOIN public.assinaturas a ON a.user_id = c.user_id AND a.status = 'active'
    LEFT JOIN public.planos p ON p.id = a.plano_id
  )
  SELECT 
    up.plano_nome::TEXT,
    COUNT(c.id) as total_consultas,
    COUNT(DISTINCT c.user_id) as usuarios_unicos
  FROM public.consultas c
  JOIN user_plans up ON up.user_id = c.user_id
  GROUP BY up.plano_nome
  ORDER BY total_consultas DESC;
END;
$$;

-- Function to get monthly growth stats
CREATE OR REPLACE FUNCTION public.get_monthly_growth()
RETURNS TABLE(
  mes TEXT,
  novos_usuarios BIGINT,
  novas_consultas BIGINT,
  nova_receita DECIMAL
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  RETURN QUERY
  WITH meses AS (
    SELECT to_char(date_trunc('month', generate_series(
      now() - interval '6 months',
      now(),
      '1 month'
    )), 'YYYY-MM') as mes
  )
  SELECT 
    m.mes::TEXT,
    COALESCE(COUNT(DISTINCT p.id), 0) as novos_usuarios,
    COALESCE(COUNT(c.id), 0) as novas_consultas,
    COALESCE(SUM(CASE WHEN a.inicio >= date_trunc('month', to_date(m.mes, 'YYYY-MM')) 
                      THEN pl.preco ELSE 0 END), 0) as nova_receita
  FROM meses m
  LEFT JOIN public.profiles p ON to_char(p.created_at, 'YYYY-MM') = m.mes
  LEFT JOIN public.consultas c ON to_char(c.created_at, 'YYYY-MM') = m.mes
  LEFT JOIN public.assinaturas a ON to_char(a.inicio, 'YYYY-MM') = m.mes
  LEFT JOIN public.planos pl ON pl.id = a.plano_id
  GROUP BY m.mes
  ORDER BY m.mes;
END;
$$;