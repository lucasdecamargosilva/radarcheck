# 🚀 Configuração do Mercado Pago - RadarCheck

## 📋 Resumo

Este documento explica como configurar a integração do Mercado Pago para o plano "Recurso Automático" de R$ 14,90.

## 🔧 Configuração Rápida

### 1. Criar Preferência de Pagamento no Mercado Pago

Acesse o [Mercado Pago Developers](https://www.mercadopago.com.br/developers/) e crie uma preferência de pagamento com:

- **Título**: "Recurso Administrativo - RadarCheck"
- **Preço**: R$ 14,90
- **Tipo**: Pagamento único
- **Meios de pagamento**: PIX, Cartão de Crédito, Boleto

### 2. Obter o Link de Pagamento

Após criar a preferência, você receberá um link no formato:
```
https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=SEU_PREFERENCE_ID_AQUI
```

### 3. Configurar no Código

Abra o arquivo `src/pages/Planos.tsx` e localize a linha:

```typescript
const MERCADO_PAGO_LINK = "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=SEU_PREFERENCE_ID_AQUI";
```

Substitua `SEU_PREFERENCE_ID_AQUI` pelo seu ID de preferência real.

## 🎯 Fluxo de Pagamento

1. **Usuário clica** em "Gerar recurso - R$ 14,90"
2. **Abre** o Checkout Pro do Mercado Pago em nova aba
3. **Usuário escolhe** forma de pagamento (PIX, cartão, boleto)
4. **Mercado Pago processa** o pagamento
5. **Após confirmação**, redireciona de volta para RadarCheck
6. **Sistema libera** o PDF do recurso administrativo

## 🔄 Webhook e Notificações

Para processar automaticamente após o pagamento, você precisará:

1. **Configurar webhook** no Mercado Pago apontando para sua Edge Function
2. **Criar Edge Function** que recebe notificações de pagamento
3. **Verificar status** do pagamento
4. **Liberar recurso** automaticamente quando `payment.status === 'approved'`

### Exemplo de Edge Function (próxima etapa):

```typescript
// supabase/functions/mercado-pago-webhook/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  // Recebe notificação do Mercado Pago
  const data = await req.json()
  
  if (data.type === 'payment' && data.action === 'payment.created') {
    // Verificar status do pagamento
    // Se aprovado, liberar recurso para o usuário
  }
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" }
  })
})
```

## 📊 Métricas Importantes

- **Taxa de conversão**: Acompanhe quantos usuários clicam vs quantos pagam
- **Formas de pagamento mais usadas**: PIX, Cartão ou Boleto
- **Taxa de abandono**: Usuários que abrem o checkout mas não finalizam

## 🔐 Segurança

- Nunca exponha suas credenciais no frontend
- Use webhooks para confirmar pagamentos
- Valide sempre no backend antes de liberar recursos
- Implemente rate limiting para evitar fraudes

## 📈 Próximos Passos

1. ✅ Página de Planos criada
2. ⏳ Configurar preferência no Mercado Pago
3. ⏳ Criar webhook handler
4. ⏳ Integrar geração automática do PDF após pagamento
5. ⏳ Configurar emails de confirmação

## 🆘 Suporte

Para dúvidas sobre integração do Mercado Pago:
- [Documentação oficial](https://www.mercadopago.com.br/developers/pt/docs)
- [Suporte Mercado Pago](https://www.mercadopago.com.br/developers/pt/support)
