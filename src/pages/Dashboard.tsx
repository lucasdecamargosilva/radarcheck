import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  CircleCheckBig,
  LogOut,
  Home,
  Trash2,
  AlertCircle,
  RefreshCw,
  Search,
  Clock,
  Loader2,
  Crown,
  Activity,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { RecursoGenerator } from "@/components/RecursoGenerator";
import { useConsultationLimit } from "@/hooks/useConsultationLimit";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import UpgradeModal from "@/components/UpgradeModal";

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
  const [numeroSerie, setNumeroSerie] = useState("");
  const [isConsultando, setIsConsultando] = useState(false);
  const [resultadoConsulta, setResultadoConsulta] = useState<any>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { limit, checkLimit, incrementUsage } = useConsultationLimit();
  const { isAdmin } = useAdminCheck();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { navigate("/auth"); return; }
      setUser(session.user);
      await loadProfile(session.user.id);
      await loadConsultas(session.user.id);
    };
    checkUser();
  }, [navigate]);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      console.error("Error loading profile:", error);
    }
  };

  const loadConsultas = async (userId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from("consultas").select("*").eq("user_id", userId).order("created_at", { ascending: false });
      if (error) throw error;
      setConsultas((data || []) as any);
    } catch (error: any) {
      toast({ title: "Erro ao carregar", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => { await supabase.auth.signOut(); navigate("/"); };

  const handleGerarRecurso = async (consulta: Consulta) => {
    let radarData = null;
    if (consulta.radar_id) {
      const { data } = await supabase.from("radares").select("*").eq("id", consulta.radar_id).single();
      radarData = data;
    }
    setSelectedConsulta({ ...consulta, radarData } as any);
    setShowRecursoGenerator(true);
  };

  const handleDeleteConsulta = async (consultaId: string) => {
    if (!window.confirm("Excluir esta consulta do histórico?")) return;
    try {
      const { error } = await supabase.from("consultas").delete().eq("id", consultaId);
      if (error) throw error;
      setConsultas(consultas.filter(c => c.id !== consultaId));
      toast({ title: "Excluída", description: "Consulta removida do histórico." });
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível excluir.", variant: "destructive" });
    }
  };

  // Busca flexível: tenta exato, sem barra, com barra, e parcial
  const buscarRadar = async (serie: string) => {
    const s = serie.trim();
    // 1. Busca exata
    let { data } = await supabase.from("radares").select("*").eq("numero_serie", s);
    if (data && data.length > 0) return data;
    // 2. Sem barras/espaços/hífens
    const limpo = s.replace(/[\/ \-]/g, "");
    ({ data } = await supabase.from("radares").select("*").ilike("numero_serie", `%${limpo}%`));
    if (data && data.length > 0) return data;
    // 3. Com barra no meio (ex: 1506161782 → 150616/1782)
    if (limpo.length >= 6) {
      const comBarra = limpo.slice(0, 6) + "/" + limpo.slice(6);
      ({ data } = await supabase.from("radares").select("*").eq("numero_serie", comBarra));
      if (data && data.length > 0) return data;
    }
    // 4. Busca parcial
    ({ data } = await supabase.from("radares").select("*").ilike("numero_serie", `%${s}%`).limit(5));
    return data || [];
  };

  const handleRetryConsulta = async (consulta: Consulta) => {
    setRetryingConsultas(prev => new Set(prev).add(consulta.id));
    try {
      const radares = await buscarRadar(consulta.numero_serie);
      const resultado = radares.length > 0
        ? { status_aprovado: radares[0].status_aprovado, numero_certificado: radares[0].numero_certificado, data_certificado: radares[0].data_certificado, validade_certificado: radares[0].validade_certificado, mensagem: radares[0].mensagem }
        : { status_aprovado: false, mensagem: "Radar não encontrado" };
      await supabase.from('consultas').update({ resultado }).eq('id', consulta.id);
      setConsultas(prev => prev.map(c => c.id === consulta.id ? { ...c, resultado } : c));
      toast({ title: "Atualizada", description: resultado.mensagem || "Consulta refeita" });
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível refazer.", variant: "destructive" });
    } finally {
      setRetryingConsultas(prev => { const s = new Set(prev); s.delete(consulta.id); return s; });
    }
  };

  const handleConsultar = async () => {
    if (!numeroSerie.trim()) {
      toast({ title: "Campo obrigatório", description: "Digite o número de série do radar", variant: "destructive" });
      return;
    }
    await checkLimit();
    if (limit && !limit.pode_consultar) {
      setShowUpgradeModal(true);
      return;
    }
    setIsConsultando(true);
    setResultadoConsulta(null);
    try {
      const radares = await buscarRadar(numeroSerie);

      let resultado: any;
      if (radares.length > 0) {
        const r = radares[0];
        let validadeVencida = false;
        if (r.validade_certificado) {
          const p = r.validade_certificado.split("/");
          if (p.length === 3) validadeVencida = new Date(Number(p[2]), Number(p[1]) - 1, Number(p[0])) < new Date();
        }
        const estaRegular = r.status_aprovado && !validadeVencida;
        resultado = {
          status_aprovado: estaRegular,
          numero_certificado: r.numero_certificado || "",
          data_certificado: r.data_certificado || "",
          validade_certificado: r.validade_certificado || "",
          mensagem: !r.status_aprovado ? "Instrumento NÃO está aprovado pelo Inmetro."
            : validadeVencida ? `Certificação VENCIDA desde ${r.validade_certificado}.`
            : `Aprovado. Válido até ${r.validade_certificado}.`,
          numero_serie: numeroSerie.trim(),
          uf: r.uf, municipio: r.municipio, validade_vencida: validadeVencida,
        };
      } else {
        resultado = { status_aprovado: false, mensagem: "Radar não encontrado na base de dados.", numero_serie: numeroSerie.trim(), validade_vencida: false };
      }

      // Salvar consulta no histórico
      if (user) {
        await supabase.from("consultas").insert({
          user_id: user.id,
          numero_serie: numeroSerie.trim(),
          resultado: { status_aprovado: resultado.status_aprovado, numero_certificado: resultado.numero_certificado, data_certificado: resultado.data_certificado, validade_certificado: resultado.validade_certificado, mensagem: resultado.mensagem },
        });
        await incrementUsage(false);
        await loadConsultas(user.id);
      }

      setResultadoConsulta(resultado);
      toast({ title: "Consulta realizada", description: resultado.mensagem });
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } finally {
      setIsConsultando(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header simples */}
      <header className="bg-white border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500">
              <CircleCheckBig className="h-5 w-5 text-white" />
            </div>
            <span className="font-display font-bold text-foreground">RadarCheck</span>
          </div>
          <div className="flex items-center gap-1">
            {isAdmin && (
              <Button variant="ghost" size="sm" onClick={() => navigate("/admin")} className="text-amber-600">
                <Crown className="w-4 h-4 mr-1" />
                Admin
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <Home className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Consulta */}
        <Card className="bg-white border-border mb-6">
          <CardContent className="p-4">
            <Label htmlFor="serie" className="text-sm font-medium text-foreground">Consultar radar</Label>
            <div className="flex gap-2 mt-1.5">
              <Input
                id="serie"
                placeholder="Número de série do radar"
                value={numeroSerie}
                onChange={(e) => setNumeroSerie(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleConsultar()}
                className="h-10 bg-secondary/30 border-border"
              />
              <Button
                onClick={handleConsultar}
                disabled={isConsultando || !numeroSerie.trim()}
                className="h-10 px-5 gradient-primary text-white border-0 shrink-0"
              >
                {isConsultando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </Button>
            </div>
            {limit && !limit.pode_consultar && (
              <div className="mt-3 p-3 rounded-lg border border-amber-200 bg-amber-50">
                <p className="text-xs text-amber-800 font-medium mb-2">Você atingiu o limite de consultas do plano gratuito.</p>
                <Button size="sm" className="h-8 text-xs gradient-primary text-white border-0 w-full" onClick={() => setShowUpgradeModal(true)}>
                  Desbloquear mais consultas
                </Button>
              </div>
            )}

            {/* Resultado inline */}
            {resultadoConsulta && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="mt-4 pt-4 border-t border-border"
              >
                <div className="flex items-start gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    resultadoConsulta.status_aprovado ? 'bg-green-50' : resultadoConsulta.validade_vencida ? 'bg-amber-50' : 'bg-red-50'
                  }`}>
                    {resultadoConsulta.status_aprovado ? <CheckCircle2 className="h-5 w-5 text-green-600" /> :
                     resultadoConsulta.validade_vencida ? <AlertTriangle className="h-5 w-5 text-amber-500" /> :
                     <XCircle className="h-5 w-5 text-red-500" />}
                  </div>
                  <div>
                    <p className={`font-display font-semibold text-sm ${
                      resultadoConsulta.status_aprovado ? 'text-green-700' : resultadoConsulta.validade_vencida ? 'text-amber-600' : 'text-red-600'
                    }`}>
                      {resultadoConsulta.status_aprovado ? "Radar Aprovado" : resultadoConsulta.validade_vencida ? "Certificação Vencida" : "Radar Irregular"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{resultadoConsulta.mensagem}</p>
                    {resultadoConsulta.uf && (
                      <p className="text-xs text-muted-foreground mt-0.5">{resultadoConsulta.municipio} - {resultadoConsulta.uf}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Título histórico */}
        <h2 className="font-display text-lg font-bold text-foreground mb-4">Histórico</h2>

        {/* Lista */}
        {isLoading ? (
          <p className="text-center py-16 text-muted-foreground">Carregando...</p>
        ) : consultas.length === 0 ? (
          <div className="text-center py-16">
            <Search className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
            <p className="text-muted-foreground mb-4">Nenhuma consulta ainda</p>
            <p className="text-sm text-muted-foreground">Use o campo acima para consultar</p>
          </div>
        ) : (
          <div className="space-y-3">
            {consultas.map((consulta, i) => {
              const isErro = consulta.resultado?.mensagem?.includes("Não foi possível");
              const isAprovado = consulta.resultado?.status_aprovado && !isErro;

              return (
                <motion.div
                  key={consulta.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Card className="bg-white border-border overflow-hidden">
                    {/* Faixa de cor no topo */}
                    <div className={`h-1 ${isErro ? 'bg-amber-400' : isAprovado ? 'bg-green-500' : 'bg-red-500'}`} />
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        {/* Ícone */}
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                          isErro ? 'bg-amber-50' : isAprovado ? 'bg-green-50' : 'bg-red-50'
                        }`}>
                          {isErro ? <AlertCircle className="h-5 w-5 text-amber-500" /> :
                           isAprovado ? <CheckCircle2 className="h-5 w-5 text-green-600" /> :
                           <XCircle className="h-5 w-5 text-red-500" />}
                        </div>

                        {/* Conteúdo */}
                        <div className="flex-1 min-w-0">
                          <p className="font-display font-semibold text-foreground text-sm">
                            Radar {consulta.numero_serie}
                          </p>
                          <p className={`text-xs font-medium ${
                            isErro ? 'text-amber-600' : isAprovado ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {isErro ? "Erro na consulta" : isAprovado ? "Aprovado" : "Irregular"}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {new Date(consulta.created_at).toLocaleDateString("pt-BR")}
                          </p>
                        </div>

                        {/* Ações */}
                        <div className="flex items-center gap-0.5">
                          {isErro && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-500" onClick={() => handleRetryConsulta(consulta)} disabled={retryingConsultas.has(consulta.id)}>
                              <RefreshCw className={`w-4 h-4 ${retryingConsultas.has(consulta.id) ? 'animate-spin' : ''}`} />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => handleGerarRecurso(consulta)}>
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500" onClick={() => handleDeleteConsulta(consulta.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        currentPlan={limit?.plano || "Gratuito"}
        usedConsultations={limit?.consultas_usadas || 0}
        totalConsultations={limit?.limite_mensal || 1}
      />

      {/* Recurso Generator */}
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
              ? `${(selectedConsulta as any).radarData.marca || ""} ${(selectedConsulta as any).radarData.modelo || ""}`.trim() : "",
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
          onClose={() => { setShowRecursoGenerator(false); setSelectedConsulta(null); }}
        />
      )}
    </div>
  );
};

export default Dashboard;
