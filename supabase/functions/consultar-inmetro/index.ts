// Supabase Edge Function para consultar Inmetro
// Deploy automático via Lovable Cloud
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.80.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConsultaRequest {
  numeroSerie: string;
  uf?: string;
  municipio?: string;
  marca?: string;
  modelo?: string;
  numeroAuto?: string;
  dataInfracao?: string;
  localInfracao?: string;
  nomeCondutor?: string;
  cpfCnpjCondutor?: string;
  nomeProprietario?: string;
  cpfCnpjProprietario?: string;
}

// Util: fetch with retries and timeout
async function fetchWithRetry(url: string, init: RequestInit, retries = 5, backoffMs = 1500) {
  for (let attempt = 0; attempt < retries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // Aumentado para 30s
    try {
      console.log(`Tentativa ${attempt + 1}/${retries} para ${url}`);
      const res = await fetch(url, { ...init, signal: controller.signal });
      clearTimeout(timeout);
      
      console.log(`Resposta HTTP ${res.status} para ${url}`);
      
      if (!res.ok) {
        // Se for erro 4xx ou 5xx, logar e tentar novamente
        console.warn(`HTTP ${res.status} - ${res.statusText}`);
        throw new Error(`HTTP ${res.status}`);
      }
      
      return res;
    } catch (err) {
      clearTimeout(timeout);
      console.error(`Erro na tentativa ${attempt + 1}:`, err instanceof Error ? err.message : 'Erro desconhecido');
      
      if (attempt === retries - 1) {
        console.error(`Todas as ${retries} tentativas falharão para ${url}`);
        throw err;
      }
      
      // Backoff exponencial com jitter
      const delay = backoffMs * Math.pow(2, attempt) + Math.floor(Math.random() * 1000);
      console.log(`Aguardando ${delay}ms antes da próxima tentativa...`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error('Unexpected retry failure');
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Inicializar Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! }
      }
    });

    // Verify JWT and get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Authentication failed:', authError);
      return new Response(
        JSON.stringify({ 
          error: 'Authentication required',
          message: 'You must be logged in to perform consultations'
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Authenticated user:', user.id);

    // Use authenticated user ID
    const userId = user.id;

    // Rate limiting: Check recent consultation count (10 per minute)
    const oneMinuteAgo = new Date(Date.now() - 60000).toISOString();
    const { count, error: countError } = await supabase
      .from('consultas')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', oneMinuteAgo);

    if (countError) {
      console.error('Error checking rate limit:', countError);
    }

    if (count !== null && count >= 10) {
      console.log('Rate limit exceeded for user:', userId);
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded',
          message: 'Você atingiu o limite de 10 consultas por minuto. Tente novamente em alguns instantes.'
        }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { 
      numeroSerie, uf, municipio, marca, modelo,
      numeroAuto, dataInfracao, localInfracao,
      nomeCondutor, cpfCnpjCondutor, nomeProprietario, cpfCnpjProprietario
    }: ConsultaRequest = await req.json();

    console.log('Consultando Inmetro para número de série:', numeroSerie);

    // Verificar cache (válido por 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: cachedRadar, error: cacheError } = await supabase
      .from('radares')
      .select('*')
      .eq('numero_serie', numeroSerie)
      .gte('last_checked_at', thirtyDaysAgo.toISOString())
      .single();

    if (!cacheError && cachedRadar) {
      console.log('Retornando dados do cache');
      
      // Salvar consulta no histórico do usuário
      await supabase.from('consultas').insert({
          user_id: userId,
          radar_id: cachedRadar.id,
          numero_serie: numeroSerie,
          numero_auto: numeroAuto,
          data_infracao: dataInfracao,
          local_infracao: localInfracao,
          nome_condutor: nomeCondutor,
          cpf_cnpj_condutor: cpfCnpjCondutor,
          nome_proprietario: nomeProprietario,
          cpf_cnpj_proprietario: cpfCnpjProprietario,
          resultado: {
            status_aprovado: cachedRadar.status_aprovado,
            numero_certificado: cachedRadar.numero_certificado,
            data_certificado: cachedRadar.data_certificado,
            validade_certificado: cachedRadar.validade_certificado,
            mensagem: cachedRadar.mensagem,
            fonte: 'Cache (PSIE Inmetro)',
            numero_serie: numeroSerie
          }
        });

      return new Response(
        JSON.stringify({
          status_aprovado: cachedRadar.status_aprovado,
          numero_certificado: cachedRadar.numero_certificado,
          data_certificado: cachedRadar.data_certificado,
          validade_certificado: cachedRadar.validade_certificado,
          mensagem: cachedRadar.mensagem,
          fonte: 'Cache (PSIE Inmetro)',
          numero_serie: numeroSerie,
          from_cache: true
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Consultando Inmetro para número de série:', numeroSerie);

    // URL do sistema PSIE do Inmetro
    const baseUrl = 'https://servicos.rbmlq.gov.br';
    
    // PASSO 1: Fazer GET inicial para obter cookies de sessão
    console.log('Obtendo sessão do servidor Inmetro...');
    let cookies: string[] = [];
    
    try {
      const initialResponse = await fetchWithRetry(`${baseUrl}/Instrumento`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Upgrade-Insecure-Requests': '1'
        }
      }, 2);
      
      // Extrair cookies da resposta
      const setCookieHeaders = initialResponse.headers.get('set-cookie');
      if (setCookieHeaders) {
        cookies = setCookieHeaders.split(',').map(c => c.split(';')[0].trim());
        console.log('Cookies obtidos:', cookies.length);
      }
      
      // Aguardar um pouco para simular comportamento humano
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (err) {
      console.warn('Erro ao obter sessão inicial, continuando mesmo assim:', err);
    }
    
    // PASSO 2: Fazer POST com os dados do formulário usando os cookies
    const formData = new URLSearchParams();
    formData.append('TipoInstrumento', '322'); // Código para Medidores de Velocidade
    formData.append('NumeroSerie', numeroSerie);
    
    if (uf) formData.append('UF', uf);
    if (municipio) formData.append('Municipio', municipio);
    if (marca) formData.append('Marca', marca);
    if (modelo) formData.append('Modelo', modelo);

    console.log('Fazendo requisição POST ao PSIE Inmetro com sessão...');

    let htmlContent = '';
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Origin': baseUrl,
        'Referer': `${baseUrl}/Instrumento`,
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1'
      };
      
      // Adicionar cookies se existirem
      if (cookies.length > 0) {
        headers['Cookie'] = cookies.join('; ');
      }
      
      const response = await fetchWithRetry(`${baseUrl}/Instrumento/Consultar`, {
        method: 'POST',
        headers,
        body: formData.toString(),
      }, 3);

      htmlContent = await response.text();
      console.log('Resposta recebida do Inmetro, processando HTML...');
    } catch (err) {
      console.error('Erro ao consultar PSIE Inmetro:', err);
      const { data: staleRadar } = await supabase
        .from('radares')
        .select('*')
        .eq('numero_serie', numeroSerie)
        .order('last_checked_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (staleRadar) {
        // Salvar consulta mesmo com cache antigo
        await supabase.from('consultas').insert({
          user_id: userId,
          radar_id: staleRadar.id,
          numero_serie: numeroSerie,
          numero_auto: numeroAuto,
          data_infracao: dataInfracao,
          local_infracao: localInfracao,
          nome_condutor: nomeCondutor,
          cpf_cnpj_condutor: cpfCnpjCondutor,
          nome_proprietario: nomeProprietario,
          cpf_cnpj_proprietario: cpfCnpjProprietario,
          resultado: {
            status_aprovado: staleRadar.status_aprovado,
            numero_certificado: staleRadar.numero_certificado,
            data_certificado: staleRadar.data_certificado,
            validade_certificado: staleRadar.validade_certificado,
            mensagem: staleRadar.mensagem || 'Retornando último resultado disponível',
            fonte: 'Cache (PSIE Inmetro) — desatualizado',
            numero_serie: numeroSerie
          }
        });

        return new Response(
          JSON.stringify({
            status_aprovado: staleRadar.status_aprovado,
            numero_certificado: staleRadar.numero_certificado,
            data_certificado: staleRadar.data_certificado,
            validade_certificado: staleRadar.validade_certificado,
            mensagem: staleRadar.mensagem || 'Retornando último resultado disponível',
            fonte: 'Cache (PSIE Inmetro) — desatualizado',
            numero_serie: numeroSerie,
            from_cache: true,
            stale_cache: true
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Salvar consulta mesmo sem resultado do Inmetro
      await supabase.from('consultas').insert({
        user_id: userId,
        radar_id: null,
        numero_serie: numeroSerie,
        numero_auto: numeroAuto,
        data_infracao: dataInfracao,
        local_infracao: localInfracao,
        nome_condutor: nomeCondutor,
        cpf_cnpj_condutor: cpfCnpjCondutor,
        nome_proprietario: nomeProprietario,
        cpf_cnpj_proprietario: cpfCnpjProprietario,
        resultado: {
          status_aprovado: false,
          mensagem: 'Não foi possível completar a consulta agora. Tente novamente mais tarde.',
          numero_serie: numeroSerie
        }
      });

      return new Response(
        JSON.stringify({
          error: 'Erro ao consultar base do Inmetro',
          details: err instanceof Error ? err.message : 'Erro desconhecido',
          status_aprovado: false,
          mensagem: 'Não foi possível completar a consulta agora. Tente novamente mais tarde.'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse básico do HTML para extrair informações
    // Procura por padrões comuns nas respostas do PSIE
    const aprovadoMatch = htmlContent.match(/(?:Aprovado|APROVADO|Verificado|VERIFICADO)/i);
    const certificadoMatch = htmlContent.match(/(?:Certificado|CERTIFICADO)[\s\S]*?(\d{4,})/i);
    const dataMatch = htmlContent.match(/(?:Data|DATA)[\s\S]*?(\d{2}\/\d{2}\/\d{4})/i);
    const validadeMatch = htmlContent.match(/(?:Validade|VALIDADE|Vencimento)[\s\S]*?(\d{2}\/\d{2}\/\d{4})/i);
    
    // Verifica se não encontrou nenhum resultado
    const nenhumResultado = htmlContent.match(/(?:nenhum resultado|não encontrado|não localizado)/i);
    
    if (nenhumResultado) {
      console.log('Nenhum resultado encontrado no Inmetro');
      
      // Salvar consulta mesmo sem resultado
      await supabase.from('consultas').insert({
        user_id: userId,
        radar_id: null,
        numero_serie: numeroSerie,
        numero_auto: numeroAuto,
        data_infracao: dataInfracao,
        local_infracao: localInfracao,
        nome_condutor: nomeCondutor,
        cpf_cnpj_condutor: cpfCnpjCondutor,
        nome_proprietario: nomeProprietario,
        cpf_cnpj_proprietario: cpfCnpjProprietario,
        resultado: {
          status_aprovado: false,
          numero_certificado: '',
          data_certificado: '',
          validade_certificado: '',
          mensagem: 'Instrumento não localizado na base do Inmetro',
          fonte: 'PSIE Inmetro',
          numero_serie: numeroSerie
        }
      });
      
      return new Response(
        JSON.stringify({
          status_aprovado: false,
          numero_certificado: '',
          data_certificado: '',
          validade_certificado: '',
          mensagem: 'Instrumento não localizado na base do Inmetro',
          fonte: 'PSIE Inmetro'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Se encontrou informações de aprovação
    const statusAprovado = !!aprovadoMatch;
    
    const resultado = {
      status_aprovado: statusAprovado,
      numero_certificado: certificadoMatch ? certificadoMatch[1] : '',
      data_certificado: dataMatch ? dataMatch[1] : '',
      validade_certificado: validadeMatch ? validadeMatch[1] : '',
      mensagem: statusAprovado 
        ? 'Instrumento regularizado e aprovado pelo Inmetro' 
        : 'Instrumento não consta como aprovado no sistema',
      fonte: 'PSIE Inmetro',
      numero_serie: numeroSerie
    };

    console.log('Resultado da consulta:', resultado);

    // Salvar/atualizar cache do radar
    const { data: radarData, error: radarError } = await supabase
      .from('radares')
      .upsert({
        numero_serie: numeroSerie,
        marca: marca,
        modelo: modelo,
        uf: uf,
        municipio: municipio,
        status_aprovado: resultado.status_aprovado,
        numero_certificado: resultado.numero_certificado,
        data_certificado: resultado.data_certificado,
        validade_certificado: resultado.validade_certificado,
        mensagem: resultado.mensagem,
        last_checked_at: new Date().toISOString()
      }, { 
        onConflict: 'numero_serie',
        ignoreDuplicates: false 
      })
      .select()
      .single();

    if (radarError) {
      console.error('Erro ao salvar radar:', radarError);
    }

    // Salvar consulta no histórico do usuário
    if (radarData) {
      const { error: consultaError } = await supabase.from('consultas').insert({
        user_id: userId,
        radar_id: radarData.id,
        numero_serie: numeroSerie,
        numero_auto: numeroAuto,
        data_infracao: dataInfracao,
        local_infracao: localInfracao,
        nome_condutor: nomeCondutor,
        cpf_cnpj_condutor: cpfCnpjCondutor,
        nome_proprietario: nomeProprietario,
        cpf_cnpj_proprietario: cpfCnpjProprietario,
        resultado: resultado
      });

      if (consultaError) {
        console.error('Erro ao salvar consulta:', consultaError);
      }
    }

    return new Response(
      JSON.stringify({ ...resultado, from_cache: false }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Erro na função consultar-inmetro:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    
    return new Response(
      JSON.stringify({
        error: 'Erro ao consultar base do Inmetro',
        details: errorMessage,
        status_aprovado: false,
        mensagem: 'Não foi possível completar a consulta. Tente novamente mais tarde.'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
