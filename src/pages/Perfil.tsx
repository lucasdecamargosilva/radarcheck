import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Shield,
  User,
  Save,
  ArrowLeft,
  Mail,
  Phone,
  FileText,
  Home
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface Profile {
  full_name: string | null;
  cpf_cnpj: string | null;
  telefone: string | null;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const Perfil = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [fullName, setFullName] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [telefone, setTelefone] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      await loadProfile(session.user.id);
    };
    checkUser();
  }, [navigate]);

  const loadProfile = async (userId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setFullName(data.full_name || "");
        setCpfCnpj(data.cpf_cnpj || "");
        setTelefone(data.telefone || "");
      }
    } catch (error: any) {
      toast({
        title: "Erro ao carregar perfil",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          full_name: fullName,
          cpf_cnpj: cpfCnpj,
          telefone: telefone,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Perfil atualizado",
        description: "Suas informacoes foram salvas com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao salvar perfil",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formatCpfCnpj = (value: string) => {
    const numbers = value.replace(/\D/g, "");

    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
      return numbers
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
    }
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");

    if (numbers.length <= 10) {
      return numbers
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    } else {
      return numbers
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
    }
  };

  return (
    <div className="min-h-screen gradient-hero bg-grid-pattern relative">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[50%] h-[40%] rounded-full bg-primary/[0.04] blur-[120px]" />
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
                onClick={() => navigate("/dashboard")}
                className="text-muted-foreground hover:text-foreground hover:bg-white/[0.06]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-glow">
                  <User className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-display text-xl font-bold text-foreground tracking-tight">Meu Perfil</h1>
                  <p className="text-xs text-muted-foreground font-body">Gerencie suas informacoes pessoais</p>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground hover:bg-white/[0.06]"
            >
              <Home className="w-4 h-4 mr-2" />
              Inicio
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8 max-w-2xl relative z-10">
        <motion.div variants={stagger} initial="hidden" animate="show">

          {/* Profile header area with subtle gradient */}
          <motion.div variants={fadeUp} className="mb-8 text-center">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl glass border border-primary/20 shadow-glow mb-4">
              <User className="h-10 w-10 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              {fullName || "Seu Perfil"}
            </h2>
            <p className="text-sm text-muted-foreground font-body mt-1">
              {user?.email || ""}
            </p>
          </motion.div>

          {/* Form card */}
          <motion.div variants={fadeUp}>
            <div className="glass-strong rounded-2xl shadow-strong overflow-hidden">
              <div className="p-6 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">Informacoes Pessoais</h3>
                </div>
              </div>
              <div className="p-6">
                {isLoading ? (
                  <div className="text-center py-16 text-muted-foreground font-body">
                    Carregando perfil...
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Email (read-only) */}
                    <motion.div variants={fadeUp}>
                      <Label htmlFor="email" className="flex items-center gap-2 text-muted-foreground mb-2 font-body">
                        <Mail className="h-4 w-4 text-primary/60" />
                        E-mail
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="bg-white/[0.03] border-white/[0.08] text-muted-foreground cursor-not-allowed"
                      />
                      <p className="text-xs text-muted-foreground/60 mt-1.5 font-body">
                        O e-mail nao pode ser alterado
                      </p>
                    </motion.div>

                    {/* Nome Completo */}
                    <motion.div variants={fadeUp}>
                      <Label htmlFor="fullName" className="flex items-center gap-2 text-muted-foreground mb-2 font-body">
                        <User className="h-4 w-4 text-primary/60" />
                        Nome Completo
                      </Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Digite seu nome completo"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="bg-white/[0.04] border-white/[0.08] text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:ring-primary/20 transition-colors"
                      />
                    </motion.div>

                    {/* CPF/CNPJ */}
                    <motion.div variants={fadeUp}>
                      <Label htmlFor="cpfCnpj" className="flex items-center gap-2 text-muted-foreground mb-2 font-body">
                        <FileText className="h-4 w-4 text-primary/60" />
                        CPF/CNPJ
                      </Label>
                      <Input
                        id="cpfCnpj"
                        type="text"
                        placeholder="000.000.000-00 ou 00.000.000/0000-00"
                        value={cpfCnpj}
                        onChange={(e) => setCpfCnpj(formatCpfCnpj(e.target.value))}
                        maxLength={18}
                        className="bg-white/[0.04] border-white/[0.08] text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:ring-primary/20 transition-colors"
                      />
                    </motion.div>

                    {/* Telefone */}
                    <motion.div variants={fadeUp}>
                      <Label htmlFor="telefone" className="flex items-center gap-2 text-muted-foreground mb-2 font-body">
                        <Phone className="h-4 w-4 text-primary/60" />
                        Telefone
                      </Label>
                      <Input
                        id="telefone"
                        type="text"
                        placeholder="(00) 00000-0000"
                        value={telefone}
                        onChange={(e) => setTelefone(formatPhone(e.target.value))}
                        maxLength={15}
                        className="bg-white/[0.04] border-white/[0.08] text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:ring-primary/20 transition-colors"
                      />
                    </motion.div>

                    {/* Save Button */}
                    <motion.div variants={fadeUp} className="pt-4">
                      <Button
                        size="lg"
                        className="w-full gradient-primary text-primary-foreground border-0 shadow-glow hover:opacity-90 transition-all duration-300 font-semibold text-base"
                        onClick={handleSave}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <Save className="mr-2 h-5 w-5 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-5 w-5" />
                            Salvar Alteracoes
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Info Card */}
          <motion.div variants={fadeUp} className="mt-6">
            <div className="glass rounded-2xl p-6 border border-primary/10">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <div className="font-body">
                  <p className="font-semibold text-foreground mb-1 text-sm">
                    Suas informacoes estao seguras
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Todos os seus dados pessoais sao armazenados com criptografia e
                    nunca sao compartilhados com terceiros. Utilizamos apenas para
                    facilitar o preenchimento automatico de recursos administrativos.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
};

export default Perfil;
