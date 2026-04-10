import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Save } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RecursoDataEditorProps {
  data: {
    nome_autuado: string;
    documento_autuado: string;
    endereco_autuado: string;
    contato_autuado: string;
    marca_modelo: string;
    UF: string;
    cidade: string;
    numero_certificado: string;
    data_certificado: string;
    validade_certificado: string;
  };
  onUpdate: (updatedData: any) => void;
  onClose: () => void;
}

export const RecursoDataEditor = ({ data, onUpdate, onClose }: RecursoDataEditorProps) => {
  const [formData, setFormData] = useState(data);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onUpdate(formData);
    onClose();
  };

  const missingFields = [];
  if (!formData.endereco_autuado) missingFields.push("Endereço");
  if (!formData.marca_modelo) missingFields.push("Marca/Modelo");
  if (!formData.UF) missingFields.push("UF");
  if (!formData.cidade) missingFields.push("Cidade");

  return (
    <div className="space-y-4">
      {missingFields.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Dados incompletos detectados:</strong> {missingFields.join(", ")}
            <br />
            <span className="text-xs">
              A consulta ao Inmetro falhou. Preencha manualmente os campos abaixo para gerar o recurso.
            </span>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nome_autuado">Nome do Autuado *</Label>
          <Input
            id="nome_autuado"
            value={formData.nome_autuado}
            onChange={(e) => handleChange("nome_autuado", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="documento_autuado">CPF/CNPJ *</Label>
          <Input
            id="documento_autuado"
            value={formData.documento_autuado}
            onChange={(e) => handleChange("documento_autuado", e.target.value)}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="endereco_autuado">Endereço Completo *</Label>
          <Input
            id="endereco_autuado"
            value={formData.endereco_autuado}
            onChange={(e) => handleChange("endereco_autuado", e.target.value)}
            placeholder="Ex: Rua X, 123, Bairro Y, CEP 00000-000"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="contato_autuado">Telefone / E-mail *</Label>
          <Input
            id="contato_autuado"
            value={formData.contato_autuado}
            onChange={(e) => handleChange("contato_autuado", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="marca_modelo">Marca/Modelo do Radar *</Label>
          <Input
            id="marca_modelo"
            value={formData.marca_modelo}
            onChange={(e) => handleChange("marca_modelo", e.target.value)}
            placeholder="Ex: GATSO GS11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="UF">UF *</Label>
          <Input
            id="UF"
            value={formData.UF}
            onChange={(e) => handleChange("UF", e.target.value.toUpperCase())}
            maxLength={2}
            placeholder="Ex: SP"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cidade">Cidade *</Label>
          <Input
            id="cidade"
            value={formData.cidade}
            onChange={(e) => handleChange("cidade", e.target.value)}
            placeholder="Ex: São Paulo"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="numero_certificado">Nº Certificado</Label>
          <Input
            id="numero_certificado"
            value={formData.numero_certificado}
            onChange={(e) => handleChange("numero_certificado", e.target.value)}
            placeholder="Deixe vazio se não disponível"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="data_certificado">Data do Certificado</Label>
          <Input
            id="data_certificado"
            type="date"
            value={formData.data_certificado}
            onChange={(e) => handleChange("data_certificado", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="validade_certificado">Validade do Certificado</Label>
          <Input
            id="validade_certificado"
            type="date"
            value={formData.validade_certificado}
            onChange={(e) => handleChange("validade_certificado", e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button onClick={onClose} variant="outline" className="flex-1">
          Cancelar
        </Button>
        <Button onClick={handleSave} className="flex-1">
          <Save className="mr-2 h-4 w-4" />
          Salvar e Continuar
        </Button>
      </div>
    </div>
  );
};
