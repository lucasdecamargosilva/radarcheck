import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Shield,
  Zap,
  FileCheck,
  Clock,
  DollarSign,
  Lock,
  Users,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Award,
  ArrowLeft
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Planos = () => {
  const navigate = useNavigate();

  // Link do Mercado Pago - facilmente editável
  const MERCADO_PAGO_LINK = "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=SEU_PREFERENCE_ID_AQUI";

  const handleFreePlan = () => {
    navigate("/");
  };

  const handleRecursoAutomatico = () => {
    // Abre o Checkout Pro do Mercado Pago em nova aba
    window.open(MERCADO_PAGO_LINK, "_blank");
  };

  const handleProPlan = () => {
    navigate("/contato");
  };

  const fadeUp = {
    hidden: { y: 24, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
  };

  return (
    <div className="min-h-screen bg-background dark">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-strong border-b border-white/[0.06]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-glow transition-shadow group-hover:shadow-[0_0_40px_rgba(0,212,255,0.25)]">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-foreground tracking-tight">RadarCheck</h1>
                <p className="font-body text-xs text-muted-foreground">Verificação oficial Inmetro</p>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground hover:bg-white/[0.06]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden gradient-hero radar-rings">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/[0.06] blur-[120px]" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-body text-sm text-primary font-medium">Planos e Preços</span>
            </motion.div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
              Escolha o melhor jeito de usar o{" "}
              <span className="text-transparent bg-clip-text gradient-accent bg-gradient-to-r from-primary to-accent">
                RadarCheck
              </span>
            </h1>
            <p className="font-body text-xl text-muted-foreground max-w-xl mx-auto">
              Consulte grátis. Gere o recurso quando realmente precisar.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="relative py-24 bg-grid-pattern">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto items-stretch">

            {/* Plano Free */}
            <motion.div
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <Card className="h-full glass shadow-soft hover:shadow-medium transition-all duration-300 border-white/[0.06] group hover:border-white/[0.12]">
                <CardHeader className="pb-4">
                  <CardTitle className="font-display text-2xl text-foreground">RadarCheck Free</CardTitle>
                  <CardDescription className="font-body">Consulta básica gratuita</CardDescription>
                  <div className="pt-6">
                    <div className="font-display text-5xl font-bold text-foreground tracking-tight">R$ 0</div>
                    <p className="font-body text-sm text-muted-foreground mt-1">Para sempre</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {[
                      "1 consulta por semana",
                      "Upload de foto/PDF/PNG",
                      "OCR automático",
                      "Consulta Inmetro em tempo real",
                      "Resultado na hora",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                        <span className="font-body text-sm text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-4">
                  <Button
                    className="w-full font-body border-white/[0.08] hover:bg-white/[0.06] text-foreground"
                    variant="outline"
                    onClick={handleFreePlan}
                  >
                    Usar grátis
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Plano Recurso Automático - DESTAQUE */}
            <motion.div
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <Card className="h-full glass-strong shadow-glow border-2 border-primary/40 relative group hover:border-primary/60 transition-all duration-300">
                {/* Badge de destaque */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="gradient-accent text-white px-5 py-1.5 text-sm font-semibold shadow-medium border-0">
                    <Sparkles className="w-4 h-4 mr-1.5" />
                    Mais usado
                  </Badge>
                </div>

                <CardHeader className="pt-10 pb-4">
                  <CardTitle className="font-display text-2xl text-primary">Gerar Recurso Automático</CardTitle>
                  <CardDescription className="font-body">
                    A forma mais rápida, simples e econômica de contestar sua multa
                  </CardDescription>
                  <div className="pt-6">
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-5xl font-bold text-primary tracking-tight">R$ 14,90</span>
                    </div>
                    <p className="font-body text-sm text-muted-foreground mt-1">Pagamento único</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="font-body text-sm font-medium text-foreground">Tudo do plano Free</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="font-body text-sm text-foreground"><strong>PDF jurídico completo</strong></span>
                    </li>
                    <li className="flex items-start gap-3">
                      <FileCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="font-body text-sm text-muted-foreground">Dados automaticamente preenchidos</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="font-body text-sm text-muted-foreground">Orientações claras de envio</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="font-body text-sm text-muted-foreground">Economia real vs. serviços jurídicos</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="font-body text-sm text-muted-foreground">Suporte básico</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="pt-4">
                  <Button
                    className="w-full font-body text-base font-semibold h-12 gradient-primary text-white border-0 shadow-glow hover:shadow-[0_0_40px_rgba(0,212,255,0.25)] transition-all duration-300"
                    size="lg"
                    onClick={handleRecursoAutomatico}
                  >
                    Gerar recurso - R$ 14,90
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Plano Pro - Beta */}
            <motion.div
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <Card className="h-full glass shadow-soft hover:shadow-medium transition-all duration-300 border-white/[0.06] relative group hover:border-white/[0.12]">
                <div className="absolute top-4 right-4">
                  <Badge className="bg-secondary text-secondary-foreground border border-white/[0.08]">Em breve</Badge>
                </div>

                <CardHeader className="pb-4">
                  <CardTitle className="font-display text-2xl text-foreground">RadarCheck Pro</CardTitle>
                  <CardDescription className="font-body">Para uso frequente</CardDescription>
                  <div className="pt-6">
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-5xl font-bold text-foreground tracking-tight">R$ 19,90</span>
                      <span className="font-body text-muted-foreground">/mês</span>
                    </div>
                    <p className="font-body text-sm text-muted-foreground mt-1">Disponível em breve</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {[
                      { icon: CheckCircle2, text: "Consultas ilimitadas" },
                      { icon: CheckCircle2, text: "Recursos ilimitados" },
                      { icon: CheckCircle2, text: "Dashboard completo" },
                      { icon: CheckCircle2, text: "Histórico de consultas" },
                      { icon: Award, text: "Suporte prioritário" },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <item.icon className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                        <span className="font-body text-sm text-muted-foreground">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-4">
                  <Button
                    className="w-full font-body bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-white/[0.06]"
                    variant="secondary"
                    onClick={handleProPlan}
                  >
                    Entrar na lista de espera
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
              Por que escolher o RadarCheck?
            </h2>
            <p className="font-body text-lg text-muted-foreground max-w-xl mx-auto">
              Tecnologia a serviço dos seus direitos
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {[
              {
                icon: Clock,
                title: "Economia de tempo",
                description: "Em minutos você tem o recurso pronto, sem burocracia"
              },
              {
                icon: DollarSign,
                title: "Economia de dinheiro",
                description: "Multa média R$ 130-293. Pagar R$ 14,90 é um no-brainer"
              },
              {
                icon: Shield,
                title: "Base oficial Inmetro",
                description: "Dados verificados direto da fonte governamental"
              },
              {
                icon: Lock,
                title: "Privacidade garantida",
                description: "Seus dados são protegidos e não compartilhados"
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <Card className="glass p-6 text-center h-full shadow-soft hover:shadow-medium transition-all duration-300 border-white/[0.06] group hover:border-primary/20">
                  <div className="flex justify-center mb-5">
                    <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 group-hover:bg-primary/15 transition-colors">
                      <benefit.icon className="h-7 w-7 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-50 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
              Perguntas Frequentes
            </h2>
            <p className="font-body text-lg text-muted-foreground">
              Tire suas dúvidas sobre os planos
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-3xl mx-auto"
          >
            <Card className="glass-strong shadow-medium border-white/[0.06] overflow-hidden">
              <CardContent className="p-0">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-b border-white/[0.06] px-6">
                    <AccordionTrigger className="font-body text-left text-foreground hover:text-primary transition-colors py-5">
                      O RadarCheck realmente consulta o Inmetro?
                    </AccordionTrigger>
                    <AccordionContent className="font-body text-muted-foreground pb-5 leading-relaxed">
                      Sim! O RadarCheck faz consultas em tempo real à base oficial do Inmetro/PSIE,
                      verificando a situação de aprovação e validade dos certificados dos radares de velocidade.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2" className="border-b border-white/[0.06] px-6">
                    <AccordionTrigger className="font-body text-left text-foreground hover:text-primary transition-colors py-5">
                      A consulta é realmente grátis?
                    </AccordionTrigger>
                    <AccordionContent className="font-body text-muted-foreground pb-5 leading-relaxed">
                      Sim! No plano Free você pode fazer 1 consulta por semana totalmente grátis.
                      Você só paga se quiser gerar o recurso administrativo automático.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3" className="border-b border-white/[0.06] px-6">
                    <AccordionTrigger className="font-body text-left text-foreground hover:text-primary transition-colors py-5">
                      Quando eu pago R$ 14,90?
                    </AccordionTrigger>
                    <AccordionContent className="font-body text-muted-foreground pb-5 leading-relaxed">
                      Você paga R$ 14,90 apenas quando quiser gerar o recurso administrativo completo em PDF.
                      A consulta é gratuita. O pagamento é feito uma única vez, via PIX, cartão ou boleto através do Mercado Pago.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4" className="border-b border-white/[0.06] px-6">
                    <AccordionTrigger className="font-body text-left text-foreground hover:text-primary transition-colors py-5">
                      Recebo o PDF na hora?
                    </AccordionTrigger>
                    <AccordionContent className="font-body text-muted-foreground pb-5 leading-relaxed">
                      Sim! Após a confirmação do pagamento, o PDF do recurso administrativo é gerado
                      automaticamente e fica disponível para download imediatamente.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5" className="border-b border-white/[0.06] px-6">
                    <AccordionTrigger className="font-body text-left text-foreground hover:text-primary transition-colors py-5">
                      O RadarCheck garante o cancelamento da multa?
                    </AccordionTrigger>
                    <AccordionContent className="font-body text-muted-foreground pb-5 leading-relaxed">
                      O RadarCheck não pode garantir o cancelamento, pois a decisão final é da autoridade de trânsito.
                      No entanto, fornecemos um recurso tecnicamente fundamentado baseado em dados oficiais do Inmetro,
                      que fortalece consideravelmente sua defesa. Estatísticas mostram que até 80% das multas
                      contestadas com fundamentação técnica adequada são revertidas.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-6" className="px-6 border-b-0">
                    <AccordionTrigger className="font-body text-left text-foreground hover:text-primary transition-colors py-5">
                      Como funciona o pagamento via Mercado Pago?
                    </AccordionTrigger>
                    <AccordionContent className="font-body text-muted-foreground pb-5 leading-relaxed">
                      O pagamento é 100% seguro via Mercado Pago. Você pode pagar com PIX (instantâneo),
                      cartão de crédito ou boleto bancário. Assim que o pagamento é confirmado,
                      o recurso é liberado automaticamente.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative py-24 overflow-hidden gradient-hero radar-rings">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/[0.08] blur-[100px]" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6 tracking-tight">
              Envie sua multa e verifique grátis agora mesmo
            </h2>
            <p className="font-body text-xl text-muted-foreground mb-10">
              Descubra em segundos se você pode recorrer da sua multa
            </p>
            <Button
              size="lg"
              className="font-body text-base px-10 h-14 gradient-primary text-white border-0 shadow-glow hover:shadow-[0_0_40px_rgba(0,212,255,0.25)] transition-all duration-300"
              onClick={() => navigate("/")}
            >
              <Zap className="mr-2 h-5 w-5" />
              Enviar minha multa
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] glass-strong py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="font-body text-sm text-muted-foreground">
                © 2025 RadarCheck - Todos os direitos reservados
              </span>
            </div>
            <div className="flex gap-8 font-body text-sm text-muted-foreground">
              <Link to="/termos-de-uso" className="hover:text-primary transition-colors duration-200">
                Termos de Uso
              </Link>
              <Link to="/privacidade" className="hover:text-primary transition-colors duration-200">
                Privacidade
              </Link>
              <Link to="/contato" className="hover:text-primary transition-colors duration-200">
                Contato
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Planos;
