import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CircleCheckBig, Mail, Lock, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session && event === "SIGNED_IN") {
          navigate("/dashboard");
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

        if (!acceptedTerms) {
          toast({
            title: "Termos obrigatórios",
            description: "Você precisa aceitar os Termos de Uso e a Política de Privacidade",
            variant: "destructive",
          });
          return;
        }

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
    <div className="min-h-screen bg-background flex">
      {/* Left panel - desktop only */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center gradient-hero">
        <div className="absolute inset-0 bg-grid-pattern" />
        <div className="absolute inset-0 radar-rings opacity-30" />

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
            className="inline-flex items-center justify-center w-20 h-20 rounded-lg bg-green-500 shadow-glow mb-8"
          >
            <CircleCheckBig className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="font-display text-5xl font-bold text-white mb-4 tracking-tight">
            Radar<span className="text-yellow-300">Check</span>
          </h1>
          <p className="font-body text-lg text-white/70 leading-relaxed">
            Verifique se o radar que te multou está com a certificação em dia no Inmetro.
          </p>

          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full border border-white/10"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            className="absolute -top-24 -right-24 w-48 h-48 rounded-full border border-white/5"
          />
        </motion.div>
      </div>

      {/* Right panel - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 relative bg-background">

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md relative z-10"
        >
          {/* Mobile branding */}
          <motion.div variants={fadeUp} className="text-center mb-8 lg:hidden">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-green-500 mb-4">
              <CircleCheckBig className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Radar<span className="text-primary">Check</span>
            </h1>
          </motion.div>

          {/* Heading */}
          <motion.div variants={fadeUp} className="mb-6">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              {isLogin ? "Bem-vindo de volta" : "Crie sua conta"}
            </h2>
            <p className="font-body text-sm text-muted-foreground mt-1">
              {isLogin
                ? "Entre com suas credenciais para continuar"
                : "Cadastre-se e receba uma consulta grátis"}
            </p>
          </motion.div>

          {/* Form card */}
          <motion.div
            variants={fadeUp}
            className="bg-card rounded-2xl shadow-strong p-8 border border-border"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <Label htmlFor="name" className="flex items-center gap-2 text-muted-foreground font-body text-sm">
                    <User className="w-4 h-4 text-primary" />
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
                    className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/20"
                  />
                </motion.div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-muted-foreground font-body text-sm">
                  <Mail className="w-4 h-4 text-primary" />
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
                  className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="flex items-center gap-2 text-muted-foreground font-body text-sm">
                    <Lock className="w-4 h-4 text-primary" />
                    Senha
                  </Label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => navigate("/recuperar-senha")}
                      className="text-xs text-primary hover:underline transition-colors font-body"
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
                  className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/20"
                />
              </div>

              {!isLogin && (
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                    className="mt-0.5 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <label htmlFor="terms" className="text-xs text-muted-foreground font-body leading-relaxed cursor-pointer">
                    Li e aceito os{" "}
                    <Link to="/termos-de-uso" target="_blank" className="text-primary hover:underline">
                      Termos de Uso
                    </Link>{" "}
                    e a{" "}
                    <Link to="/privacidade" target="_blank" className="text-primary hover:underline">
                      Política de Privacidade
                    </Link>
                  </label>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 gradient-primary text-primary-foreground font-body font-medium shadow-glow hover:opacity-90 transition-opacity"
                disabled={loading || (!isLogin && !acceptedTerms)}
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
                className="text-sm text-muted-foreground hover:text-foreground transition-colors font-body"
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
              className="text-sm text-muted-foreground hover:text-primary transition-colors font-body"
            >
              Voltar para a pagina inicial
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
