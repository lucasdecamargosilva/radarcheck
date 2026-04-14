import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();
    console.log("Analyzing multa document...");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          {
            role: "system",
            content: "Você é um especialista em análise de documentos de multas de trânsito brasileiras. Extraia TODOS os dados visíveis no documento com precisão máxima."
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analise esta imagem de uma multa de trânsito e extraia as seguintes informações (se não encontrar alguma informação, retorne null):

- numero_auto: Número do auto de infração
- numero_serie: Número de série do radar/equipamento
- data_infracao: Data da infração (formato DD/MM/YYYY)
- local_infracao: Local da infração
- nome_condutor: Nome do condutor
- cpf_cnpj_condutor: CPF ou CNPJ do condutor
- nome_proprietario: Nome do proprietário do veículo
- cpf_cnpj_proprietario: CPF ou CNPJ do proprietário

Retorne APENAS um objeto JSON válido com essas chaves, sem explicações adicionais.`
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Muitas requisições. Aguarde um momento e tente novamente." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes. Entre em contato com o suporte." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response:", data);

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("No content in AI response");
    }

    // Extract JSON from the response (handling markdown code blocks)
    let extractedData;
    try {
      // Try to find JSON in code blocks first
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      const jsonText = jsonMatch ? jsonMatch[1] : content;
      extractedData = JSON.parse(jsonText.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Não foi possível extrair os dados da multa. Tente com uma imagem mais clara.");
    }

    console.log("Extracted data:", extractedData);

    return new Response(
      JSON.stringify({ success: true, data: extractedData }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error analyzing multa:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Erro ao analisar documento" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
