// Edge Function para verificar status da API do Inmetro
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.80.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Iniciando health check do Inmetro...');
    
    const startTime = Date.now();
    let status: 'online' | 'offline' | 'degraded' = 'offline';
    let errorMessage: string | null = null;
    let responseTime: number | null = null;

    try {
      // Tentar acessar a página inicial do PSIE com headers realistas
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout (aumentado)
      
      const response = await fetch('https://servicos.rbmlq.gov.br/Instrumento', {
        method: 'GET',
        headers: {
          // Simular browser real (Chrome no Windows)
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"Windows"',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Upgrade-Insecure-Requests': '1',
          'Referer': 'https://www.google.com/',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeout);
      responseTime = Date.now() - startTime;

      console.log(`Resposta recebida: HTTP ${response.status} em ${responseTime}ms`);

      if (response.ok) {
        const html = await response.text();
        
        // Verificar se a página contém elementos esperados
        const hasExpectedContent = html.includes('Consulta de Instrumentos') || 
                                   html.includes('PSIE') ||
                                   html.includes('Inmetro');
        
        if (hasExpectedContent) {
          status = responseTime > 3000 ? 'degraded' : 'online';
          console.log(`Status: ${status} (tempo de resposta: ${responseTime}ms)`);
        } else {
          status = 'degraded';
          errorMessage = 'Página carregou mas conteúdo inesperado';
          console.warn('Página carregou mas sem conteúdo esperado');
        }
      } else {
        status = 'offline';
        errorMessage = `HTTP ${response.status} - ${response.statusText}`;
        console.error(`Erro HTTP: ${errorMessage}`);
      }
    } catch (err) {
      status = 'offline';
      errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      responseTime = Date.now() - startTime;
      console.error('Erro ao fazer health check:', errorMessage);
    }

    // Salvar resultado no banco
    const { error: insertError } = await supabase
      .from('api_health_checks')
      .insert({
        status,
        response_time_ms: responseTime,
        error_message: errorMessage,
        metadata: {
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          checked_from: 'edge-function',
          timeout_used_ms: 30000
        }
      });

    if (insertError) {
      console.error('Erro ao salvar health check:', insertError);
    } else {
      console.log('Health check salvo com sucesso');
    }

    return new Response(
      JSON.stringify({
        status,
        response_time_ms: responseTime,
        error_message: errorMessage,
        checked_at: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Erro na função health-check-inmetro:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Erro ao executar health check',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
