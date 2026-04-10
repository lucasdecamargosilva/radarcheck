import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Clock,
  TrendingUp,
  ArrowLeft,
  Zap,
  Lock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdminCheck } from "@/hooks/useAdminCheck";

interface HealthCheck {
  id: string;
  checked_at: string;
  status: 'online' | 'offline' | 'degraded';
  response_time_ms: number | null;
  error_message: string | null;
}

interface UptimeStats {
  period_hours: number;
  total_checks: number;
  online_checks: number;
  offline_checks: number;
  degraded_checks: number;
  uptime_percentage: number;
  avg_response_time_ms: number;
  last_check_at: string;
  last_status: string;
}

export default function Status() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, loading: adminLoading } = useAdminCheck();
  const [recentChecks, setRecentChecks] = useState<HealthCheck[]>([]);
  const [stats24h, setStats24h] = useState<UptimeStats | null>(null);
  const [stats7d, setStats7d] = useState<UptimeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  // Redirecionar se não for admin
  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      toast({
        title: "Acesso negado",
        description: "Apenas administradores podem acessar esta página",
        variant: "destructive",
      });
      navigate('/dashboard');
    }
  }, [isAdmin, adminLoading, navigate, toast]);

  const fetchData = async () => {
    try {
      // Buscar últimos 50 checks
      const { data: checks, error: checksError } = await supabase
        .from('api_health_checks')
        .select('*')
        .order('checked_at', { ascending: false })
        .limit(50);

      if (checksError) throw checksError;
      setRecentChecks(checks as HealthCheck[] || []);

      // Buscar stats 24h
      const { data: stats24, error: stats24Error } = await supabase
        .rpc('get_api_uptime_stats', { period_hours: 24 });

      if (stats24Error) throw stats24Error;
      setStats24h(stats24 as unknown as UptimeStats);

      // Buscar stats 7 dias
      const { data: stats7, error: stats7Error } = await supabase
        .rpc('get_api_uptime_stats', { period_hours: 168 }); // 7 * 24

      if (stats7Error) throw stats7Error;
      setStats7d(stats7 as unknown as UptimeStats);

    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar o status da API",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const runManualCheck = async () => {
    setChecking(true);
    try {
      const { data, error } = await supabase.functions.invoke('health-check-inmetro');

      if (error) throw error;

      toast({
        title: "Check executado",
        description: `Status: ${data.status}`,
      });

      // Recarregar dados
      await fetchData();
    } catch (error) {
      console.error('Erro ao executar check:', error);
      toast({
        title: "Erro ao executar check",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Removido auto-refresh para economizar recursos
    // Os dados agora são atualizados apenas quando o admin clicar em "Verificar Agora"
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-amber-400" />;
      case 'offline':
        return <XCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Activity className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-500/20 text-green-600 border border-green-500/30 hover:bg-green-500/20">Online</Badge>;
      case 'degraded':
        return <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20">Degradado</Badge>;
      case 'offline':
        return <Badge className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/20">Offline</Badge>;
      default:
        return <Badge className="bg-white/[0.06] text-muted-foreground border border-white/[0.08]">Desconhecido</Badge>;
    }
  };

  const getUptimeColor = (percentage: number) => {
    if (percentage >= 99) return 'text-green-600';
    if (percentage >= 95) return 'text-amber-400';
    return 'text-red-400';
  };

  const getUptimeBarColor = (percentage: number) => {
    if (percentage >= 99) return 'bg-green-500';
    if (percentage >= 95) return 'bg-amber-400';
    return 'bg-red-400';
  };

  if (adminLoading || loading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="font-body text-muted-foreground">Carregando status...</p>
        </div>
      </div>
    );
  }

  // Se não for admin, não renderizar nada (será redirecionado)
  if (!isAdmin) {
    return null;
  }

  const lastCheck = recentChecks[0];
  const isOnline = lastCheck?.status === 'online';

  return (
    <div className="min-h-screen gradient-hero bg-grid-pattern">
      <div className="max-w-6xl mx-auto py-10 px-4">
        {/* Header */}
        <div className="mb-10">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-6 text-muted-foreground hover:text-foreground hover:bg-white/[0.06]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Dashboard
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Activity className="h-4 w-4 text-primary" />
              <span className="font-body text-sm text-primary font-medium">System Status</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3 tracking-tight">
              Status da API Inmetro
            </h1>
            <p className="font-body text-muted-foreground">
              Monitoramento sob demanda da disponibilidade do PSIE Inmetro
            </p>
            <p className="font-body text-xs text-muted-foreground mt-2">
              Clique em "Verificar Agora" para atualizar o status
            </p>
          </motion.div>
        </div>

        {/* Status Atual - Large indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10"
        >
          <Card className="glass-strong shadow-strong border-white/[0.06] overflow-hidden relative">
            {/* Subtle ambient glow behind the card when online */}
            {isOnline && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-green-500/[0.06] blur-[80px]" />
              </div>
            )}

            <CardHeader className="text-center pb-6 relative z-10">
              {/* Large pulsing status indicator */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center ${
                      isOnline
                        ? 'bg-green-500/20 border-2 border-green-500/40'
                        : lastCheck?.status === 'degraded'
                        ? 'bg-amber-500/20 border-2 border-amber-500/40'
                        : 'bg-red-500/20 border-2 border-red-500/40'
                    } ${isOnline ? 'pulse-glow' : ''}`}
                  >
                    {lastCheck && (
                      lastCheck.status === 'online' ? (
                        <CheckCircle2 className="h-10 w-10 text-green-600" />
                      ) : lastCheck.status === 'degraded' ? (
                        <AlertTriangle className="h-10 w-10 text-amber-400" />
                      ) : (
                        <XCircle className="h-10 w-10 text-red-400" />
                      )
                    )}
                  </div>
                  {/* Animated ring for online */}
                  {isOnline && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-green-400/30"
                      animate={{
                        scale: [1, 1.4, 1.4],
                        opacity: [0.6, 0, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />
                  )}
                </div>
              </div>

              <CardTitle className="font-display text-2xl text-foreground flex items-center justify-center gap-3">
                Status Atual: {lastCheck && getStatusBadge(lastCheck.status)}
              </CardTitle>
              <CardDescription className="font-body text-muted-foreground mt-2">
                {lastCheck && (
                  <>
                    Última verificação: {new Date(lastCheck.checked_at).toLocaleString('pt-BR')}
                    {lastCheck.response_time_ms && (
                      <span className="block mt-1 text-primary font-medium">
                        Tempo de resposta: {lastCheck.response_time_ms}ms
                      </span>
                    )}
                  </>
                )}
              </CardDescription>
            </CardHeader>

            <CardContent className="text-center pb-8 relative z-10">
              <Button
                onClick={runManualCheck}
                disabled={checking}
                className="gap-2 gradient-primary text-white border-0 shadow-glow hover:shadow-[0_0_40px_rgba(0,212,255,0.25)] transition-all duration-300 h-11 px-6"
              >
                {checking ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span className="font-body">Verificando...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    <span className="font-body">Verificar Agora</span>
                  </>
                )}
              </Button>
              <p className="font-body text-xs text-muted-foreground mt-4">
                Verificações manuais economizam recursos e custos
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Stats 24h */}
          {stats24h && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass shadow-medium border-white/[0.06] h-full">
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2 text-foreground">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    Últimas 24 Horas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <div className="flex justify-between items-baseline mb-3">
                      <span className="font-body text-sm text-muted-foreground">Uptime</span>
                      <span className={`font-display text-3xl font-bold ${getUptimeColor(stats24h.uptime_percentage)} tracking-tight`}>
                        {stats24h.uptime_percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-white/[0.06] rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        className={`${getUptimeBarColor(stats24h.uptime_percentage)} h-2.5 rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${stats24h.uptime_percentage}%` }}
                        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/[0.06]">
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                      <p className="font-body text-xs text-muted-foreground mb-1">Online</p>
                      <p className="font-display text-2xl font-bold text-green-600">
                        {stats24h.online_checks}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                      <p className="font-body text-xs text-muted-foreground mb-1">Offline</p>
                      <p className="font-display text-2xl font-bold text-red-400">
                        {stats24h.offline_checks}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                      <p className="font-body text-xs text-muted-foreground mb-1">Degradado</p>
                      <p className="font-display text-2xl font-bold text-amber-400">
                        {stats24h.degraded_checks}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                      <p className="font-body text-xs text-muted-foreground mb-1">Tempo Médio</p>
                      <p className="font-display text-2xl font-bold text-foreground">
                        {stats24h.avg_response_time_ms}<span className="text-sm text-muted-foreground ml-0.5">ms</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Stats 7 dias */}
          {stats7d && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass shadow-medium border-white/[0.06] h-full">
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2 text-foreground">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    Últimos 7 Dias
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <div className="flex justify-between items-baseline mb-3">
                      <span className="font-body text-sm text-muted-foreground">Uptime</span>
                      <span className={`font-display text-3xl font-bold ${getUptimeColor(stats7d.uptime_percentage)} tracking-tight`}>
                        {stats7d.uptime_percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-white/[0.06] rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        className={`${getUptimeBarColor(stats7d.uptime_percentage)} h-2.5 rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${stats7d.uptime_percentage}%` }}
                        transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/[0.06]">
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                      <p className="font-body text-xs text-muted-foreground mb-1">Online</p>
                      <p className="font-display text-2xl font-bold text-green-600">
                        {stats7d.online_checks}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                      <p className="font-body text-xs text-muted-foreground mb-1">Offline</p>
                      <p className="font-display text-2xl font-bold text-red-400">
                        {stats7d.offline_checks}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                      <p className="font-body text-xs text-muted-foreground mb-1">Degradado</p>
                      <p className="font-display text-2xl font-bold text-amber-400">
                        {stats7d.degraded_checks}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                      <p className="font-body text-xs text-muted-foreground mb-1">Tempo Médio</p>
                      <p className="font-display text-2xl font-bold text-foreground">
                        {stats7d.avg_response_time_ms}<span className="text-sm text-muted-foreground ml-0.5">ms</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Histórico Recente */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-strong shadow-strong border-white/[0.06]">
            <CardHeader>
              <CardTitle className="font-display text-foreground">Histórico de Verificações</CardTitle>
              <CardDescription className="font-body text-muted-foreground">
                Últimas 50 verificações do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
                {recentChecks.map((check) => (
                  <div
                    key={check.id}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {getStatusIcon(check.status)}
                      <div className="flex-1">
                        <p className="font-body text-sm font-medium text-foreground">
                          {new Date(check.checked_at).toLocaleString('pt-BR')}
                        </p>
                        {check.error_message && (
                          <p className="font-body text-xs text-red-400 mt-1">
                            {check.error_message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {check.response_time_ms && (
                        <span className="font-body text-sm text-muted-foreground tabular-nums">
                          {check.response_time_ms}ms
                        </span>
                      )}
                      {getStatusBadge(check.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
