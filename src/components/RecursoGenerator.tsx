import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, Download, Eye, Edit, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import { DisclaimerRecurso } from "./DisclaimerRecurso";
import { RecursoDataEditor } from "./RecursoDataEditor";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RecursoData {
  nome_autuado: string;
  documento_autuado: string;
  endereco_autuado: string;
  contato_autuado: string;
  tipo_instrumento: string;
  marca_modelo: string;
  numero_serie: string;
  local_instrumento: string;
  data_autuacao: string;
  numero_auto: string;
  UF: string;
  cidade: string;
  data_consulta: string;
  numero_certificado: string;
  data_certificado: string;
  validade_certificado: string;
  data_recurso: string;
  status_aprovado: boolean;
}

interface RecursoGeneratorProps {
  data: RecursoData;
  onClose: () => void;
}

export const RecursoGenerator = ({ data, onClose }: RecursoGeneratorProps) => {
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);
  const [recursoText, setRecursoText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [pendingAction, setPendingAction] = useState<"visualizar" | "baixar" | null>(null);
  const [showDataEditor, setShowDataEditor] = useState(false);
  const [editableData, setEditableData] = useState(data);

  // Mantém dados editáveis sempre sincronizados com o que vem do Dashboard (perfil + consulta)
  useEffect(() => {
    setEditableData(data);
  }, [data]);

  const hasIncompleteData = () => {
    return !editableData.endereco_autuado || 
           !editableData.marca_modelo || 
           !editableData.UF || 
           !editableData.cidade;
  };

  const handleEditData = () => {
    setShowDataEditor(true);
  };

  const handleDataUpdate = (updatedData: any) => {
    setEditableData(updatedData);
    toast({
      title: "Dados atualizados",
      description: "As informações foram salvas com sucesso.",
    });
  };

  const generateRecursoText = (): string => {
    const currentData = editableData;
    // Seção DOS FATOS adaptada ao status do radar
    const dosFatos = currentData.status_aprovado
      ? `No dia ${currentData.data_autuacao}, o autuado foi notificado pelo Auto de Infração nº ${currentData.numero_auto}, sob alegação de irregularidade no instrumento ${currentData.tipo_instrumento}.
Entretanto, consulta realizada no Portal de Serviços do Inmetro em ${currentData.data_consulta} comprova que o instrumento encontra-se REGULAR e APROVADO, conforme Certificado nº ${currentData.numero_certificado}, emitido em ${currentData.data_certificado} e válido até ${currentData.validade_certificado}.`
      : `No dia ${currentData.data_autuacao}, o autuado foi notificado pelo Auto de Infração nº ${currentData.numero_auto}, sob alegação de irregularidade no instrumento ${currentData.tipo_instrumento}.
Consulta realizada no Portal de Serviços do Inmetro em ${currentData.data_consulta} indica que o instrumento NÃO CONSTA COMO APROVADO no sistema ou está com status irregular.
Contudo, o autuado informa que o instrumento estava em processo de verificação metrológica à época da autuação, e solicita a reavaliação da penalidade considerando os princípios da boa-fé e proporcionalidade administrativa.`;

    const fundamentacaoLegal = currentData.status_aprovado
      ? "Conforme comprovado em consulta oficial, o instrumento encontra-se regular e aprovado, não subsistindo fundamento para a penalidade imposta."
      : "Diante da ausência de aprovação formal do instrumento à época da autuação, e considerando que o processo de verificação estava em andamento, a penalidade deve ser revista em respeito ao princípio da proporcionalidade e da ausência de dolo por parte do autuado.";

    return `À
Órgão Delegado do Inmetro no Estado de ${currentData.UF}
Assunto: Recurso contra Auto de Infração nº ${currentData.numero_auto}

IDENTIFICAÇÃO DO AUTUADO
Razão Social / Nome: ${currentData.nome_autuado}
CNPJ / CPF: ${currentData.documento_autuado}
Endereço: ${currentData.endereco_autuado}
Telefone / E-mail: ${currentData.contato_autuado}

DADOS DO INSTRUMENTO
Tipo de instrumento: ${currentData.tipo_instrumento}
Marca / Modelo: ${currentData.marca_modelo}
Número de série: ${currentData.numero_serie}
Local de instalação: ${currentData.local_instrumento}
Data da autuação: ${currentData.data_autuacao}

DOS FATOS
${dosFatos}

DO DIREITO
Com fundamento na Lei nº 9.933/1999 e no Decreto nº 6.275/2007, o administrado tem direito à ampla defesa e ao devido processo administrativo.
${fundamentacaoLegal}

DO PEDIDO
Diante do exposto, requer:
1. O deferimento deste recurso administrativo;
2. A anulação do Auto de Infração nº ${data.numero_auto};
3. O arquivamento do processo sancionador.

Nestes termos,
Pede deferimento.

${currentData.cidade}, ${currentData.data_recurso}

_________________________________________
${currentData.nome_autuado}
${currentData.documento_autuado}`;
  };

  const handleVisualizarRecurso = () => {
    setPendingAction("visualizar");
    setShowDisclaimer(true);
  };

  const handleBaixarPDFClick = () => {
    if (!showPreview) {
      setPendingAction("baixar");
      setShowDisclaimer(true);
    } else {
      executeBaixarPDF();
    }
  };

  const handleDisclaimerAccept = async () => {
    setShowDisclaimer(false);
    
    try {
      // Register disclaimer acceptance in database
      const { error } = await supabase.functions.invoke('register-disclaimer-acceptance', {
        body: {
          tipo_disclaimer: 'recurso_administrativo',
        },
      });

      if (error) {
        console.error('Error registering disclaimer acceptance:', error);
        toast({
          title: "Erro ao registrar aceite",
          description: "Não foi possível registrar o aceite do disclaimer.",
          variant: "destructive",
        });
        setPendingAction(null);
        return;
      }

      // Proceed with the pending action
      if (pendingAction === "visualizar") {
        executeVisualizarRecurso();
      } else if (pendingAction === "baixar") {
        executeBaixarPDF();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setPendingAction(null);
    }
  };

  const executeVisualizarRecurso = () => {
    const text = generateRecursoText();
    setRecursoText(text);
    setShowPreview(true);
    setIsEditing(false);
  };

  const handleEditarRecurso = () => {
    setIsEditing(true);
  };

  const generatePDF = (textContent: string) => {
    const doc = new jsPDF({
      compress: true
    });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxLineWidth = pageWidth - margin * 2;
    
    doc.setFont("helvetica");
    doc.setFontSize(12);

    const lines = textContent.split('\n');
    let yPosition = margin;

    lines.forEach((line) => {
      if (yPosition > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }

      if (line.trim() === '') {
        yPosition += 5;
        return;
      }

      const splitLines = doc.splitTextToSize(line, maxLineWidth);
      splitLines.forEach((splitLine: string) => {
        if (yPosition > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(splitLine, margin, yPosition);
        yPosition += 7;
      });
    });

    return doc;
  };

  const executeBaixarPDF = () => {
    const textToUse = isEditing ? recursoText : generateRecursoText();
    const doc = generatePDF(textToUse);
    doc.save(`Recurso_Inmetro_${data.numero_auto}.pdf`);
    
    toast({
      title: "✅ PDF gerado com sucesso!",
      description: `Recurso_Inmetro_${data.numero_auto}.pdf foi baixado.`,
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Gerador de Recurso Administrativo
          </CardTitle>
          <CardDescription>
            Gere automaticamente o recurso de contestação para o Auto de Infração
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasIncompleteData() && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Dados incompletos!</strong> A consulta ao Inmetro falhou. 
                Complete as informações manualmente antes de gerar o recurso.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-wrap gap-3">
            <Button onClick={handleEditData} variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              {hasIncompleteData() ? "Completar Dados" : "Editar Dados"}
            </Button>
            <Button onClick={handleVisualizarRecurso} variant="outline" disabled={hasIncompleteData()}>
              <Eye className="mr-2 h-4 w-4" />
              Visualizar Recurso
            </Button>
            <Button onClick={handleBaixarPDFClick} disabled={hasIncompleteData()}>
              <Download className="mr-2 h-4 w-4" />
              Baixar PDF
            </Button>
          </div>
          
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Dados carregados:</strong><br/>
              Auto de Infração: {editableData.numero_auto}<br/>
              Autuado: {editableData.nome_autuado}<br/>
              Instrumento: {editableData.tipo_instrumento} - Série: {editableData.numero_serie}
            </p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Visualização do Recurso Administrativo</DialogTitle>
            <DialogDescription>
              Revise o conteúdo antes de gerar o PDF. Você pode editar o texto se necessário.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {!isEditing ? (
              <>
                <div className="whitespace-pre-wrap rounded-lg border border-border bg-background p-4 text-sm font-mono">
                  {recursoText}
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleEditarRecurso} variant="outline">
                    Editar Recurso
                  </Button>
                  <Button onClick={executeBaixarPDF}>
                    <Download className="mr-2 h-4 w-4" />
                    Baixar PDF
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Textarea
                  value={recursoText}
                  onChange={(e) => setRecursoText(e.target.value)}
                  className="min-h-[400px] font-mono text-sm"
                />
                <div className="flex gap-3">
                  <Button onClick={() => setIsEditing(false)} variant="outline">
                    Voltar
                  </Button>
                  <Button onClick={executeBaixarPDF}>
                    <Download className="mr-2 h-4 w-4" />
                    Gerar PDF com Edições
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <DisclaimerRecurso
        open={showDisclaimer}
        onOpenChange={setShowDisclaimer}
        onAccept={handleDisclaimerAccept}
      />

      <Dialog open={showDataEditor} onOpenChange={setShowDataEditor}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Completar Dados do Recurso</DialogTitle>
            <DialogDescription>
              Preencha os campos faltantes para gerar o recurso administrativo
            </DialogDescription>
          </DialogHeader>
          <RecursoDataEditor
            data={editableData}
            onUpdate={handleDataUpdate}
            onClose={() => setShowDataEditor(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
