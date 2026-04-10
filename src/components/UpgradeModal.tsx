import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Zap, Crown, TrendingUp } from "lucide-react";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan: string;
  usedConsultations: number;
  totalConsultations: number;
}

const UpgradeModal = ({ 
  open, 
  onOpenChange, 
  currentPlan, 
  usedConsultations, 
  totalConsultations 
}: UpgradeModalProps) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    onOpenChange(false);
    navigate("/planos");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-2xl">
            Limite de Consultas Atingido
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Você utilizou {usedConsultations} de {totalConsultations} consultas do plano{" "}
            <span className="font-semibold">{currentPlan}</span> este mês.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 my-6">
          <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
            <div className="flex items-start gap-3">
              <Crown className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">RadarCheck+ (R$ 19,90/mês)</h4>
                <p className="text-sm text-muted-foreground">
                  Consultas ilimitadas + recursos avançados
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-border bg-muted/30">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-foreground shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Pay-per-Use (R$ 4,90)</h4>
                <p className="text-sm text-muted-foreground">
                  Pague apenas por esta consulta adicional
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={handleUpgrade} size="lg" className="w-full">
            Ver Planos e Preços
          </Button>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Voltar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;
