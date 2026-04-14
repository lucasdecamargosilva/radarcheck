-- Tabela para rastrear pagamentos do Mercado Pago
CREATE TABLE public.pagamentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consulta_id UUID REFERENCES public.consultas(id) ON DELETE SET NULL,
  
  -- Dados do Mercado Pago
  payment_id TEXT NOT NULL UNIQUE,
  preference_id TEXT,
  merchant_order_id TEXT,
  
  -- Informações do pagamento
  status TEXT NOT NULL DEFAULT 'pending',
  status_detail TEXT,
  payment_type TEXT,
  payment_method_id TEXT,
  
  -- Valores
  transaction_amount DECIMAL(10,2) NOT NULL,
  currency_id TEXT DEFAULT 'BRL',
  
  -- Dados do pagador
  payer_email TEXT,
  payer_identification_type TEXT,
  payer_identification_number TEXT,
  
  -- Metadata
  external_reference TEXT,
  description TEXT,
  
  -- Controle de processamento
  webhook_received_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  recurso_gerado BOOLEAN DEFAULT false,
  recurso_gerado_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para melhor performance
CREATE INDEX idx_pagamentos_user_id ON public.pagamentos(user_id);
CREATE INDEX idx_pagamentos_payment_id ON public.pagamentos(payment_id);
CREATE INDEX idx_pagamentos_status ON public.pagamentos(status);
CREATE INDEX idx_pagamentos_created_at ON public.pagamentos(created_at DESC);

-- Enable RLS
ALTER TABLE public.pagamentos ENABLE ROW LEVEL SECURITY;

-- Users can view their own payments
CREATE POLICY "Users can view their own payments"
ON public.pagamentos
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admins can view all payments
CREATE POLICY "Admins can view all payments"
ON public.pagamentos
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_pagamentos_updated_at
BEFORE UPDATE ON public.pagamentos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Comentários para documentação
COMMENT ON TABLE public.pagamentos IS 'Armazena informações de pagamentos processados via Mercado Pago';
COMMENT ON COLUMN public.pagamentos.payment_id IS 'ID único do pagamento no Mercado Pago';
COMMENT ON COLUMN public.pagamentos.status IS 'Status do pagamento: pending, approved, rejected, cancelled, refunded';
COMMENT ON COLUMN public.pagamentos.recurso_gerado IS 'Indica se o recurso administrativo já foi gerado para este pagamento';