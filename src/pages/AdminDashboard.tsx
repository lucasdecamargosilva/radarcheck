import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  FileText,
  Shield,
  ArrowLeft,
  Crown,
  Loader2,
  AlertTriangle,
  BarChart3,
  PieChart,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { RoleManagement } from "@/components/RoleManagement";

interface AdminStats {
  total_users: number;
  active_users: number;
  total_consultas: number;
  consultas_mes: number;
  assinaturas_ativas: number;
  mrr: number;
  receita_avulsa: number;
  receita_total_mes: number;
}

interface ConsultasPorPlano {
  plano_nome: string;
  total_consultas: number;
  usuarios_unicos: number;
}

interface MonthlyGrowth {
  mes: string;
  novos_usuarios: number;
  novas_consultas: number;
  nova_receita: number;
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useAdminCheck();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [consultasPorPlano, setConsultasPorPlano] = useState<ConsultasPorPlano[]>([]);
  const [monthlyGrowth, setMonthlyGrowth] = useState<MonthlyGrowth[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para acessar esta página",
        variant: "destructive",
      });
      navigate("/dashboard");
    }
  }, [isAdmin, adminLoading, navigate, toast]);

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      // Load stats
      const { data: statsData, error: statsError } = await supabase.rpc("get_admin_stats");
      if (statsError) throw statsError;
      setStats(statsData as unknown as AdminStats);

      // Load consultations by plan
      const { data: planoData, error: planoError } = await supabase.rpc("get_consultas_por_plano");
      if (planoError) throw planoError;
      setConsultasPorPlano(planoData || []);

      // Load monthly growth
      const { data: growthData, error: growthError } = await supabase.rpc("get_monthly_growth");
      if (growthError) throw growthError;
      setMonthlyGrowth(growthData || []);
    } catch (error: any) {
      console.error("Error loading admin data:", error);
      toast({
        title: "Erro ao carregar dados",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (adminLoading || !isAdmin) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Calculate metrics
  const conversionRate = stats ? ((stats.assinaturas_ativas / stats.total_users) * 100).toFixed(1) : "0";
  const avgConsultasPerUser = stats ? (stats.total_consultas / Math.max(stats.active_users, 1)).toFixed(1) : "0";
  const avgMRRPerUser = stats ? (stats.mrr / Math.max(stats.assinaturas_ativas, 1)).toFixed(2) : "0";

  // LTV Calculation (simplified: MRR * 12 months average lifetime)
  const ltv = stats ? (parseFloat(avgMRRPerUser) * 12).toFixed(2) : "0";

  // Churn rate (placeholder - would need historical data)
  const churnRate = "3.5"; // Placeholder

  const kpiCards = [
    {
      title: "MRR",
      value: `R$ ${stats?.mrr.toFixed(2)}`,
      subtitle: "Monthly Recurring Revenue",
      icon: DollarSign,
      gradient: "from-green-500/20 to-green-500/5",
      iconColor: "text-green-600",
      valueColor: "text-green-600",
      delay: 0.1,
    },
    {
      title: "Receita Total (Mês)",
      value: `R$ ${stats?.receita_total_mes.toFixed(2)}`,
      subtitle: "MRR + Pay-per-use",
      icon: TrendingUp,
      gradient: "from-primary/20 to-primary/5",
      iconColor: "text-primary",
      valueColor: "text-foreground",
      delay: 0.2,
    },
    {
      title: "Total de Usuários",
      value: `${stats?.total_users}`,
      subtitle: `${stats?.active_users} ativos (${((stats?.active_users || 0) / Math.max(stats?.total_users || 1, 1) * 100).toFixed(0)}%)`,
      icon: Users,
      gradient: "from-blue-500/20 to-blue-500/5",
      iconColor: "text-blue-400",
      valueColor: "text-foreground",
      delay: 0.3,
    },
    {
      title: "Taxa de Conversão",
      value: `${conversionRate}%`,
      subtitle: `${stats?.assinaturas_ativas} assinantes ativos`,
      icon: Activity,
      gradient: "from-blue-500/20 to-blue-500/5",
      iconColor: "text-blue-400",
      valueColor: "text-blue-400",
      delay: 0.4,
    },
  ];

  return (
    <div className="min-h-screen gradient-hero bg-grid-pattern">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 glass-strong border-b border-white/[0.06]"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="text-muted-foreground hover:text-foreground hover:bg-white/[0.06]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-glow">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="font-display text-xl font-bold text-foreground flex items-center gap-2 tracking-tight">
                    Admin Dashboard
                    <Crown className="h-5 w-5 text-amber-400" />
                  </h1>
                  <p className="font-body text-xs text-muted-foreground">Métricas e análise de negócio</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="font-body text-muted-foreground">Carregando métricas...</p>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 mb-8">
              {kpiCards.map((kpi, i) => (
                <motion.div
                  key={kpi.title}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: kpi.delay, duration: 0.4 }}
                >
                  <Card className={`glass shadow-soft hover:shadow-medium transition-all duration-300 border-white/[0.06] overflow-hidden relative group`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${kpi.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                      <CardTitle className="font-body text-sm font-medium text-muted-foreground">
                        {kpi.title}
                      </CardTitle>
                      <div className="p-2 rounded-lg bg-white/[0.04]">
                        <kpi.icon className={`h-4 w-4 ${kpi.iconColor}`} />
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className={`font-display text-3xl font-bold ${kpi.valueColor} tracking-tight`}>
                        {kpi.value}
                      </div>
                      <p className="font-body text-xs text-muted-foreground mt-1">
                        {kpi.subtitle}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Business Metrics */}
            <div className="grid gap-5 md:grid-cols-3 mb-8">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="glass shadow-soft border-white/[0.06] hover:shadow-medium transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="font-display flex items-center gap-2 text-lg text-foreground">
                      <div className="p-1.5 rounded-lg bg-primary/10">
                        <BarChart3 className="h-5 w-5 text-primary" />
                      </div>
                      LTV (Lifetime Value)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="font-display text-3xl font-bold text-foreground mb-2 tracking-tight">
                      R$ {ltv}
                    </div>
                    <p className="font-body text-sm text-muted-foreground">
                      Valor médio por cliente ao longo do tempo
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="glass shadow-soft border-white/[0.06] hover:shadow-medium transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="font-display flex items-center gap-2 text-lg text-foreground">
                      <div className="p-1.5 rounded-lg bg-amber-500/10">
                        <AlertTriangle className="h-5 w-5 text-amber-400" />
                      </div>
                      Churn Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="font-display text-3xl font-bold text-amber-400 mb-2 tracking-tight">
                      {churnRate}%
                    </div>
                    <p className="font-body text-sm text-muted-foreground">
                      Taxa de cancelamento mensal (estimada)
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Card className="glass shadow-soft border-white/[0.06] hover:shadow-medium transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="font-display flex items-center gap-2 text-lg text-foreground">
                      <div className="p-1.5 rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      Consultas (Mês)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="font-display text-3xl font-bold text-foreground mb-2 tracking-tight">
                      {stats?.consultas_mes}
                    </div>
                    <p className="font-body text-sm text-muted-foreground">
                      Média de {avgConsultasPerUser} por usuário ativo
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Consultations by Plan */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mb-8"
            >
              <Card className="glass-strong shadow-strong border-white/[0.06]">
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2 text-foreground">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <PieChart className="h-5 w-5 text-primary" />
                    </div>
                    Consultas por Plano
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {consultasPorPlano.map((plano, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-colors duration-200"
                      >
                        <div>
                          <p className="font-display font-semibold text-foreground">{plano.plano_nome}</p>
                          <p className="font-body text-sm text-muted-foreground">
                            {plano.usuarios_unicos} usuários únicos
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-display text-2xl font-bold text-primary">{plano.total_consultas}</p>
                          <p className="font-body text-xs text-muted-foreground">consultas</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Monthly Growth */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <Card className="glass-strong shadow-strong border-white/[0.06]">
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2 text-foreground">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    Crescimento Mensal (Últimos 6 Meses)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/[0.08]">
                          <th className="text-left p-3 font-body text-sm font-medium text-muted-foreground">Mês</th>
                          <th className="text-right p-3 font-body text-sm font-medium text-muted-foreground">Novos Usuários</th>
                          <th className="text-right p-3 font-body text-sm font-medium text-muted-foreground">Novas Consultas</th>
                          <th className="text-right p-3 font-body text-sm font-medium text-muted-foreground">Nova Receita</th>
                        </tr>
                      </thead>
                      <tbody>
                        {monthlyGrowth.map((row, index) => (
                          <tr
                            key={index}
                            className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors duration-150"
                          >
                            <td className="p-3 font-body text-sm font-medium text-foreground">
                              {new Date(row.mes + "-01").toLocaleDateString("pt-BR", {
                                month: "short",
                                year: "numeric"
                              })}
                            </td>
                            <td className="p-3 text-right font-body text-sm text-foreground">{row.novos_usuarios}</td>
                            <td className="p-3 text-right font-body text-sm text-foreground">{row.novas_consultas}</td>
                            <td className="p-3 text-right font-display text-sm font-semibold text-green-600">
                              R$ {parseFloat(row.nova_receita.toString()).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Links Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.95 }}
              className="mt-8"
            >
              <Card className="glass-strong shadow-strong border-primary/10">
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2 text-foreground">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <Activity className="h-5 w-5 text-primary" />
                    </div>
                    Links Administrativos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Button
                      onClick={() => navigate('/status')}
                      variant="outline"
                      className="h-auto p-4 justify-start border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-foreground"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Activity className="h-6 w-6 text-primary" />
                        </div>
                        <div className="text-left">
                          <p className="font-display font-semibold">Status da API Inmetro</p>
                          <p className="font-body text-xs text-muted-foreground">Monitoramento em tempo real</p>
                        </div>
                      </div>
                    </Button>

                    <Button
                      onClick={loadAdminData}
                      variant="outline"
                      className="h-auto p-4 justify-start border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-foreground"
                      disabled={loading}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="p-2 rounded-lg bg-green-500/10">
                          <TrendingUp className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="text-left">
                          <p className="font-display font-semibold">Atualizar Dados</p>
                          <p className="font-body text-xs text-muted-foreground">Recarregar métricas</p>
                        </div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Role Management */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="mt-8"
            >
              <RoleManagement />
            </motion.div>

            {/* CAC Note */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="mt-8"
            >
              <Card className="glass border-amber-500/20 bg-amber-500/[0.03]">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-amber-500/10 mt-0.5">
                      <AlertTriangle className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-foreground mb-2">Sobre CAC (Customer Acquisition Cost)</h4>
                      <p className="font-body text-sm text-muted-foreground leading-relaxed">
                        O CAC precisa ser calculado com base nos investimentos em marketing e vendas.
                        Fórmula: <span className="font-mono font-semibold text-primary">CAC = Custos de Marketing / Novos Clientes</span>
                        <br />
                        <span className="text-xs">
                          Adicione seus gastos com Google Ads, Facebook Ads, SEO e outras campanhas para calcular o CAC real.
                        </span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
