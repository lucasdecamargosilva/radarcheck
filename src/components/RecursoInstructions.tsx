import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, MapPin, Mail, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RecursoInstructionsProps {
  uf?: string;
  municipio?: string;
  statusAprovado: boolean;
}

export const RecursoInstructions = ({ uf, municipio, statusAprovado }: RecursoInstructionsProps) => {
  const getOrgaoInmetro = () => {
    if (!uf) return "Órgão Delegado do Inmetro na sua região";
    
    const orgaos: Record<string, string> = {
      "SP": "IPEM-SP (Instituto de Pesos e Medidas do Estado de São Paulo)",
      "RJ": "IPEM-RJ (Instituto de Pesos e Medidas do Estado do Rio de Janeiro)",
      "MG": "IPEM-MG (Instituto de Pesos e Medidas do Estado de Minas Gerais)",
      "RS": "IPEM-RS (Instituto de Pesos e Medidas do Estado do Rio Grande do Sul)",
      "PR": "IPEM-PR (Instituto de Pesos e Medidas do Estado do Paraná)",
      "BA": "IPEM-BA (Instituto de Pesos e Medidas do Estado da Bahia)",
      "SC": "IPEM-SC (Instituto de Pesos e Medidas do Estado de Santa Catarina)",
      "GO": "IPEM-GO (Instituto de Pesos e Medidas do Estado de Goiás)",
      "PE": "IPEM-PE (Instituto de Pesos e Medidas do Estado de Pernambuco)",
      "CE": "IPEM-CE (Instituto de Pesos e Medidas do Estado do Ceará)",
    };

    return orgaos[uf.toUpperCase()] || `Órgão Delegado do Inmetro - ${uf}`;
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Como Entrar com Recurso
        </CardTitle>
        <CardDescription>
          Instruções para contestar a multa junto ao Inmetro
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Alert */}
        <Alert className={statusAprovado ? "border-green-500/50 bg-green-500/10" : "border-red-500/50 bg-red-500/10"}>
          <div className="flex items-start gap-3">
            {statusAprovado ? (
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            )}
            <AlertDescription className="text-sm">
              {statusAprovado ? (
                <>
                  <strong className="text-green-600">Radar Aprovado:</strong> O equipamento está regular e certificado. 
                  Você tem fortes argumentos para contestar a multa.
                </>
              ) : (
                <>
                  <strong className="text-red-600">Radar Não Aprovado:</strong> O equipamento não consta como aprovado. 
                  Este é um argumento válido para contestação da multa.
                </>
              )}
            </AlertDescription>
          </div>
        </Alert>

        {/* Órgão Responsável */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Órgão Responsável</h3>
          </div>
          <div className="pl-6">
            <p className="text-sm text-foreground font-medium">{getOrgaoInmetro()}</p>
            {municipio && (
              <p className="text-xs text-muted-foreground mt-1">
                Município: {municipio}
              </p>
            )}
          </div>
        </div>

        {/* Prazo */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Prazo para Recurso</h3>
          </div>
          <div className="pl-6">
            <Badge variant="outline" className="text-xs">
              30 dias corridos a partir da notificação
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              É fundamental respeitar este prazo. Após vencido, não será possível apresentar recurso administrativo.
            </p>
          </div>
        </div>

        {/* Como Enviar */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Como Enviar o Recurso</h3>
          </div>
          <div className="pl-6 space-y-3">
            <div>
              <p className="text-sm font-medium text-foreground mb-1">1. Protocolo Presencial</p>
              <p className="text-xs text-muted-foreground">
                Compareça à sede do órgão delegado do Inmetro na sua região com cópia do auto de infração e o recurso impresso.
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-foreground mb-1">2. Protocolo Online (se disponível)</p>
              <p className="text-xs text-muted-foreground">
                Alguns órgãos aceitam envio por e-mail ou sistema eletrônico. Consulte o site oficial do IPEM do seu estado.
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-foreground mb-1">3. Correios (AR - Aviso de Recebimento)</p>
              <p className="text-xs text-muted-foreground">
                Envie via carta registrada com AR para garantir comprovação de entrega dentro do prazo.
              </p>
            </div>
          </div>
        </div>

        {/* Documentos Necessários */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Documentos Necessários</h3>
          </div>
          <div className="pl-6">
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Recurso Administrativo (baixe usando o botão "Gerar Recurso")</li>
              <li>Cópia do Auto de Infração</li>
              <li>Cópia do comprovante de consulta (esta página)</li>
              <li>Documento de identificação do autuado</li>
              <li>Procuração (se representado por advogado)</li>
            </ul>
          </div>
        </div>

        {/* Dica Importante */}
        <Alert>
          <AlertDescription className="text-xs">
            <strong>💡 Dica:</strong> Guarde cópia de todos os documentos enviados e o comprovante de protocolo. 
            Em caso de análise desfavorável, é possível recorrer à esfera judicial.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
