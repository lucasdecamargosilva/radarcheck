import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock, CheckCircle2, Zap, Crown } from "lucide-react";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan: string;
  usedConsultations: number;
  totalConsultations: number;
}

const MERCADO_PAGO_LINK = "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=SEU_PREFERENCE_ID_AQUI";

const UpgradeModal = ({ open, onOpenChange }: UpgradeModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-6">
        <div className="text-center mb-4">
          <div className="mx-auto w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mb-3">
            <Lock className="h-5 w-5 text-amber-600" />
          </div>
          <h3 className="font-display font-bold text-foreground text-lg">Limite atingido</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Você usou sua consulta grátis. Escolha um plano para continuar:
          </p>
        </div>

        <div className="space-y-3">
          {/* Recurso Avulso */}
          <div className="border-2 border-primary rounded-xl p-4 relative">
            <div className="absolute -top-2.5 left-4">
              <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">MAIS POPULAR</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-display font-bold text-foreground text-sm">Consulta Avulsa</p>
                  <p className="text-xs text-muted-foreground">1 consulta + recurso em PDF</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-display font-bold text-foreground">R$ 14,90</p>
                <p className="text-[10px] text-muted-foreground">pagamento único</p>
              </div>
            </div>
            <Button
              className="w-full mt-3 gradient-primary text-white border-0 h-9 text-sm"
              onClick={() => window.open(MERCADO_PAGO_LINK, "_blank")}
            >
              Desbloquear consulta
            </Button>
          </div>

          {/* Plano Pro */}
          <div className="border border-border rounded-xl p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50">
                  <Crown className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-display font-bold text-foreground text-sm">RadarCheck Pro</p>
                  <p className="text-xs text-muted-foreground">Consultas ilimitadas</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-display font-bold text-foreground">R$ 19,90</p>
                <p className="text-[10px] text-muted-foreground">/mês</p>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-3 h-9 text-sm" disabled>
              Em breve
            </Button>
          </div>
        </div>

        <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="w-full mt-2 text-muted-foreground text-xs">
          Fechar
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;
