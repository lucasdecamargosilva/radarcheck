import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const emailSchema = z.object({
  email: z.string().email("Email inválido"),
});

export default function RecuperarSenha() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      emailSchema.parse({ email });

      const redirectUrl = `${window.location.origin}/resetar-senha`;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        toast({
          title: "Erro ao enviar email",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setEmailSent(true);
      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada (e spam) para redefinir sua senha. O link expira em 1 hora.",
      });
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
            className="inline-flex items-center justify-center w-16 h-16 rounded-full glass shadow-glow mb-5"
          >
            <Shield className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">Recuperar Senha</h1>
          <p className="font-body text-sm text-white/40">
            {emailSent
              ? "Email enviado com sucesso"
              : "Digite seu email para recuperar o acesso"}
          </p>
        </motion.div>

        {/* Glass card */}
        <motion.div
          variants={fadeUp}
          className="glass-strong rounded-2xl shadow-medium p-8 border border-white/[0.06]"
        >
          {!emailSent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-white/70 font-body text-sm">
                  <Mail className="w-4 h-4 text-primary/70" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  "Enviando..."
                ) : (
                  <>
                    Enviar link de recuperacao
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-5">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 mb-2">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <p className="font-body text-white/50 text-sm leading-relaxed">
                Enviamos um link de recuperacao para <strong className="text-white/80">{email}</strong>.
                Verifique sua caixa de entrada e siga as instrucoes.
              </p>
              <Button
                onClick={() => navigate("/auth")}
                variant="outline"
                className="w-full h-11 border-white/[0.08] bg-white/[0.04] text-white/70 hover:bg-white/[0.08] hover:text-white font-body"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para login
              </Button>
            </div>
          )}

          {!emailSent && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => navigate("/auth")}
                className="text-sm text-white/40 hover:text-white/70 transition-colors font-body"
              >
                Lembrou sua senha?{" "}
                <span className="font-medium text-primary">Faca login</span>
              </button>
            </div>
          )}
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
