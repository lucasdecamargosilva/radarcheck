import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
} from 'https://esm.sh/@react-email/components@0.0.22'
import * as React from 'https://esm.sh/react@18.3.1'

interface PasswordRecoveryEmailProps {
  supabase_url: string
  email_action_type: string
  redirect_to: string
  token_hash: string
}

export const PasswordRecoveryEmail = ({
  supabase_url,
  email_action_type,
  redirect_to,
  token_hash,
}: PasswordRecoveryEmailProps) => (
  <Html>
    <Head />
    <Preview>Recupere sua senha do Radar Check</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>🔐 Radar Check</Heading>
        </Section>
        
        <Section style={content}>
          <Heading style={h2}>Recuperação de Senha</Heading>
          <Text style={text}>
            Olá! Você solicitou a recuperação de senha para sua conta no <strong>Radar Check</strong>.
          </Text>
          
          <Text style={text}>
            Clique no botão abaixo para criar uma nova senha:
          </Text>
          
          <Link
            href={`${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`}
            target="_blank"
            style={button}
          >
            Redefinir Minha Senha
          </Link>
          
          <Text style={disclaimer}>
            <strong>⚠️ Importante:</strong> Este link expira em 1 hora por questões de segurança.
          </Text>
          
          <Text style={disclaimer}>
            Se você não solicitou esta recuperação, pode ignorar este email com segurança. 
            Sua senha permanecerá inalterada.
          </Text>
        </Section>
        
        <Section style={footer}>
          <Text style={footerText}>
            Atenciosamente,<br />
            <strong>Equipe Radar Check</strong>
          </Text>
          <Text style={footerDisclaimer}>
            Este é um email automático do sistema. Por favor, não responda.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default PasswordRecoveryEmail

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
}

const header = {
  padding: '32px 48px',
  backgroundColor: '#2563eb',
  textAlign: 'center' as const,
}

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0',
  padding: '0',
}

const content = {
  padding: '0 48px',
}

const h2 = {
  color: '#1e293b',
  fontSize: '24px',
  fontWeight: 'bold',
  marginTop: '32px',
  marginBottom: '16px',
}

const text = {
  color: '#334155',
  fontSize: '16px',
  lineHeight: '26px',
  marginBottom: '16px',
}

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '8px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  padding: '14px 32px',
  margin: '24px 0',
}

const disclaimer = {
  color: '#64748b',
  fontSize: '14px',
  lineHeight: '22px',
  marginTop: '24px',
  marginBottom: '12px',
}

const footer = {
  padding: '0 48px',
  marginTop: '32px',
  borderTop: '1px solid #e2e8f0',
  paddingTop: '24px',
}

const footerText = {
  color: '#475569',
  fontSize: '14px',
  lineHeight: '22px',
  marginBottom: '8px',
}

const footerDisclaimer = {
  color: '#94a3b8',
  fontSize: '12px',
  lineHeight: '18px',
  marginTop: '16px',
}
