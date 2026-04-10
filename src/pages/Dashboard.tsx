import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Download,
  Eye,
  Shield,
  LogOut,
  User,
  Home,
  Crown,
  Zap,
  Trash2,
  AlertCircle,
  Activity,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { RecursoGenerator } from "@/components/RecursoGenerator";
import { useConsultationLimit } from "@/hooks/useConsultationLimit";
import { useAdminCheck } from "@/hooks/useAdminCheck";

interface ConsultaResultado {
  status_aprovado: boolean;
  numero_certificado?: string;
  data_certificado?: string;
  validade_certificado?: string;
  mensagem?: string;
}

interface Consulta {
  id: string;
  numero_serie: string;
  numero_auto: string | null;
  data_infracao: string | null;
  local_infracao: string | null;
  nome_condutor: string | null;
  cpf_cnpj_condutor: string | null;
  nome_proprietario: string | null;
  cpf_cnpj_proprietario: string | null;
  created_at: string;
  resultado: ConsultaResultado | null;
  radar_id: string | null;
}

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedConsulta, setSelectedConsulta] = useState<Consulta | null>(null);
  const [showRecursoGenerator, setShowRecursoGenerator] = useState(false);
  const [retryingConsultas, setRetryingConsultas] = useState<Set<string>>(new Set());
  const { limit } = useConsultationLimit();
  const { isAdmin } = useAdminCheck();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      await loadProfile(session.user.id);
      await loadConsultas(session.user.id);
    };
    checkUser();
  }, [navigate]);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      console.error("Error loading profile:", error);
    }
  };

  const loadConsultas = async (userId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("consultas")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setConsultas((data || []) as any);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar consultas",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleGerarRecurso = async (consulta: Consulta) => {
    // Fetch radar details if we have a radar_id
    let radarData = null;
    if (consulta.radar_id) {
      const { data } = await supabase
        .from("radares")
        .select("*")
        .eq("id", consulta.radar_id)
        .single();
      radarData = data;
    }

    // Store both consulta and radar data
    setSelectedConsulta({ ...consulta, radarData } as any);
    setShowRecursoGenerator(true);
  };

  const handleDeleteConsulta = async (consultaId: string) => {
    if (!window.confirm("Tem certeza que deseja excluir esta consulta? Esta acao nao pode ser desfeita.\n\nOBS: Excluir a consulta NAO afeta seu limite mensal de consultas.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("consultas")
        .delete()
        .eq("id", consultaId);

      if (error) throw error;

      // Atualiza a lista local removendo a consulta deletada
      setConsultas(consultas.filter(c => c.id !== consultaId));

      toast({
        title: "Consulta excluida",
        description: "A consulta foi removida do seu historico.",
      });
    } catch (error) {
      console.error("Erro ao excluir consulta:", error);
      toast({
        title: "Erro ao excluir",
        description: "Nao foi possivel excluir a consulta. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleRetryConsulta = async (consulta: Consulta) => {
    // Adicionar ao set de consultas sendo retentadas
    setRetryingConsultas(prev => new Set(prev).add(consulta.id));

    try {
      toast({
        title: "Tentando novamente...",
        description: "Refazendo a consulta no Inmetro",
      });

      // Chamar edge function com os mesmos dados
      const { data, error } = await supabase.functions.invoke('consultar-inmetro', {
        body: {
          numeroSerie: consulta.numero_serie,
          numeroAuto: consulta.numero_auto,
          dataInfracao: consulta.data_infracao,
          localInfracao: consulta.local_infracao,
          nomeCondutor: consulta.nome_condutor,
          cpfCnpjCondutor: consulta.cpf_cnpj_condutor,
          nomeProprietario: consulta.nome_proprietario,
          cpfCnpjProprietario: consulta.cpf_cnpj_proprietario,
        }
      });

      if (error) throw error;

      // Atualizar a consulta existente com novo resultado
      const { error: updateError } = await supabase
        .from('consultas')
        .update({
          resultado: data,
        })
        .eq('id', consulta.id);

      if (updateError) throw updateError;

      // Atualizar estado local
      setConsultas(prev => prev.map(c =>
        c.id === consulta.id
          ? { ...c, resultado: data }
          : c
      ));

      if (data.status_aprovado === false && data.mensagem?.includes("Nao foi possivel")) {
        toast({
          title: "Consulta ainda com erro",
          description: "A API do Inmetro continua indisponivel. Tente novamente mais tarde.",
          variant: "destructive",
        });
      } else if (data.status_aprovado) {
        toast({
          title: "Consulta bem-sucedida!",
          description: "O radar esta aprovado pelo Inmetro",
        });
      } else {
        toast({
          title: "Consulta bem-sucedida!",
          description: "O radar NAO esta aprovado pelo Inmetro",
        });
      }

    } catch (error) {
      console.error('Erro ao refazer consulta:', error);
      toast({
        title: "Erro ao tentar novamente",
        description: "Nao foi possivel refazer a consulta. Tente mais tarde.",
        variant: "destructive",
      });
    } finally {
      // Remover do set de consultas sendo retentadas
      setRetryingConsultas(prev => {
        const newSet = new Set(prev);
        newSet.delete(consulta.id);
        return newSet;
      });
    }
  };

  const stats = {
    total: consultas.length,
    aprovados: consultas.filter((c) => c.resultado?.status_aprovado).length,
    naoAprovados: consultas.filter((c) => !c.resultado?.status_aprovado).length,
  };

  return (
    <div className="min-h-screen gradient-hero bg-grid-pattern relative">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-[40%] -right-[20%] w-[60%] h-[60%] rounded-full bg-primary/[0.04] blur-[120px]" />
        <div className="absolute -bottom-[30%] -left-[15%] w-[50%] h-[50%] rounded-full bg-accent/[0.03] blur-[100px]" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 glass-strong shadow-medium"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="text-muted-foreground hover:text-foreground hover:bg-white/[0.06]"
              >
                <Home className="w-4 h-4 mr-2" />
                Inicio
              </Button>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-glow">
                  <Shield className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-display text-xl font-bold text-foreground tracking-tight">Dashboard</h1>
                  <p className="text-xs text-muted-foreground font-body">Suas consultas e historico</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => navigate("/admin")}
                  className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 border-0 shadow-soft"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/planos")}
                className="hidden md:flex text-muted-foreground hover:text-primary hover:bg-primary/[0.08]"
              >
                <Crown className="w-4 h-4 mr-2 text-primary" />
                {limit?.plano || "Gratuito"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/perfil")}
                className="text-muted-foreground hover:text-foreground hover:bg-white/[0.06]"
              >
                <User className="w-4 h-4 mr-2" />
                Perfil
              </Button>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-red-400 hover:bg-red-500/[0.08]"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div variants={stagger} initial="hidden" animate="show">

          {/* Usage Stats Card */}
          {limit && (
            <motion.div variants={fadeUp} className="mb-8">
              <div className="glass rounded-2xl shadow-medium border border-primary/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.06] to-accent/[0.04] rounded-2xl pointer-events-none" />
                <div className="relative p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-accent shadow-glow">
                        <Zap className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-lg text-foreground">Plano {limit.plano}</h3>
                        <p className="text-sm text-muted-foreground font-body">
                          {limit.limite_mensal === -1 ? (
                            "Consultas ilimitadas este mes"
                          ) : (
                            <>
                              {limit.consultas_usadas} de {limit.limite_mensal} consultas usadas este mes
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => navigate("/planos")}
                      className="hidden md:flex gradient-primary text-primary-foreground border-0 hover:opacity-90 shadow-glow transition-all duration-300"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Fazer Upgrade
                    </Button>
                  </div>
                  {/* Progress bar */}
                  {limit.limite_mensal !== -1 && (
                    <div className="mt-4">
                      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <motion.div
                          className="h-full rounded-full gradient-accent"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((limit.consultas_usadas / limit.limite_mensal) * 100, 100)}%` }}
                          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <motion.div variants={fadeUp}>
              <div className="glass rounded-2xl shadow-soft p-6 group hover:shadow-glow transition-all duration-500 border border-white/[0.06] hover:border-primary/30">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-muted-foreground font-body">Total de Consultas</span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <p className="stat-number text-foreground group-hover:text-primary transition-colors duration-300">{stats.total}</p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <div className="glass rounded-2xl shadow-soft p-6 group hover:shadow-glow transition-all duration-500 border border-white/[0.06] hover:border-green-500/30"
                   style={{ "--tw-shadow-color": "rgba(34, 197, 94, 0.15)" } as React.CSSProperties}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-muted-foreground font-body">Radares Aprovados</span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-500/10">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <p className="stat-number text-green-600">{stats.aprovados}</p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <div className="glass rounded-2xl shadow-soft p-6 group hover:shadow-glow transition-all duration-500 border border-white/[0.06] hover:border-red-500/30"
                   style={{ "--tw-shadow-color": "rgba(239, 68, 68, 0.15)" } as React.CSSProperties}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-muted-foreground font-body">Radares Nao Aprovados</span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                  </div>
                </div>
                <p className="stat-number text-red-400">{stats.naoAprovados}</p>
              </div>
            </motion.div>
          </div>

          {/* Consultas List */}
          <motion.div variants={fadeUp}>
            <div className="glass-strong rounded-2xl shadow-strong overflow-hidden">
              <div className="p-6 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <h2 className="font-display text-lg font-semibold text-foreground">Historico de Consultas</h2>
                </div>
              </div>
              <div className="p-6">
                {isLoading ? (
                  <div className="text-center py-16">
                    <div className="inline-flex items-center gap-3 text-muted-foreground">
                      <RefreshCw className="h-5 w-5 animate-spin text-primary" />
                      <span className="font-body">Carregando consultas...</span>
                    </div>
                  </div>
                ) : consultas.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04] mx-auto mb-4">
                      <AlertTriangle className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground mb-6 font-body">
                      Voce ainda nao realizou nenhuma consulta
                    </p>
                    <Button
                      onClick={() => navigate("/")}
                      className="gradient-primary text-primary-foreground border-0 shadow-glow hover:opacity-90 transition-all"
                    >
                      Fazer primeira consulta
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {consultas.map((consulta, index) => {
                      const isError = consulta.resultado?.mensagem?.includes("Nao foi possivel completar a consulta");
                      const isApproved = consulta.resultado?.status_aprovado;

                      return (
                        <motion.div
                          key={consulta.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.04, duration: 0.4 }}
                          className={`glass rounded-xl p-5 transition-all duration-300 hover:shadow-medium group ${
                            isError
                              ? "border-yellow-500/20 hover:border-yellow-500/40"
                              : isApproved
                              ? "border-green-500/15 hover:border-green-500/30"
                              : "border-red-500/15 hover:border-red-500/30"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-3 flex-1 min-w-0">
                              <div className="flex items-center gap-3">
                                {/* Status dot */}
                                <div className={`flex-shrink-0 h-3 w-3 rounded-full ${
                                  isError
                                    ? "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]"
                                    : isApproved
                                    ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                                    : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                                }`} />
                                <div className="min-w-0">
                                  <p className="font-display font-semibold text-lg text-foreground truncate">
                                    Radar #{consulta.numero_serie}
                                  </p>
                                  {isError ? (
                                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                                      Erro na Consulta - Tente novamente
                                    </span>
                                  ) : (
                                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full ${
                                      isApproved
                                        ? "bg-green-500/10 text-green-600 border border-green-500/20"
                                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                                    }`}>
                                      {isApproved ? "Aprovado" : "Nao Aprovado"}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm font-body">
                                {consulta.numero_auto && (
                                  <div>
                                    <span className="text-muted-foreground">Auto:</span>{" "}
                                    <span className="font-medium text-foreground/90">{consulta.numero_auto}</span>
                                  </div>
                                )}
                                {consulta.data_infracao && (
                                  <div>
                                    <span className="text-muted-foreground">Data:</span>{" "}
                                    <span className="font-medium text-foreground/90">
                                      {new Date(consulta.data_infracao).toLocaleDateString("pt-BR")}
                                    </span>
                                  </div>
                                )}
                                {consulta.local_infracao && (
                                  <div className="sm:col-span-2">
                                    <span className="text-muted-foreground">Local:</span>{" "}
                                    <span className="font-medium text-foreground/90">{consulta.local_infracao}</span>
                                  </div>
                                )}
                                <div className="sm:col-span-2">
                                  <span className="text-muted-foreground">Consultado em:</span>{" "}
                                  <span className="font-medium text-foreground/90">
                                    {new Date(consulta.created_at).toLocaleString("pt-BR")}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                              {/* Retry button - only shows on technical errors */}
                              {consulta.resultado?.mensagem?.includes("Nao foi possivel completar a consulta") && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRetryConsulta(consulta)}
                                  disabled={retryingConsultas.has(consulta.id)}
                                  className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 border border-yellow-500/20"
                                >
                                  {retryingConsultas.has(consulta.id) ? (
                                    <>
                                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                      <span className="hidden sm:inline">Consultando...</span>
                                    </>
                                  ) : (
                                    <>
                                      <RefreshCw className="w-4 h-4 mr-2" />
                                      <span className="hidden sm:inline">Tentar Novamente</span>
                                    </>
                                  )}
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleGerarRecurso(consulta)}
                                className="text-primary hover:text-primary hover:bg-primary/10 border border-primary/20"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Gerar Recurso</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteConsulta(consulta.id)}
                                className="text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>

      {/* Recurso Generator Modal */}
      {showRecursoGenerator && selectedConsulta && (
        <RecursoGenerator
          data={{
            numero_auto: selectedConsulta.numero_auto || "",
            data_autuacao: selectedConsulta.data_infracao || "",
            local_instrumento: selectedConsulta.local_infracao || "",
            nome_autuado: selectedConsulta.nome_condutor || selectedConsulta.nome_proprietario || profile?.full_name || "",
            documento_autuado: selectedConsulta.cpf_cnpj_condutor || selectedConsulta.cpf_cnpj_proprietario || profile?.cpf_cnpj || "",
            endereco_autuado: "",
            contato_autuado: profile?.telefone ? `${profile.telefone}${user?.email ? ` / ${user.email}` : ""}` : user?.email || "",
            numero_serie: selectedConsulta.numero_serie,
            marca_modelo: (selectedConsulta as any).radarData
              ? `${(selectedConsulta as any).radarData.marca || ""} ${(selectedConsulta as any).radarData.modelo || ""}`.trim()
              : "",
            tipo_instrumento: "Medidor de Velocidade",
            UF: (selectedConsulta as any).radarData?.uf || "",
            cidade: (selectedConsulta as any).radarData?.municipio || "",
            data_consulta: new Date(selectedConsulta.created_at).toLocaleDateString("pt-BR"),
            numero_certificado: selectedConsulta.resultado?.numero_certificado || "N/A",
            data_certificado: selectedConsulta.resultado?.data_certificado || "N/A",
            validade_certificado: selectedConsulta.resultado?.validade_certificado || "N/A",
            data_recurso: new Date().toLocaleDateString("pt-BR"),
            status_aprovado: selectedConsulta.resultado?.status_aprovado || false,
          }}
          onClose={() => {
            setShowRecursoGenerator(false);
            setSelectedConsulta(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
