import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Shield, HelpCircle, ArrowLeft, MessageCircle, Search } from "lucide-react";

const FAQ = () => {
  const faqCategories = [
    {
      category: "Sobre o RadarCheck",
      icon: "🛡️",
      questions: [
        {
          question: "O que é o RadarCheck?",
          answer: "O RadarCheck é uma plataforma 100% digital que consulta automaticamente a base oficial do Inmetro (PSIE) para verificar se o radar que gerou sua multa está com a aprovação válida. Se o radar estiver irregular, geramos automaticamente um recurso administrativo completo para você contestar a multa."
        },
        {
          question: "Como o RadarCheck funciona?",
          answer: "O processo é simples: (1) Você insere os dados da multa, (2) Consultamos automaticamente o banco de dados do Inmetro em tempo real, (3) Mostramos se o radar está aprovado ou irregular, (4) Se irregular, geramos automaticamente um recurso administrativo pronto para você enviar ao órgão competente."
        },
        {
          question: "Os dados consultados são oficiais?",
          answer: "Sim! Todos os dados são consultados diretamente no PSIE (Portal de Sistemas do Inmetro), que é a base oficial e pública mantida pelo Instituto Nacional de Metrologia, Qualidade e Tecnologia. Os dados são 100% oficiais e podem ser usados como prova em recursos administrativos e processos judiciais."
        },
        {
          question: "Preciso pagar para usar o RadarCheck?",
          answer: "Você só paga se o radar da sua multa estiver irregular. Oferecemos consultas gratuitas limitadas para você verificar a situação do radar. Se o radar estiver com problemas de aprovação e você quiser o recurso administrativo completo, aí sim há um custo. Consulte nossos planos para mais detalhes."
        }
      ]
    },
    {
      category: "Sobre Multas e Radares",
      icon: "📡",
      questions: [
        {
          question: "Quantas multas podem ser contestadas por radares irregulares?",
          answer: "Estudos indicam que aproximadamente 1 em cada 5 radares no Brasil apresentam problemas de aprovação junto ao Inmetro. Isso significa que mais de 1 milhão de multas por ano podem ter problemas de validade. Com 80% das contestações bem fundamentadas sendo aceitas, há uma grande chance de reverter multas aplicadas por radares irregulares."
        },
        {
          question: "O que é o número de série do radar?",
          answer: "O número de série é o código único que identifica cada equipamento de fiscalização eletrônica (radar). Ele está sempre presente no auto de infração (multa) e é essencial para consultar a situação do equipamento junto ao Inmetro. Geralmente aparece como 'Nº Série do Equipamento' ou 'Equipamento' no documento da multa."
        },
        {
          question: "Por que radares precisam de aprovação do Inmetro?",
          answer: "O Inmetro é o órgão responsável por verificar se os equipamentos de medição de velocidade (radares) estão calibrados e funcionando corretamente. Todo radar deve passar por verificação periódica e ter uma aprovação válida. Radares sem aprovação válida não podem ser usados para fiscalização, tornando as multas aplicadas por eles passíveis de contestação."
        },
        {
          question: "Qual o prazo para contestar uma multa?",
          answer: "O prazo para apresentar defesa prévia (primeira contestação) é de 15 dias corridos a partir da data de notificação da autuação. Caso a defesa prévia seja indeferida, você tem mais 30 dias para apresentar recurso em segunda instância junto à JARI (Junta Administrativa de Recursos de Infração). É importante não perder esses prazos."
        }
      ]
    },
    {
      category: "Sobre Recursos e Contestações",
      icon: "📋",
      questions: [
        {
          question: "O recurso gerado pelo RadarCheck é juridicamente válido?",
          answer: "Sim! O recurso é elaborado com base na legislação de trânsito brasileira (CTB - Código de Trânsito Brasileiro) e nas normas do Inmetro. O documento inclui todos os fundamentos legais necessários, dados técnicos do equipamento e argumentação jurídica apropriada para contestação administrativa."
        },
        {
          question: "Quais são as chances de sucesso do recurso?",
          answer: "Quando um radar está comprovadamente irregular (sem aprovação válida do Inmetro), as chances de sucesso são muito altas - estudos mostram que aproximadamente 80% dos recursos bem fundamentados são aceitos. Isso porque a irregularidade do equipamento é um vício formal que compromete a validade da autuação."
        },
        {
          question: "Como devo enviar o recurso gerado?",
          answer: "O recurso deve ser enviado ao órgão autuador dentro do prazo de 15 dias. Você pode enviar por protocolo presencial, correios (com AR - Aviso de Recebimento) ou através dos portais digitais de cada órgão de trânsito. Sempre guarde comprovante de envio. O documento gerado pelo RadarCheck está pronto para ser enviado, sem necessidade de alterações."
        },
        {
          question: "Preciso contratar um advogado?",
          answer: "Para a defesa administrativa (recurso junto ao órgão de trânsito), não é necessário contratar advogado. O próprio condutor pode apresentar o recurso. O documento gerado pelo RadarCheck é suficiente para a contestação administrativa. Apenas em casos de recurso judicial (processo na justiça) é necessário ter um advogado."
        }
      ]
    },
    {
      category: "Sobre Uso da Plataforma",
      icon: "💻",
      questions: [
        {
          question: "Preciso fazer cadastro para consultar?",
          answer: "Sim, é necessário criar uma conta gratuita para utilizar a plataforma. Isso nos permite gerenciar seu histórico de consultas, fornecer suporte personalizado e garantir que você tenha acesso aos recursos que gerar. O cadastro é rápido e simples, exigindo apenas e-mail e senha."
        },
        {
          question: "Quantas consultas posso fazer?",
          answer: "Oferecemos consultas gratuitas limitadas para todos os usuários. O número exato de consultas gratuitas depende do seu plano. Usuários do plano gratuito têm um número limitado de consultas por mês. Para consultas ilimitadas e geração de múltiplos recursos, oferecemos planos pagos. Consulte a página de Planos para mais detalhes."
        },
        {
          question: "Posso consultar multas de outras pessoas?",
          answer: "Sim, você pode consultar qualquer multa desde que tenha os dados necessários (principalmente o número de série do radar). Isso é útil para despachantes, advogados, empresas de transporte e familiares que ajudam outros a contestar multas. Cada consulta será registrada em sua conta."
        },
        {
          question: "Como faço upload da foto da multa?",
          answer: "Na página inicial ou no dashboard, você encontrará a opção 'Upload de Multa'. Basta tirar uma foto clara do auto de infração ou fazer upload do PDF. Nossa inteligência artificial irá extrair automaticamente os dados relevantes (número de série, data, local, etc.) e preencher o formulário para você, agilizando o processo."
        }
      ]
    },
    {
      category: "Suporte e Segurança",
      icon: "🔒",
      questions: [
        {
          question: "Meus dados estão seguros?",
          answer: "Sim! Utilizamos criptografia de ponta a ponta e seguimos as melhores práticas de segurança da informação. Todos os dados são armazenados em servidores seguros e protegidos. Respeitamos a LGPD (Lei Geral de Proteção de Dados) e nunca compartilhamos seus dados pessoais com terceiros sem seu consentimento."
        },
        {
          question: "Como entro em contato com o suporte?",
          answer: "Você pode entrar em contato através da página de Contato no site, enviando um e-mail ou através do chat de suporte disponível para usuários logados. Nossa equipe responde todas as dúvidas em até 24 horas úteis. Para questões urgentes sobre prazos de recursos, damos prioridade no atendimento."
        },
        {
          question: "O RadarCheck garante que minha multa será cancelada?",
          answer: "Não podemos garantir 100% de sucesso, pois a decisão final é do órgão de trânsito competente. No entanto, quando um radar está comprovadamente irregular junto ao Inmetro, a legislação é clara sobre a invalidade da autuação. Nosso recurso apresenta todos os fundamentos legais e técnicos necessários, maximizando suas chances de sucesso."
        },
        {
          question: "Posso cancelar minha assinatura a qualquer momento?",
          answer: "Sim! Nossos planos pagos podem ser cancelados a qualquer momento, sem multa ou burocracia. Você continuará tendo acesso aos recursos do plano até o final do período já pago. O cancelamento pode ser feito diretamente nas configurações da sua conta, na seção de Planos."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background font-body">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-strong shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 group-hover:shadow-glow transition-all duration-300">
                <Shield className="h-5 w-5 text-primary" />
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

      {/* Hero Section */}
      <section className="relative gradient-hero py-20 overflow-hidden">
        <div className="absolute inset-0 radar-rings opacity-60" />
        <div className="absolute inset-0 bg-grid-pattern" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Badge className="mb-6 trust-badge">
                <HelpCircle className="w-4 h-4" />
                Perguntas Frequentes
              </Badge>
            </motion.div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-5 text-foreground">
              Central de{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Ajuda
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Tudo o que voce precisa saber sobre multas, radares e contestacoes
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {faqCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.08 }}
              className="mb-14"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{category.icon}</span>
                <h2 className="text-2xl md:text-3xl font-bold font-display text-foreground">
                  {category.category}
                </h2>
              </div>

              <Accordion type="single" collapsible className="space-y-3">
                {category.questions.map((item, questionIndex) => (
                  <AccordionItem
                    key={questionIndex}
                    value={`${categoryIndex}-${questionIndex}`}
                    className="glass shadow-soft rounded-xl px-6 border-white/[0.06] data-[state=open]:shadow-medium data-[state=open]:border-primary/20 transition-all duration-300"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-5 group">
                      <span className="font-semibold text-foreground/90 pr-4 group-hover:text-primary transition-colors duration-200">
                        {item.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 radar-rings opacity-40" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="glass-strong shadow-medium rounded-2xl p-10 md:p-14">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-4">
                Nao encontrou sua resposta?
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Nossa equipe de suporte esta pronta para ajudar voce
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="gradient-primary text-primary-foreground font-semibold shadow-glow hover:opacity-90 transition-all duration-300">
                  <Link to="/contato">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Fale Conosco
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-border/50 hover:border-primary/40 hover:bg-primary/5">
                  <Link to="/">
                    <Search className="w-5 h-5 mr-2" />
                    Verificar Radar
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-10 glass">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                &copy; 2024 RadarCheck. Todos os direitos reservados.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/sobre" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                Sobre
              </Link>
              <Link to="/contato" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                Contato
              </Link>
              <Link to="/termos-de-uso" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                Termos de Uso
              </Link>
              <Link to="/privacidade" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                Privacidade
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FAQ;
