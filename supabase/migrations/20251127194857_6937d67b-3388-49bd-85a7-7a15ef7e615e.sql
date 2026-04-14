-- Tabela para armazenar health checks da API do Inmetro
CREATE TABLE IF NOT EXISTS public.api_health_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  checked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL CHECK (status IN ('online', 'offline', 'degraded')),
  response_time_ms INTEGER,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Índice para consultas por data
CREATE INDEX idx_health_checks_checked_at ON public.api_health_checks(checked_at DESC);

-- RLS: Permitir leitura pública dos health checks
ALTER TABLE public.api_health_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Health checks are viewable by everyone"
ON public.api_health_checks
FOR SELECT
USING (true);

-- Função para calcular uptime percentage
CREATE OR REPLACE FUNCTION public.get_api_uptime_stats(period_hours INTEGER DEFAULT 24)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_stats JSONB;
  v_total_checks INTEGER;
  v_online_checks INTEGER;
  v_offline_checks INTEGER;
  v_degraded_checks INTEGER;
  v_uptime_percentage NUMERIC;
  v_avg_response_time NUMERIC;
  v_last_check TIMESTAMP WITH TIME ZONE;
  v_last_status TEXT;
BEGIN
  -- Calcular stats do período
  SELECT 
    COUNT(*),
    COUNT(*) FILTER (WHERE status = 'online'),
    COUNT(*) FILTER (WHERE status = 'offline'),
    COUNT(*) FILTER (WHERE status = 'degraded'),
    AVG(response_time_ms) FILTER (WHERE status = 'online')
  INTO 
    v_total_checks,
    v_online_checks,
    v_offline_checks,
    v_degraded_checks,
    v_avg_response_time
  FROM public.api_health_checks
  WHERE checked_at >= now() - (period_hours || ' hours')::interval;
  
  -- Calcular uptime percentage
  IF v_total_checks > 0 THEN
    v_uptime_percentage := ROUND((v_online_checks::numeric / v_total_checks::numeric) * 100, 2);
  ELSE
    v_uptime_percentage := 0;
  END IF;
  
  -- Pegar último check
  SELECT checked_at, status
  INTO v_last_check, v_last_status
  FROM public.api_health_checks
  ORDER BY checked_at DESC
  LIMIT 1;
  
  -- Montar resultado
  v_stats := jsonb_build_object(
    'period_hours', period_hours,
    'total_checks', COALESCE(v_total_checks, 0),
    'online_checks', COALESCE(v_online_checks, 0),
    'offline_checks', COALESCE(v_offline_checks, 0),
    'degraded_checks', COALESCE(v_degraded_checks, 0),
    'uptime_percentage', COALESCE(v_uptime_percentage, 0),
    'avg_response_time_ms', COALESCE(ROUND(v_avg_response_time, 0), 0),
    'last_check_at', v_last_check,
    'last_status', v_last_status
  );
  
  RETURN v_stats;
END;
$$;