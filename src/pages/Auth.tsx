import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Mail, Lock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
});

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session && event === "SIGNED_IN") {
          navigate("/");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Validate login
        loginSchema.parse(formData);

        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast({
              title: "Erro ao fazer login",
              description: "Email ou senha incorretos",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Erro ao fazer login",
              description: error.message,
              variant: "destructive",
            });
          }
          return;
        }

        toast({
          title: "Login realizado!",
          description: "Você foi autenticado com sucesso",
        });
      } else {
        // Validate signup
        signupSchema.parse(formData);

        const redirectUrl = `${window.location.origin}/`;

        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              name: formData.name,
            },
          },
        });

        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "Erro ao criar conta",
              description: "Este email já está cadastrado",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Erro ao criar conta",
              description: error.message,
              variant: "destructive",
            });
          }
          return;
        }

        toast({
          title: "Conta criada!",
          description: "Você já pode fazer login",
        });
        setIsLogin(true);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Erro de validação",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex">
      {/* Left panel - desktop only */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center">
        {/* Background layers */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        <div className="absolute inset-0 radar-rings opacity-20" />
        <div className="absolute inset-0 gradient-hero opacity-40" />

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 px-12 max-w-lg text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full glass shadow-glow mb-8"
          >
            <Shield className="w-10 h-10 text-primary" />
          </motion.div>

          <h1 className="font-display text-5xl font-bold text-white mb-4 tracking-tight">
            Radar<span className="text-primary">Check</span>
          </h1>
          <p className="font-body text-lg text-white/50 leading-relaxed">
            Monitore veiculos, proteja seu patrimonio e tenha controle total com inteligencia em tempo real.
          </p>

          {/* Decorative floating rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full border border-primary/10"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            className="absolute -top-24 -right-24 w-48 h-48 rounded-full border border-green-500/10"
          />
        </motion.div>
      </div>

      {/* Right panel - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] lg:hidden" />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md relative z-10"
        >
          {/* Mobile branding */}
          <motion.div variants={fadeUp} className="text-center mb-8 lg:hidden">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full glass shadow-glow mb-4">
              <Shield className="w-7 h-7 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold text-white">
              Radar<span className="text-primary">Check</span>
            </h1>
          </motion.div>

          {/* Heading */}
          <motion.div variants={fadeUp} className="mb-6">
            <h2 className="font-display text-2xl font-semibold text-white">
              {isLogin ? "Bem-vindo de volta" : "Crie sua conta"}
            </h2>
            <p className="font-body text-sm text-white/40 mt-1">
              {isLogin
                ? "Entre com suas credenciais para continuar"
                : "Preencha os dados para comecar"}
            </p>
          </motion.div>

          {/* Glass card */}
          <motion.div
            variants={fadeUp}
            className="glass-strong rounded-2xl shadow-medium p-8 border border-white/[0.06]"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <Label htmlFor="name" className="flex items-center gap-2 text-white/70 font-body text-sm">
                    <User className="w-4 h-4 text-primary/70" />
                    Nome completo
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required={!isLogin}
                    className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 focus:border-primary/50 focus:ring-primary/20"
                  />
                </motion.div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-white/70 font-body text-sm">
                  <Mail className="w-4 h-4 text-primary/70" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 focus:border-primary/50 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="flex items-center gap-2 text-white/70 font-body text-sm">
                    <Lock className="w-4 h-4 text-primary/70" />
                    Senha
                  </Label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => navigate("/recuperar-senha")}
                      className="text-xs text-primary/70 hover:text-primary transition-colors font-body"
                    >
                      Esqueceu sua senha?
                    </button>
                  )}
                </div>
                <PasswordInput
                  id="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 focus:border-primary/50 focus:ring-primary/20"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 gradient-primary text-white font-body font-medium shadow-glow hover:opacity-90 transition-opacity"
                disabled={loading}
              >
                {loading ? (
                  "Aguarde..."
                ) : (
                  <>
                    {isLogin ? "Entrar" : "Criar conta"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-white/40 hover:text-white/70 transition-colors font-body"
              >
                {isLogin ? (
                  <>
                    Nao tem uma conta?{" "}
                    <span className="font-medium text-primary">Cadastre-se</span>
                  </>
                ) : (
                  <>
                    Ja tem uma conta?{" "}
                    <span className="font-medium text-primary">Faca login</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-6 text-center">
            <button
              onClick={() => navigate("/")}
              className="text-sm text-white/30 hover:text-primary/70 transition-colors font-body"
            >
              Voltar para a pagina inicial
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
