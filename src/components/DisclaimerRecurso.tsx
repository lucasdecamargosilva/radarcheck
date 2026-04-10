import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

interface DisclaimerRecursoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
}

export const DisclaimerRecurso = ({ open, onOpenChange, onAccept }: DisclaimerRecursoProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-xl">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Aviso Importante sobre o Recurso Gerado
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left space-y-4 text-sm text-foreground/80">
            <p>
              Antes de prosseguir com a geração do recurso administrativo, leia com atenção as seguintes informações:
            </p>
            
            <div className="space-y-3">
              <div>
                <strong className="text-foreground">1. Natureza da Sugestão</strong>
                <p className="mt-1">
                  O texto de recurso gerado pela plataforma <strong>RadarCheck</strong> é apenas uma <strong>sugestão analítica</strong>, 
                  baseada em dados públicos disponibilizados pelo Inmetro (Instituto Nacional de Metrologia, Qualidade e Tecnologia) 
                  e outras fontes abertas. <strong>Não se trata de um parecer técnico, jurídico ou metrológico garantido</strong>.
                </p>
              </div>

              <div>
                <strong className="text-foreground">2. Responsabilidade do Usuário</strong>
                <p className="mt-1">
                  A decisão de interpor um recurso administrativo, bem como todas as consequências decorrentes dessa decisão, 
                  são de <strong>exclusiva responsabilidade do usuário</strong>. Recomendamos fortemente que você consulte um 
                  advogado, engenheiro metrológico ou outro profissional especializado para uma análise detalhada do seu caso 
                  antes de protocolar qualquer recurso.
                </p>
              </div>

              <div>
                <strong className="text-foreground">3. Limitações dos Dados</strong>
                <p className="mt-1">
                  Os dados utilizados pela ferramenta podem estar <strong>desatualizados, incompletos ou conter inconsistências</strong>, 
                  pois dependem da atualização das bases públicas do Inmetro. O RadarCheck <strong>não garante a precisão ou 
                  integridade absoluta</strong> dessas informações.
                </p>
              </div>

              <div>
                <strong className="text-foreground">4. Isenção de Responsabilidade</strong>
                <p className="mt-1">
                  O RadarCheck <strong>não se responsabiliza por quaisquer consequências, custos, erros, prejuízos ou decisões</strong> 
                  que você venha a tomar com base nas sugestões geradas pela plataforma. A ferramenta tem caráter informativo e de suporte, 
                  não substituindo análise profissional especializada.
                </p>
              </div>

              <div>
                <strong className="text-foreground">5. Aceitação das Limitações</strong>
                <p className="mt-1">
                  Ao usar esta ferramenta e gerar o recurso, você reconhece e aceita essas limitações, entendendo que o RadarCheck 
                  é um <strong>apoio auxiliar</strong>, e não uma garantia de sucesso ou de validade técnica/jurídica do recurso gerado.
                </p>
              </div>

              <div>
                <strong className="text-foreground">6. Privacidade e Proteção de Dados</strong>
                <p className="mt-1">
                  Os dados pessoais fornecidos por você são tratados conforme nossa Política de Privacidade, 
                  em conformidade com a Lei Geral de Proteção de Dados (LGPD). Respeitamos sua privacidade e adotamos 
                  medidas técnicas e organizacionais para proteger suas informações.
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground pt-2 border-t">
              Para mais informações, consulte nossos Termos de Uso e Política de Privacidade disponíveis no site.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onAccept}>
            Li e Aceito os Termos
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};