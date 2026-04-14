import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CircleCheckBig, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const passwordSchema = z.object({
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  confirmPassword: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export default function ResetarSenha() {
  const [loading, setLoading] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Wait for Supabase to process the recovery token from URL hash
    const checkSession = async () => {
      // Wait a bit for Supabase to process the URL hash
      await new Promise(resolve => setTimeout(resolve, 500));

      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        toast({
          title: "Link inválido ou expirado",
          description: "Solicite um novo link de recuperação. Verifique se clicou no link mais recente do email.",
          variant: "destructive",
        });
        navigate("/recuperar-senha");
      } else {
        setSessionChecked(true);
      }
    };

    checkSession();
  }, [navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      passwordSchema.parse(formData);

      const { error } = await supabase.auth.updateUser({
        password: formData.password,
      });

      if (error) {
        toast({
          title: "Erro ao redefinir senha",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Senha redefinida!",
        description: "Sua senha foi atualizada com sucesso",
      });

      // Sign out and redirect to login
      await supabase.auth.signOut();
      navigate("/auth");
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

  if (!sessionChecked) {
    return (
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        <div className="absolute inset-0 radar-rings opacity-15" />
        <div className="text-center relative z-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-green-500 shadow-glow mb-4">
            <CircleCheckBig className="w-6 h-6 text-white" />
          </div>
          <p className="font-body text-white/40">Verificando link de recuperacao...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
      <div className="absolute inset-0 radar-rings opacity-15" />
      <div className="absolute inset-0 gradient-hero opacity-30" />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10"
      >
        {/* Branding */}
        <motion.div variants={fadeUp} className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-green-500 shadow-glow mb-5"
          >
            <CircleCheckBig className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">Nova Senha</h1>
          <p className="font-body text-sm text-white/40">
            Digite sua nova senha
          </p>
        </motion.div>

        {/* Glass card */}
        <motion.div
          variants={fadeUp}
          className="glass-strong rounded-2xl shadow-medium p-8 border border-white/[0.06]"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2 text-white/70 font-body text-sm">
                <Lock className="w-4 h-4 text-primary/70" />
                Nova senha
              </Label>
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-white/70 font-body text-sm">
                <Lock className="w-4 h-4 text-primary/70" />
                Confirmar senha
              </Label>
              <PasswordInput
                id="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
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
                  Redefinir senha
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
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
  );
}
