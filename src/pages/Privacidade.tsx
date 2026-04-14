import { Link } from "react-router-dom";
import { ArrowLeft, CircleCheckBig, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Privacidade() {
  const sections = [
    {
      title: "1. Informacoes que Coletamos",
      content: (
        <>
          <p className="mb-4">Coletamos as seguintes informacoes:</p>
          <ul className="list-none space-y-2">
            <li className="flex items-start gap-3">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
              <span><strong className="text-foreground">Dados de cadastro:</strong> nome, email e senha (criptografada)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
              <span><strong className="text-foreground">Dados de consulta:</strong> numeros de serie de radares, informacoes de autos de infracao</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
              <span><strong className="text-foreground">Dados de navegacao:</strong> endereco IP, tipo de navegador, paginas visitadas</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "2. Como Usamos suas Informacoes",
      content: (
        <>
          <p className="mb-4">Utilizamos suas informacoes para:</p>
          <ul className="list-none space-y-2">
            <li className="flex items-start gap-3">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
              <span>Fornecer e melhorar nossos servicos de consulta e analise</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
              <span>Manter historico de consultas para sua conveniencia</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
              <span>Gerar sugestoes de recursos administrativos quando solicitado</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
              <span>Comunicar sobre mudancas no servico</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
              <span>Cumprir obrigacoes legais e regulatorias</span>
            </li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground border-l-2 border-primary/30 pl-4">
            <strong className="text-foreground">Base Legal (LGPD):</strong> O tratamento dos seus dados pessoais e realizado com base no
            interesse legitimo da plataforma em fornecer os servicos contratados, alem do cumprimento de
            obrigacoes legais e, quando aplicavel, com base no seu consentimento.
          </p>
        </>
      ),
    },
    {
      title: "3. Compartilhamento de Dados",
      content: (
        <>
          <p className="mb-4">
            Nao vendemos suas informacoes pessoais. Compartilhamos dados apenas quando:
          </p>
          <ul className="list-none space-y-2">
            <li className="flex items-start gap-3">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-accent shrink-0" />
              <span>Necessario para cumprir com a lei</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-accent shrink-0" />
              <span>Autorizado por voce</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-accent shrink-0" />
              <span>Com provedores de servicos que nos ajudam a operar a plataforma</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "4. Seguranca dos Dados",
      content: (
        <p>
          Implementamos medidas de seguranca tecnicas e organizacionais para proteger
          suas informacoes pessoais contra acesso nao autorizado, alteracao, divulgacao ou destruicao.
        </p>
      ),
    },
    {
      title: "5. Seus Direitos (LGPD)",
      content: (
        <>
          <p className="mb-4">
            Conforme a Lei Geral de Protecao de Dados (Lei n 13.709/2018), voce tem os seguintes direitos
            em relacao aos seus dados pessoais:
          </p>
          <ul className="list-none space-y-2">
            {[
              { bold: "Acesso:", text: "Confirmar a existencia de tratamento e acessar seus dados pessoais" },
              { bold: "Correcao:", text: "Solicitar a correcao de dados incompletos, inexatos ou desatualizados" },
              { bold: "Exclusao:", text: "Solicitar a eliminacao de dados desnecessarios, excessivos ou tratados em desconformidade" },
              { bold: "Portabilidade:", text: "Solicitar a portabilidade dos dados a outro fornecedor de servico" },
              { bold: "Revogacao:", text: "Revogar o consentimento dado para tratamento de dados, quando aplicavel" },
              { bold: "Oposicao:", text: "Opor-se ao tratamento realizado com base em interesse legitimo" },
              { bold: "Informacao:", text: "Obter informacoes sobre o compartilhamento de dados com terceiros" },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
                <span><strong className="text-foreground">{item.bold}</strong> {item.text}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            Para exercer qualquer um desses direitos, entre em contato atraves da nossa{" "}
            <Link to="/contato" className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors duration-200">
              pagina de contato
            </Link>.
          </p>
        </>
      ),
    },
    {
      title: "6. Cookies",
      content: (
        <p>
          Utilizamos cookies essenciais para o funcionamento do site e para manter
          sua sessao ativa. Voce pode desabilitar cookies nas configuracoes do navegador,
          mas isso pode afetar a funcionalidade do site.
        </p>
      ),
    },
    {
      title: "7. Retencao de Dados",
      content: (
        <p>
          Mantemos suas informacoes apenas pelo tempo necessario para fornecer nossos
          servicos ou conforme exigido por lei.
        </p>
      ),
    },
    {
      title: "8. Alteracoes nesta Politica",
      content: (
        <p>
          Podemos atualizar esta politica periodicamente. Notificaremos sobre mudancas
          significativas por email ou aviso na plataforma.
        </p>
      ),
    },
    {
      title: "9. Origem dos Dados de Radares",
      content: (
        <>
          <p className="mb-3">
            As informacoes sobre equipamentos medidores de velocidade (radares) utilizadas pela plataforma
            RadarCheck sao obtidas de <strong className="text-foreground">bases de dados publicas abertas</strong> disponibilizadas pelo
            Instituto Nacional de Metrologia, Qualidade e Tecnologia (Inmetro), conforme o Plano de Dados Abertos.
          </p>
          <p className="mb-3">
            A plataforma <strong className="text-foreground">nao controla, gerencia ou garante</strong> a atualizacao, precisao ou completude
            desses dados publicos, apenas os reutiliza para gerar analises e sugestoes aos usuarios.
          </p>
          <p>
            As sugestoes de recursos administrativos geradas com base nesses dados tem carater meramente informativo
            e <strong className="text-foreground">nao substituem analise tecnica ou juridica especializada</strong>.
          </p>
        </>
      ),
    },
    {
      title: "10. Contato",
      content: (
        <p>
          Para exercer seus direitos ou tirar duvidas sobre esta politica, entre em contato
          atraves da{" "}
          <Link to="/contato" className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors duration-200">
            pagina de contato
          </Link>.
        </p>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background font-body">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-strong shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500 group-hover:shadow-glow transition-all duration-300">
                <CircleCheckBig className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-display text-foreground">RadarCheck</h1>
                <p className="text-xs text-muted-foreground">Verificacao oficial Inmetro</p>
              </div>
            </Link>
            <Button variant="outline" size="sm" asChild className="border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300">
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative gradient-hero py-20 overflow-hidden">
        <div className="absolute inset-0 radar-rings opacity-40" />
        <div className="absolute inset-0 bg-grid-pattern" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-4 text-foreground">
              Politica de Privacidade
            </h1>
            <p className="text-muted-foreground">
              Ultima atualizacao: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 md:py-20 max-w-4xl">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="glass shadow-medium rounded-2xl p-8 md:p-12">
            <div className="space-y-10">
              {sections.map((section, i) => (
                <motion.section
                  key={i}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.5, delay: i * 0.04 }}
                >
                  <h2 className="text-xl md:text-2xl font-bold font-display mb-4 text-foreground">
                    {section.title}
                  </h2>
                  <div className="text-foreground/75 leading-relaxed">
                    {section.content}
                  </div>
                  {i < sections.length - 1 && (
                    <div className="mt-10 border-t border-border/30" />
                  )}
                </motion.section>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 py-10 glass">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-muted-foreground">
              &copy; 2024 RadarCheck. Todos os direitos reservados.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/sobre" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">Sobre</Link>
              <Link to="/contato" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">Contato</Link>
              <Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">FAQ</Link>
              <Link to="/termos-de-uso" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">Termos de Uso</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
