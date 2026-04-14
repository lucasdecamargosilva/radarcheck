-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  cpf_cnpj TEXT,
  telefone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create radares table (cache for Inmetro data)
CREATE TABLE public.radares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_serie TEXT NOT NULL UNIQUE,
  marca TEXT,
  modelo TEXT,
  status_aprovado BOOLEAN NOT NULL DEFAULT false,
  numero_certificado TEXT,
  data_certificado TEXT,
  validade_certificado TEXT,
  mensagem TEXT,
  uf TEXT,
  municipio TEXT,
  last_checked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on radares
ALTER TABLE public.radares ENABLE ROW LEVEL SECURITY;

-- Radares policies (public read for cache, only edge function can write)
CREATE POLICY "Anyone can view radares cache"
  ON public.radares
  FOR SELECT
  USING (true);

-- Create consultas table (user consultation history)
CREATE TABLE public.consultas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  radar_id UUID REFERENCES public.radares(id),
  numero_serie TEXT NOT NULL,
  numero_auto TEXT,
  data_infracao TEXT,
  local_infracao TEXT,
  nome_condutor TEXT,
  cpf_cnpj_condutor TEXT,
  nome_proprietario TEXT,
  cpf_cnpj_proprietario TEXT,
  resultado JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on consultas
ALTER TABLE public.consultas ENABLE ROW LEVEL SECURITY;

-- Consultas policies
CREATE POLICY "Users can view their own consultas"
  ON public.consultas
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own consultas"
  ON public.consultas
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_radares_numero_serie ON public.radares(numero_serie);
CREATE INDEX idx_radares_last_checked ON public.radares(last_checked_at);
CREATE INDEX idx_consultas_user_id ON public.consultas(user_id);
CREATE INDEX idx_consultas_created_at ON public.consultas(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();