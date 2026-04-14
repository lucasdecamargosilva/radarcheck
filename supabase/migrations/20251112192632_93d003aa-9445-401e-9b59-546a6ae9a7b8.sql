-- Create planos table
CREATE TABLE public.planos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  preco DECIMAL(10,2) NOT NULL DEFAULT 0,
  consultas_mensais INTEGER NOT NULL,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create assinaturas table
CREATE TABLE public.assinaturas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plano_id UUID NOT NULL REFERENCES public.planos(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_price_id TEXT,
  inicio TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  fim TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create uso_consultas table
CREATE TABLE public.uso_consultas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mes_referencia TEXT NOT NULL, -- formato: YYYY-MM
  consultas_usadas INTEGER NOT NULL DEFAULT 0,
  consultas_pagas INTEGER NOT NULL DEFAULT 0, -- pay-per-use
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, mes_referencia)
);

-- Enable RLS
ALTER TABLE public.planos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assinaturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uso_consultas ENABLE ROW LEVEL SECURITY;

-- RLS Policies for planos (public read)
CREATE POLICY "Planos are viewable by everyone"
ON public.planos FOR SELECT
USING (ativo = true);

-- RLS Policies for assinaturas
CREATE POLICY "Users can view their own subscription"
ON public.assinaturas FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription"
ON public.assinaturas FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
ON public.assinaturas FOR UPDATE
USING (auth.uid() = user_id);

-- RLS Policies for uso_consultas
CREATE POLICY "Users can view their own usage"
ON public.uso_consultas FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage"
ON public.uso_consultas FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage"
ON public.uso_consultas FOR UPDATE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_assinaturas_updated_at
BEFORE UPDATE ON public.assinaturas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_uso_consultas_updated_at
BEFORE UPDATE ON public.uso_consultas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default plans
INSERT INTO public.planos (nome, slug, preco, consultas_mensais, features) VALUES
('Gratuito', 'free', 0, 3, '["3 consultas por mês", "Geração simples de recurso (PDF)", "Acesso ao histórico"]'::jsonb),
('RadarCheck+', 'pro', 19.90, -1, '["Consultas ilimitadas", "Recursos avançados (PDF + DOC)", "Notificações de validade", "Suporte prioritário", "Dashboard completo"]'::jsonb),
('Pay-per-Use', 'payperuse', 4.90, 0, '["R$ 4,90 por consulta adicional", "Sem mensalidade", "Ideal para uso esporádico"]'::jsonb);

-- Function to check user consultation limit
CREATE OR REPLACE FUNCTION public.check_consultation_limit(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_plano RECORD;
  v_uso RECORD;
  v_mes_atual TEXT;
  v_resultado JSONB;
BEGIN
  v_mes_atual := to_char(now(), 'YYYY-MM');
  
  -- Get user's active subscription
  SELECT p.consultas_mensais, p.nome, p.slug
  INTO v_plano
  FROM public.assinaturas a
  JOIN public.planos p ON p.id = a.plano_id
  WHERE a.user_id = p_user_id
    AND a.status = 'active'
  LIMIT 1;
  
  -- If no subscription, use free plan
  IF NOT FOUND THEN
    SELECT consultas_mensais, nome, slug
    INTO v_plano
    FROM public.planos
    WHERE slug = 'free'
    LIMIT 1;
  END IF;
  
  -- Get current month usage
  SELECT consultas_usadas, consultas_pagas
  INTO v_uso
  FROM public.uso_consultas
  WHERE user_id = p_user_id
    AND mes_referencia = v_mes_atual;
  
  -- If no usage record, create one
  IF NOT FOUND THEN
    INSERT INTO public.uso_consultas (user_id, mes_referencia, consultas_usadas, consultas_pagas)
    VALUES (p_user_id, v_mes_atual, 0, 0);
    v_uso.consultas_usadas := 0;
    v_uso.consultas_pagas := 0;
  END IF;
  
  -- Build result
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

-- Function to increment usage
CREATE OR REPLACE FUNCTION public.increment_consultation_usage(p_user_id UUID, p_is_paid BOOLEAN DEFAULT false)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_mes_atual TEXT;
BEGIN
  v_mes_atual := to_char(now(), 'YYYY-MM');
  
  IF p_is_paid THEN
    -- Increment paid consultations
    INSERT INTO public.uso_consultas (user_id, mes_referencia, consultas_usadas, consultas_pagas)
    VALUES (p_user_id, v_mes_atual, 0, 1)
    ON CONFLICT (user_id, mes_referencia)
    DO UPDATE SET consultas_pagas = uso_consultas.consultas_pagas + 1, updated_at = now();
  ELSE
    -- Increment regular consultations
    INSERT INTO public.uso_consultas (user_id, mes_referencia, consultas_usadas, consultas_pagas)
    VALUES (p_user_id, v_mes_atual, 1, 0)
    ON CONFLICT (user_id, mes_referencia)
    DO UPDATE SET consultas_usadas = uso_consultas.consultas_usadas + 1, updated_at = now();
  END IF;
  
  RETURN true;
END;
$$;