-- Fix security warnings by setting search_path on functions
CREATE OR REPLACE FUNCTION public.check_consultation_limit(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_plano RECORD;
  v_uso RECORD;
  v_mes_atual TEXT;
  v_resultado JSONB;
BEGIN
  v_mes_atual := to_char(now(), 'YYYY-MM');
  
  SELECT p.consultas_mensais, p.nome, p.slug
  INTO v_plano
  FROM public.assinaturas a
  JOIN public.planos p ON p.id = a.plano_id
  WHERE a.user_id = p_user_id
    AND a.status = 'active'
  LIMIT 1;
  
  IF NOT FOUND THEN
    SELECT consultas_mensais, nome, slug
    INTO v_plano
    FROM public.planos
    WHERE slug = 'free'
    LIMIT 1;
  END IF;
  
  SELECT consultas_usadas, consultas_pagas
  INTO v_uso
  FROM public.uso_consultas
  WHERE user_id = p_user_id
    AND mes_referencia = v_mes_atual;
  
  IF NOT FOUND THEN
    INSERT INTO public.uso_consultas (user_id, mes_referencia, consultas_usadas, consultas_pagas)
    VALUES (p_user_id, v_mes_atual, 0, 0);
    v_uso.consultas_usadas := 0;
    v_uso.consultas_pagas := 0;
  END IF;
  
  v_resultado := jsonb_build_object(
    'plano', v_plano.nome,
    'plano_slug', v_plano.slug,
    'limite_mensal', v_plano.consultas_mensais,
    'consultas_usadas', v_uso.consultas_usadas,
    'consultas_pagas', v_uso.consultas_pagas,
    'pode_consultar', (v_plano.consultas_mensais = -1 OR v_uso.consultas_usadas < v_plano.consultas_mensais),
    'mes_referencia', v_mes_atual
  );
  
  RETURN v_resultado;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_consultation_usage(p_user_id UUID, p_is_paid BOOLEAN DEFAULT false)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_mes_atual TEXT;
BEGIN
  v_mes_atual := to_char(now(), 'YYYY-MM');
  
  IF p_is_paid THEN
    INSERT INTO public.uso_consultas (user_id, mes_referencia, consultas_usadas, consultas_pagas)
    VALUES (p_user_id, v_mes_atual, 0, 1)
    ON CONFLICT (user_id, mes_referencia)
    DO UPDATE SET consultas_pagas = uso_consultas.consultas_pagas + 1, updated_at = now();
  ELSE
    INSERT INTO public.uso_consultas (user_id, mes_referencia, consultas_usadas, consultas_pagas)
    VALUES (p_user_id, v_mes_atual, 1, 0)
    ON CONFLICT (user_id, mes_referencia)
    DO UPDATE SET consultas_usadas = uso_consultas.consultas_usadas + 1, updated_at = now();
  END IF;
  
  RETURN true;
END;
$$;