import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Link as RouterLink } from "react-router-dom";
import { z } from "zod";
import {
  CheckCircle2,
  FileText,
  Search,
  Shield,
  CircleCheckBig,
  Lock,
  LogOut,
  LogIn,
  AlertTriangle,
  TrendingUp,
  Users,
  FileCheck,
  Zap,
  ChevronRight,
  Star,
  Award,
  XCircle,
  Loader2,
  LayoutDashboard,
  Car,
  Building,
  Code,
  ArrowRight,
  ScanLine,
  Activity
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordInput } from "@/components/ui/password-input";
import { useToast } from "@/hooks/use-toast";
import { RecursoGenerator } from "@/components/RecursoGenerator";
import { MultaUpload } from "@/components/MultaUpload";
import { RecursoInstructions } from "@/components/RecursoInstructions";
import { useConsultationLimit } from "@/hooks/useConsultationLimit";
import UpgradeModal from "@/components/UpgradeModal";
import type { User } from "@supabase/supabase-js";

const consultaSchema = z.object({
  numeroSerie: z.string()
    .trim()
    .min(1, "Número de série é obrigatório")
    .max(50, "Número de série deve ter no máximo 50 caracteres")
    .regex(/^[A-Z0-9\-\/\s]+$/i, "Número de série contém caracteres inválidos"),
  numeroAuto: z.string().max(50, "Número do auto deve ter no máximo 50 caracteres").optional(),
  dataAutuacao: z.string().max(10, "Data inválida").optional(),
  localInstrumento: z.string().max(200, "Local muito longo").optional(),
  nomeAutuado: z.string().max(100, "Nome muito longo").optional(),
  documentoAutuado: z.string()
    .max(18, "CPF/CNPJ inválido")
    .regex(/^[0-9.\-\/]*$/, "CPF/CNPJ contém caracteres inválidos")
    .optional(),
  marcaModelo: z.string().max(100, "Marca/modelo muito longo").optional(),
  uf: z.string().max(2, "UF inválida").optional(),
  cidade: z.string().max(100, "Cidade muito longa").optional(),
});

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [showRecursoGenerator, setShowRecursoGenerator] = useState(false);
  const [showResultado, setShowResultado] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { limit, checkLimit, incrementUsage } = useConsultationLimit();

  const [numeroSerie, setNumeroSerie] = useState("");
  const [numeroAuto, setNumeroAuto] = useState("");
  const [dataAutuacao, setDataAutuacao] = useState("");
  const [localInstrumento, setLocalInstrumento] = useState("");
  const [nomeAutuado, setNomeAutuado] = useState("");
  const [documentoAutuado, setDocumentoAutuado] = useState("");
  const [enderecoAutuado, setEnderecoAutuado] = useState("");
  const [contatoAutuado, setContatoAutuado] = useState("");
  const [marcaModelo, setMarcaModelo] = useState("");
  const [uf, setUf] = useState("");
  const [cidade, setCidade] = useState("");

  const [resultadoConsulta, setResultadoConsulta] = useState<any>(null);

  // Cadastro inline
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupTerms, setSignupTerms] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPassword) {
      toast({ title: "Preencha todos os campos", variant: "destructive" }); return;
    }
    if (!signupTerms) {
      toast({ title: "Aceite os termos", description: "Você precisa aceitar os Termos de Uso e Política de Privacidade", variant: "destructive" }); return;
    }
    if (signupPassword.length < 6) {
      toast({ title: "Senha fraca", description: "A senha deve ter no mínimo 6 caracteres", variant: "destructive" }); return;
    }
    setSignupLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: { emailRedirectTo: `${window.location.origin}/dashboard`, data: { name: signupName } },
      });
      if (error) {
        toast({ title: "Erro ao criar conta", description: error.message.includes("already registered") ? "Este email já está cadastrado" : error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Conta criada!", description: "Você já pode fazer login" });
      navigate("/auth");
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível criar a conta", variant: "destructive" });
    } finally {
      setSignupLoading(false);
    }
  };

  const handleMultaDataExtracted = (data: any) => {
    if (data.numero_serie) setNumeroSerie(data.numero_serie);
    if (data.numero_auto) setNumeroAuto(data.numero_auto);
    if (data.data_infracao) setDataAutuacao(data.data_infracao);
    if (data.local_infracao) setLocalInstrumento(data.local_infracao);
    if (data.nome_condutor) setNomeAutuado(data.nome_condutor);
    if (data.cpf_cnpj_condutor) setDocumentoAutuado(data.cpf_cnpj_condutor);
    if (data.nome_proprietario && !data.nome_condutor) setNomeAutuado(data.nome_proprietario);
    if (data.cpf_cnpj_proprietario && !data.cpf_cnpj_condutor) setDocumentoAutuado(data.cpf_cnpj_proprietario);
    setTimeout(() => {
      document.getElementById('form-consulta')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 500);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logout realizado", description: "Você foi desconectado com sucesso" });
  };

  const handleQuickSearch = () => {
    if (!searchValue.trim()) {
      toast({ title: "Campo obrigatório", description: "Digite o número de série do radar", variant: "destructive" });
      return;
    }
    setNumeroSerie(searchValue);
    document.getElementById('form-consulta')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleConsultar = async () => {
    // Exigir login
    if (!user) {
      toast({ title: "Cadastro necessário", description: "Crie sua conta gratuita para consultar. Você tem 1 consulta grátis!", variant: "destructive" });
      navigate("/auth");
      return;
    }

    // Verificar limite de consultas
    await checkLimit();
    if (limit && !limit.pode_consultar) {
      setShowUpgradeModal(true);
      return;
    }

    const formData = { numeroSerie, numeroAuto, dataAutuacao, localInstrumento, nomeAutuado, documentoAutuado, marcaModelo, uf, cidade };
    try {
      consultaSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({ title: "Dados inválidos", description: error.errors[0].message, variant: "destructive" });
        return;
      }
    }
    setIsLoading(true);
    setShowResultado(false);
    setResultadoConsulta(null);
    try {
      // Busca flexível: com e sem barra/espaços
      const s = numeroSerie.trim();
      const limpo = s.replace(/[\/ \-]/g, "");
      let radares: any[] = [];
      let { data: r1 } = await supabase.from("radares").select("*").eq("numero_serie", s);
      if (r1 && r1.length > 0) { radares = r1; }
      else {
        let { data: r2 } = await supabase.from("radares").select("*").ilike("numero_serie", `%${limpo}%`);
        if (r2 && r2.length > 0) { radares = r2; }
        else if (limpo.length >= 6) {
          const comBarra = limpo.slice(0, 6) + "/" + limpo.slice(6);
          let { data: r3 } = await supabase.from("radares").select("*").eq("numero_serie", comBarra);
          if (r3 && r3.length > 0) { radares = r3; }
        }
      }
      let data;
      if (radares.length > 0) {
        const r = radares[0];
        // Verificar se a validade do certificado está vencida
        let validadeVencida = false;
        let validadeDate: Date | null = null;
        if (r.validade_certificado) {
          const partes = r.validade_certificado.split("/");
          if (partes.length === 3) {
            validadeDate = new Date(Number(partes[2]), Number(partes[1]) - 1, Number(partes[0]));
            validadeVencida = validadeDate < new Date();
          }
        }

        const estaRegular = r.status_aprovado && !validadeVencida;

        let mensagem = "";
        if (!r.status_aprovado) {
          mensagem = "Instrumento NÃO está aprovado pelo Inmetro. Este radar não possui certificação válida.";
        } else if (validadeVencida) {
          mensagem = `Certificação VENCIDA desde ${r.validade_certificado}.\nO radar estava aprovado, mas a validade do certificado expirou.\nMultas aplicadas após ${r.validade_certificado} podem ser contestadas,\npois o equipamento operava sem certificação vigente.`;
        } else {
          mensagem = `Instrumento regularizado e aprovado pelo Inmetro. Certificado válido até ${r.validade_certificado}.`;
        }

        data = {
          status_aprovado: estaRegular,
          numero_certificado: r.numero_certificado || "",
          data_certificado: r.data_certificado || "",
          validade_certificado: r.validade_certificado || "",
          mensagem,
          fonte: "Base RadarCheck (dados abertos Inmetro)",
          numero_serie: numeroSerie.trim(),
          uf: r.uf || "",
          municipio: r.municipio || "",
          validade_vencida: validadeVencida,
        };
      } else {
        data = {
          status_aprovado: false,
          numero_certificado: "",
          data_certificado: "",
          validade_certificado: "",
          mensagem: "Radar não encontrado na nossa base de dados. Verifique se o número de série está correto.",
          fonte: "Base RadarCheck",
          numero_serie: numeroSerie.trim(),
          validade_vencida: false,
        };
      }
      // Incrementar uso da consulta
      await incrementUsage(false);

      setResultadoConsulta(data);
      setShowResultado(true);
      localStorage.setItem("radarcheck_has_consulted", "true");
      toast({ title: "Consulta realizada", description: data.mensagem || "Dados do Inmetro obtidos com sucesso" });
    } catch (error: any) {
      console.error('Erro na consulta:', error);
      toast({ title: "Erro na consulta", description: error.message || "Não foi possível consultar o Inmetro", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── Header ── */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 border-b border-border bg-white/90 backdrop-blur-lg"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500">
                <CircleCheckBig className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-display text-lg font-bold text-foreground tracking-tight">RadarCheck</h1>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Verificação Inmetro</p>
              </div>
            </Link>
            <nav className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild className="hidden sm:flex text-muted-foreground hover:text-foreground">
                <Link to="/faq">FAQ</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild className="hidden sm:flex text-muted-foreground hover:text-foreground">
                <Link to="/planos">Planos</Link>
              </Button>
              {user ? (
                <div className="flex items-center gap-2">
                  <Button onClick={() => navigate("/dashboard")} size="sm" className="gradient-accent text-white border-0">
                    <LayoutDashboard className="w-4 h-4 mr-1.5" />
                    Dashboard
                  </Button>
                  <Button onClick={handleLogout} variant="ghost" size="sm" className="text-muted-foreground">
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button onClick={() => navigate("/auth")} size="sm" className="gradient-primary text-primary-foreground border-0 font-semibold">
                  <LogIn className="w-4 h-4 mr-1.5" />
                  Entrar
                </Button>
              )}
            </nav>
          </div>
        </div>
      </motion.header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden gradient-hero py-10 md:py-14 noise">
        <div className="absolute inset-0 bg-grid-pattern" />

        <div className="container relative mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center max-w-5xl mx-auto">
            {/* Esquerda — Headline */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={stagger}
            >
              <motion.h1 variants={fadeUp} className="font-display text-3xl md:text-5xl font-bold leading-[1.1] mb-3 text-white">
                Descubra se sua
                <span className="block bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                  multa de radar é válida
                </span>
              </motion.h1>
              <motion.p variants={fadeUp} className="text-sm md:text-base text-white/70 max-w-sm leading-relaxed mb-4">
                Verificamos no Inmetro se o radar que te multou está com a certificação em dia. Cadastre-se e ganhe 1 consulta grátis.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-3 text-xs text-white/60">
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-400" /> 32 mil+ radares</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-400" /> 26 estados</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-400" /> Resultado na hora</span>
              </motion.div>
            </motion.div>

            {/* Direita — Formulário */}
            <motion.div
              id="form-consulta"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {user ? (
                <Card className="bg-white shadow-strong border-0">
                  <CardContent className="p-5">
                    <h3 className="font-display text-base font-bold text-foreground mb-3">Consultar Radar</h3>
                    <div>
                      <Label htmlFor="numeroSerie" className="text-sm text-muted-foreground">Número de Série</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="numeroSerie"
                          placeholder="Ex: 1506161782"
                          className="h-11 bg-secondary/30 border-border"
                          value={numeroSerie}
                          onChange={(e) => setNumeroSerie(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleConsultar()}
                        />
                        <Button
                          className="h-11 px-5 gradient-primary text-white border-0 shrink-0"
                          onClick={handleConsultar}
                          disabled={isLoading || !numeroSerie.trim()}
                        >
                          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5">O número está na notificação de multa</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                /* Deslogado: formulário de cadastro */
                <Card className="bg-white shadow-strong border-0">
                  <CardContent className="p-5">
                    <h3 className="font-display text-base font-bold text-foreground mb-0.5">Crie sua conta grátis</h3>
                    <p className="text-xs text-muted-foreground mb-3">Ganhe 1 consulta gratuita</p>
                    <form onSubmit={handleSignup} className="space-y-2.5">
                      <div>
                        <Input
                          placeholder="Seu nome"
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          className="h-9 text-sm bg-secondary/30 border-border"
                          required
                        />
                      </div>
                      <div>
                        <Input
                          type="email"
                          placeholder="Seu e-mail"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          className="h-9 text-sm bg-secondary/30 border-border"
                          required
                        />
                      </div>
                      <div>
                        <PasswordInput
                          placeholder="Crie uma senha"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          className="h-9 text-sm bg-secondary/30 border-border"
                          required
                        />
                      </div>
                      <div className="flex items-start gap-2">
                        <Checkbox
                          id="hero-terms"
                          checked={signupTerms}
                          onCheckedChange={(c) => setSignupTerms(c === true)}
                          className="mt-0.5"
                        />
                        <label htmlFor="hero-terms" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                          Aceito os{" "}
                          <Link to="/termos-de-uso" target="_blank" className="text-primary hover:underline">Termos</Link>
                          {" "}e a{" "}
                          <Link to="/privacidade" target="_blank" className="text-primary hover:underline">Privacidade</Link>
                        </label>
                      </div>
                      <Button
                        type="submit"
                        className="w-full h-9 text-sm gradient-primary text-white border-0 font-semibold shadow-glow"
                        disabled={signupLoading || !signupTerms}
                      >
                        {signupLoading ? "Criando..." : "Cadastrar e consultar grátis"}
                      </Button>
                    </form>
                    <p className="text-[11px] text-muted-foreground text-center mt-2">
                      Já tem conta?{" "}
                      <button onClick={() => navigate("/auth")} className="text-primary hover:underline font-medium">Entrar</button>
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Resultado da Consulta */}
              {showResultado && resultadoConsulta && (
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-6">
                  <Card className={`shadow-strong border-2 bg-white ${
                    resultadoConsulta.status_aprovado
                      ? 'border-green-500/30'
                      : resultadoConsulta.validade_vencida
                      ? 'border-amber-500/30'
                      : 'border-red-500/30'
                  }`}>
                    <CardContent className="p-6 md:p-8">
                      <div className="text-center mb-6">
                        {resultadoConsulta.status_aprovado ? (
                          <>
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 mb-4">
                              <CheckCircle2 className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="font-display text-2xl font-bold text-green-600 mb-2">
                              Radar Aprovado pelo Inmetro
                            </h3>
                            <p className="text-muted-foreground">{resultadoConsulta.mensagem}</p>
                          </>
                        ) : resultadoConsulta.validade_vencida ? (
                          <>
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-4">
                              <AlertTriangle className="w-8 h-8 text-amber-500" />
                            </div>
                            <h3 className="font-display text-2xl font-bold text-amber-500 mb-2">
                              Certificação VENCIDA
                            </h3>
                            <p className="text-muted-foreground max-w-lg mx-auto whitespace-pre-line">{resultadoConsulta.mensagem}</p>
                          </>
                        ) : (
                          <>
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 mb-4">
                              <XCircle className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="font-display text-2xl font-bold text-red-500 mb-2">
                              Radar NÃO Aprovado
                            </h3>
                            <p className="text-muted-foreground">{resultadoConsulta.mensagem}</p>
                          </>
                        )}
                      </div>

                      <div className="rounded-xl p-6 space-y-3 mb-6 bg-gray-50 border border-border/50">
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold text-foreground">Número de Série:</span>
                          <span className="text-muted-foreground font-mono">{numeroSerie}</span>
                        </div>
                        {resultadoConsulta.uf && (
                          <div className="flex justify-between text-sm">
                            <span className="font-semibold text-foreground">Localização:</span>
                            <span className="text-muted-foreground">{resultadoConsulta.municipio} - {resultadoConsulta.uf}</span>
                          </div>
                        )}
                        {resultadoConsulta.numero_certificado && (
                          <>
                            <div className="flex justify-between text-sm">
                              <span className="font-semibold text-foreground">Certificado:</span>
                              <span className="text-muted-foreground font-mono">{resultadoConsulta.numero_certificado}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="font-semibold text-foreground">Data do Certificado:</span>
                              <span className="text-muted-foreground">{resultadoConsulta.data_certificado}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="font-semibold text-foreground">Validade:</span>
                              <span className={`font-mono ${resultadoConsulta.validade_vencida ? 'text-red-500 font-bold' : 'text-muted-foreground'}`}>
                                {resultadoConsulta.validade_certificado}
                                {resultadoConsulta.validade_vencida && ' (VENCIDO)'}
                              </span>
                            </div>
                          </>
                        )}
                      </div>

                      {!resultadoConsulta.status_aprovado && resultadoConsulta.validade_vencida && (
                        <div className="rounded-xl p-5 mb-6 border-2 border-amber-500/30 bg-amber-50">
                          <p className="text-sm text-foreground mb-2">
                            <strong className="text-amber-600">Por que este radar é inválido?</strong>
                          </p>
                          <p className="text-sm text-muted-foreground mb-3">
                            O certificado de verificação metrológica deste radar expirou em <strong className="text-foreground">{resultadoConsulta.validade_certificado}</strong>.
                            Conforme a Portaria Inmetro nº 544/2014, todo medidor de velocidade deve possuir verificação periódica válida para operar legalmente.
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-foreground">Isso significa que:</strong> multas aplicadas por este radar após {resultadoConsulta.validade_certificado} podem ser anuladas,
                            pois o equipamento estava operando sem certificação válida do Inmetro.
                          </p>
                        </div>
                      )}

                      {!resultadoConsulta.status_aprovado && !resultadoConsulta.validade_vencida && (
                        <div className="rounded-xl p-5 mb-6 border-2 border-red-500/30 bg-red-50">
                          <p className="text-sm text-foreground mb-2">
                            <strong className="text-red-600">Por que este radar é inválido?</strong>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Este radar não consta como aprovado na base de dados do Inmetro.
                            Equipamentos sem aprovação metrológica não podem ser utilizados para fiscalização de trânsito.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Por que verificar seu radar?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              O sistema de fiscalização eletrônica no Brasil tem problemas sérios
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {[
              { number: "+280M", label: "Multas de velocidade por ano no Brasil", icon: FileText, color: "text-primary" },
              { number: "1 em 5", label: "Radares tem inconsistências de aprovação", icon: AlertTriangle, color: "text-amber-400" },
              { number: "80%", label: "Das multas indevidas são revertidas com recurso", icon: TrendingUp, color: "text-accent" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glass text-center p-8 h-full hover:shadow-medium hover:border-primary/20 transition-all duration-300 group">
                  <div className="mb-5 flex justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/5 border border-primary/10 group-hover:border-primary/30 transition-colors">
                      <stat.icon className={`h-7 w-7 ${stat.color}`} />
                    </div>
                  </div>
                  <div className={`stat-number ${stat.color} mb-3`}>{stat.number}</div>
                  <p className="stat-label">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Como Funciona ── */}
      <section className="py-20 border-t border-border/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Como Funciona</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              5 passos simples para verificar sua multa
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-5 max-w-6xl mx-auto">
            {[
              { icon: FileText, step: "1", title: "Você envia a multa", description: "Foto, PDF ou digite manualmente" },
              { icon: ScanLine, step: "2", title: "Extraímos os dados via OCR", description: "Automático em segundos" },
              { icon: Search, step: "3", title: "Consultamos o Inmetro", description: "Verificação em tempo real" },
              { icon: CheckCircle2, step: "4", title: "Mostramos se está aprovado", description: "Situação do radar no Inmetro" },
              { icon: FileCheck, step: "5", title: "Geramos o recurso", description: "Se o radar estiver irregular" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <Card className="glass relative h-full p-6 hover:border-primary/20 transition-all duration-300 group">
                  <div className="mb-4">
                    <div className="relative">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 border border-primary/10 group-hover:border-primary/30 group-hover:bg-primary/10 transition-all">
                        <item.icon className="h-6 w-6 text-primary" />
                      </div>
                      <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full gradient-primary text-primary-foreground text-xs font-bold shadow-glow">
                        {item.step}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-display text-base font-semibold text-foreground mb-1.5">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button size="lg" className="gradient-primary text-primary-foreground border-0 shadow-glow" onClick={() => {
              document.getElementById('form-consulta')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Fazer consulta gratuita
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 border-t border-border/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              O que dizem nossos usuários
            </h2>
            <p className="text-lg text-muted-foreground">
              Mais de 3.000 multas analisadas no piloto
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {[
              { name: "Fernanda A.", location: "RJ", text: "Enviei a foto da multa e em 30 segundos já sabia que podia recorrer.", rating: 5 },
              { name: "Carlos M.", location: "SP", text: "Meu radar não tinha aprovação vigente. Recurso aceito!", rating: 5 },
              { name: "Ana Paula S.", location: "MG", text: "Ferramenta incrível. Economizei mais de R$ 400.", rating: 5 },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glass p-6 h-full hover:border-primary/20 transition-all duration-300">
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-foreground mb-4 italic leading-relaxed">"{testimonial.text}"</p>
                  <div className="border-t border-border/50 pt-4">
                    <p className="font-display font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              + de 3.000 multas analisadas no piloto
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Pricing Preview ── */}
      <section className="py-20 border-t border-border/30 relative bg-green-50/50">
        <div className="container relative mx-auto px-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            <Badge className="trust-badge text-xs mb-4">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Você só paga se o radar estiver irregular
            </Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Escolha o melhor jeito de usar o RadarCheck
            </h2>
            <p className="text-lg text-muted-foreground">
              Consulte grátis. Gere o recurso quando realmente precisar.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {/* Free */}
            <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <Card className="glass h-full p-6 hover:border-primary/20 transition-all duration-300">
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/5 border border-primary/10">
                      <Shield className="h-7 w-7 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">RadarCheck Free</h3>
                  <div className="mb-2">
                    <span className="font-display text-4xl font-bold text-foreground">R$ 0</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-6 min-h-[200px]">
                  {["1 consulta por semana", "Upload de foto/PDF/PNG", "OCR automático", "Consulta oficial Inmetro", "Resultado na hora"].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant="outline" onClick={() => { document.getElementById('form-consulta')?.scrollIntoView({ behavior: 'smooth' }); }}>
                  Usar grátis
                </Button>
              </Card>
            </motion.div>

            {/* Recurso */}
            <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
              <Card className="glass h-full p-6 border-primary/30 shadow-glow relative hover:border-primary/50 transition-all duration-300">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="gradient-primary text-primary-foreground px-4 py-1 shadow-glow text-xs">
                    Mais usado
                  </Badge>
                </div>
                <div className="text-center mb-6 mt-2">
                  <div className="flex justify-center mb-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                      <FileCheck className="h-7 w-7 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">Gerar Recurso Automático</h3>
                  <div className="mb-2">
                    <span className="font-display text-4xl font-bold text-foreground">R$ 14,90</span>
                    <span className="text-sm text-muted-foreground block mt-1">pagamento único</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-6 min-h-[200px]">
                  {["Tudo do plano Free", "PDF jurídico completo", "Dados automaticamente preenchidos", "Orientações claras de envio", "Economia real vs. serviços jurídicos", "Suporte básico"].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full gradient-primary text-primary-foreground border-0 font-semibold" onClick={() => navigate("/planos")}>
                  Gerar recurso – R$ 14,90
                </Button>
              </Card>
            </motion.div>

            {/* Pro */}
            <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
              <Card className="glass h-full p-6 opacity-80 relative hover:border-primary/10 transition-all duration-300">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="outline" className="bg-card px-4 py-1 text-xs">Em breve</Badge>
                </div>
                <div className="text-center mb-6 mt-2">
                  <div className="flex justify-center mb-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/5 border border-accent/10">
                      <Award className="h-7 w-7 text-accent" />
                    </div>
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">RadarCheck Pro</h3>
                  <div className="mb-2">
                    <span className="font-display text-4xl font-bold text-foreground">R$ 19,90</span>
                    <span className="text-sm text-muted-foreground block mt-1">/mês</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-6 min-h-[200px]">
                  {["Consultas ilimitadas", "Recursos ilimitados", "Dashboard completo", "Histórico ilimitado", "Suporte prioritário", "Alertas automáticos"].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant="outline" disabled>Entrar na lista de espera</Button>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button size="lg" variant="outline" asChild>
              <Link to="/planos">
                Ver detalhes dos planos
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500">
                  <CircleCheckBig className="h-5 w-5 text-white" />
                </div>
                <span className="font-display text-xl font-bold text-foreground">RadarCheck</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Plataforma de verificação de radares de velocidade junto ao Inmetro.
              </p>
            </div>

            <div>
              <h3 className="font-display mb-4 font-semibold text-foreground text-sm">Links Úteis</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/sobre" className="hover:text-primary transition-colors">Sobre Nós</Link></li>
                <li><Link to="/contato" className="hover:text-primary transition-colors">Contato</Link></li>
                <li><a href="#form-consulta" className="hover:text-primary transition-colors">Consultar Radar</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-display mb-4 font-semibold text-foreground text-sm">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/termos-de-uso" className="hover:text-primary transition-colors">Termos de Uso</Link></li>
                <li><Link to="/privacidade" className="hover:text-primary transition-colors">Política de Privacidade</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-display mb-4 font-semibold text-foreground text-sm">Transparência</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2 text-sm">
                  <Lock className="w-3.5 h-3.5 mt-0.5 text-primary/60" />
                  <span className="text-muted-foreground">Consulta segura e gratuita</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Shield className="w-3.5 h-3.5 mt-0.5 text-primary/60" />
                  <span className="text-muted-foreground">Baseado em dados oficiais</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Zap className="w-3.5 h-3.5 mt-0.5 text-primary/60" />
                  <span className="text-muted-foreground">Sem burocracia</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-border/30 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 RadarCheck - Todos os direitos reservados</p>
            <p className="mt-3 max-w-3xl mx-auto leading-relaxed text-xs">
              <strong className="text-foreground/70">Nota Institucional:</strong> RadarCheck utiliza exclusivamente dados públicos e não armazena informações sensíveis dos usuários.
              A plataforma não presta consultoria jurídica e o uso das informações geradas é de responsabilidade exclusiva do usuário.
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        currentPlan={limit?.plano || "Gratuito"}
        usedConsultations={limit?.consultas_usadas || 0}
        totalConsultations={limit?.limite_mensal || 3}
      />

      {showRecursoGenerator && resultadoConsulta && (
        <RecursoGenerator
          data={{
            numero_auto: numeroAuto, data_autuacao: dataAutuacao, local_instrumento: localInstrumento,
            nome_autuado: nomeAutuado, documento_autuado: documentoAutuado, endereco_autuado: enderecoAutuado,
            contato_autuado: contatoAutuado, numero_serie: numeroSerie, marca_modelo: marcaModelo,
            tipo_instrumento: "Medidor de Velocidade", UF: uf, cidade: cidade,
            data_consulta: new Date().toLocaleDateString("pt-BR"),
            numero_certificado: resultadoConsulta.numero_certificado || "N/A",
            data_certificado: resultadoConsulta.data_certificado || "N/A",
            validade_certificado: resultadoConsulta.validade_certificado || "N/A",
            data_recurso: new Date().toLocaleDateString("pt-BR"),
            status_aprovado: resultadoConsulta.status_aprovado || false,
          }}
          onClose={() => {
            setShowRecursoGenerator(false);
            setResultadoConsulta(null);
          }}
        />
      )}
    </div>
  );
};

export default Index;
