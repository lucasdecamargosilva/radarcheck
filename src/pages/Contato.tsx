import { Link } from "react-router-dom";
import { ArrowLeft, Mail, MessageSquare, Phone, CircleCheckBig, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Contato() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    assunto: "",
    mensagem: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    toast({
      title: "Mensagem enviada!",
      description: "Entraremos em contato em breve.",
    });

    setFormData({ nome: "", email: "", assunto: "", mensagem: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

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
        <div className="absolute inset-0 radar-rings opacity-50" />
        <div className="absolute inset-0 bg-grid-pattern" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-5 text-foreground">
              Entre em{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Contato
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Estamos prontos para ajudar voce com qualquer duvida
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 md:py-20 max-w-5xl">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Form - 3 columns */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="md:col-span-3"
          >
            <div className="glass shadow-medium rounded-2xl p-8 md:p-10">
              <h2 className="text-2xl font-bold font-display text-foreground mb-6">Envie sua mensagem</h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="nome" className="text-foreground/80 mb-2 block">Nome</Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    placeholder="Seu nome completo"
                    className="bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-foreground/80 mb-2 block">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="seu@email.com"
                    className="bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  />
                </div>

                <div>
                  <Label htmlFor="assunto" className="text-foreground/80 mb-2 block">Assunto</Label>
                  <Input
                    id="assunto"
                    name="assunto"
                    value={formData.assunto}
                    onChange={handleChange}
                    required
                    placeholder="Qual o motivo do contato?"
                    className="bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  />
                </div>

                <div>
                  <Label htmlFor="mensagem" className="text-foreground/80 mb-2 block">Mensagem</Label>
                  <Textarea
                    id="mensagem"
                    name="mensagem"
                    value={formData.mensagem}
                    onChange={handleChange}
                    required
                    placeholder="Digite sua mensagem aqui..."
                    rows={5}
                    className="bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200 resize-none"
                  />
                </div>

                <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold shadow-glow hover:opacity-90 transition-all duration-300 h-12 text-base">
                  <Send className="w-5 h-5 mr-2" />
                  Enviar Mensagem
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Info cards - 2 columns */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-2 space-y-5"
          >
            <div className="glass shadow-soft rounded-2xl p-7 hover:shadow-medium hover:border-primary/20 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold font-display text-lg mb-1 text-foreground">Email</h3>
                  <p className="text-foreground/70">contato@radarcheck.com.br</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Respondemos em ate 24 horas
                  </p>
                </div>
              </div>
            </div>

            <div className="glass shadow-soft rounded-2xl p-7 hover:shadow-medium hover:border-primary/20 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold font-display text-lg mb-1 text-foreground">Telefone</h3>
                  <p className="text-foreground/70">(11) 3000-0000</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Seg-Sex: 9h as 18h
                  </p>
                </div>
              </div>
            </div>

            <div className="glass shadow-soft rounded-2xl p-7 hover:shadow-medium hover:border-primary/20 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold font-display text-lg mb-1 text-foreground">Suporte</h3>
                  <p className="text-foreground/70 mb-3">
                    Precisa de ajuda? Confira nossas perguntas frequentes ou entre em contato.
                  </p>
                  <Button variant="outline" size="sm" asChild className="border-border/50 hover:border-primary/40 hover:bg-primary/5">
                    <Link to="/sobre">Saiba Mais</Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
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
              <Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">FAQ</Link>
              <Link to="/termos-de-uso" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">Termos de Uso</Link>
              <Link to="/privacidade" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">Privacidade</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
