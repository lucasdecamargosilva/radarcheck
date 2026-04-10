import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, FileCheck, Users, Target, Scale, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const fadeUp = {
  initial: { y: 30, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { once: true, margin: "-50px" },
};

export default function Sobre() {
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

      {/* Hero */}
      <section className="relative gradient-hero py-20 overflow-hidden">
        <div className="absolute inset-0 radar-rings opacity-50" />
        <div className="absolute inset-0 bg-grid-pattern" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="trust-badge mb-6">
              LegalTech + GovData SaaS
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-5 text-foreground">
              Sobre o{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                RadarCheck
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Verifique, recorra e economize em minutos.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 md:py-20 max-w-4xl space-y-12">
        {/* Section 1 - Intro */}
        <motion.div {...fadeUp} transition={{ duration: 0.6 }}>
          <div className="glass shadow-medium rounded-2xl p-8 md:p-10">
            <p className="text-lg md:text-xl text-foreground/90 leading-relaxed">
              Tornamos o processo de contestar multas mais simples, transparente e juridicamente
              embasado — com validacao automatica dos radares do Inmetro e geracao instantanea
              de recursos administrativos.
            </p>
          </div>
        </motion.div>

        {/* Section 2 - Mission */}
        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }}>
          <div className="glass shadow-soft rounded-2xl p-8 md:p-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-display text-foreground">Nossa Missao</h2>
            </div>
            <p className="text-foreground/80 leading-relaxed">
              Simplificar e democratizar o acesso a justica no transito, tornando o processo de
              contestacao de multas rapido, transparente e juridicamente solido. Empoderamos
              cidadaos com dados oficiais e ferramentas automatizadas para exercer seus direitos.
            </p>
          </div>
        </motion.div>

        {/* Section 3 - Target audience */}
        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }}>
          <div className="glass shadow-soft rounded-2xl p-8 md:p-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-display text-foreground">Para Quem Criamos</h2>
            </div>
            <p className="text-foreground/80 mb-5">
              Nossa plataforma foi desenvolvida especialmente para:
            </p>
            <ul className="space-y-3">
              {[
                { bold: "Motoristas autonomos", text: "que precisam contestar multas indevidas" },
                { bold: "Transportadoras", text: "que gerenciam grandes frotas" },
                { bold: "Despachantes", text: "que auxiliam clientes em processos administrativos" },
                { bold: "Advogados", text: "que atuam com direito de transito" },
                { bold: "Cidadaos", text: "que recorrem frequentemente de autuacoes" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-foreground/80">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
                  <span><strong className="text-foreground">{item.bold}</strong> {item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Section 4 - Technical differentials */}
        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.2 }}>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-foreground mb-6 text-center">
            Nosso Diferencial Tecnico
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Shield,
                title: "Consulta Real-Time",
                text: "Acesso direto ao PSIE/Inmetro para verificar a regularidade dos radares em tempo real com dados sempre atualizados.",
                color: "primary",
              },
              {
                icon: FileCheck,
                title: "Cache Inteligente",
                text: "Sistema de cache otimizado que garante rapidez nas consultas sem perder a precisao dos dados oficiais.",
                color: "accent",
              },
              {
                icon: Users,
                title: "Gerador de PDF Juridico",
                text: "Criacao automatica de recursos administrativos formatados e fundamentados legalmente, prontos para envio.",
                color: "primary",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="glass shadow-soft rounded-2xl p-7 h-full hover:shadow-medium hover:border-primary/20 transition-all duration-300 group">
                  <div className={`w-12 h-12 rounded-xl bg-${card.color}/10 border border-${card.color}/20 flex items-center justify-center mb-5 group-hover:shadow-glow transition-all duration-300`}>
                    <card.icon className={`w-6 h-6 text-${card.color}`} />
                  </div>
                  <h3 className="text-lg font-bold font-display text-foreground mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{card.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Section 5 - Legal basis */}
        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.25 }}>
          <div className="glass shadow-soft rounded-2xl p-8 md:p-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Scale className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-display text-foreground">Base Legal</h2>
            </div>
            <p className="text-foreground/80 mb-5">
              Nossa plataforma se baseia nas seguintes normas e regulamentacoes:
            </p>
            <ul className="space-y-3">
              {[
                { bold: "Codigo de Transito Brasileiro (CTB)", text: "- Lei n 9.503/1997" },
                { bold: "Resolucao CONTRAN n 396/2011", text: "- Estabelece requisitos para equipamentos medidores de velocidade" },
                { bold: "Portaria Inmetro n 544/2014", text: "- Regulamento Tecnico Metrologico para medidores de velocidade" },
                { bold: "Lei Geral de Protecao de Dados (LGPD)", text: "- Lei n 13.709/2018" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-foreground/80">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-accent shrink-0" />
                  <span><strong className="text-foreground">{item.bold}</strong> {item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Section 6 - Contact */}
        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.3 }}>
          <div className="glass shadow-soft rounded-2xl p-8 md:p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
              <Mail className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-display text-foreground mb-3">Contato</h2>
            <p className="text-foreground/80 mb-6">
              Para mais informacoes, duvidas ou sugestoes, acesse nossa pagina de contato.
            </p>
            <Button asChild className="gradient-primary text-primary-foreground font-semibold shadow-glow hover:opacity-90 transition-all duration-300">
              <Link to="/contato">
                <Mail className="w-4 h-4 mr-2" />
                Fale Conosco
              </Link>
            </Button>
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
              <Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">FAQ</Link>
              <Link to="/contato" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">Contato</Link>
              <Link to="/termos-de-uso" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">Termos de Uso</Link>
              <Link to="/privacidade" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">Privacidade</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
