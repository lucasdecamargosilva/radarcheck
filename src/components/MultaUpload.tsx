import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileImage, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MultaData {
  numero_auto: string | null;
  numero_serie: string | null;
  data_infracao: string | null;
  local_infracao: string | null;
  nome_condutor: string | null;
  cpf_cnpj_condutor: string | null;
  nome_proprietario: string | null;
  cpf_cnpj_proprietario: string | null;
}

interface MultaUploadProps {
  onDataExtracted: (data: MultaData) => void;
}

export const MultaUpload = ({ onDataExtracted }: MultaUploadProps) => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, envie uma imagem (JPG, PNG, WEBP) ou PDF",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 10MB",
        variant: "destructive",
      });
      return;
    }

    // Show preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Analyze the file
    await analyzeFile(file);
  };

  const analyzeFile = async (file: File) => {
    setIsAnalyzing(true);

    try {
      // Convert file to base64
      const base64 = await fileToBase64(file);
      
      toast({
        title: "Analisando documento...",
        description: "Aguarde enquanto extraímos os dados da multa",
      });

      // Call edge function to analyze
      const { data, error } = await supabase.functions.invoke('analyze-multa', {
        body: { imageBase64: base64.split(',')[1] }
      });

      if (error) {
        console.error("Error analyzing multa:", error);
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.error || "Erro ao analisar documento");
      }

      toast({
        title: "✅ Dados extraídos com sucesso!",
        description: "Os campos foram preenchidos automaticamente",
      });

      // Pass extracted data to parent
      onDataExtracted(data.data);

    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Erro ao analisar documento",
        description: error.message || "Não foi possível extrair os dados. Tente novamente ou preencha manualmente.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleClearPreview = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {!previewUrl ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-primary/30 rounded-lg p-12 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group"
        >
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Upload className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-card-foreground mb-2">
            <span className="hidden sm:inline">Envie a foto da sua multa</span>
            <span className="sm:hidden">Tire foto ou envie arquivo</span>
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Clique para selecionar ou arraste o arquivo aqui
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-xs font-medium">
            <FileImage className="h-4 w-4" />
            <span>JPG, PNG, WEBP ou PDF (máx. 10MB)</span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden border-2 border-primary/20">
            <img
              src={previewUrl}
              alt="Preview da multa"
              className="w-full h-auto max-h-80 object-contain bg-muted"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-3 right-3 shadow-strong"
              onClick={handleClearPreview}
              disabled={isAnalyzing}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {isAnalyzing && (
            <div className="flex items-center justify-center gap-3 p-6 bg-primary/10 rounded-lg border border-primary/20">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <div>
                <p className="text-sm font-semibold text-primary">
                  Extraindo dados da sua multa...
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Isso pode levar alguns segundos
                </p>
              </div>
            </div>
          )}

          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="w-full"
            disabled={isAnalyzing}
          >
            <Upload className="mr-2 h-4 w-4" />
            Enviar outro documento
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};
