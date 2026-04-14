import { Link } from "react-router-dom";
import { ArrowLeft, CircleCheckBig, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function TermosDeUso() {
  const sections = [
    {
      title: "1. Aceitacao dos Termos",
      content: (
        <p>
          Ao acessar e usar o Radar Check, voce concorda com estes Termos de Uso.
          Se voce nao concorda com qualquer parte destes termos, nao deve usar nossos servicos.
        </p>
      ),
    },
    {
      title: "2. Descricao do Servico",
      content: (
        <p>
          O Radar Check e uma plataforma que permite verificar a situacao de aprovacao de
          equipamentos medidores de velocidade (radares) junto ao Instituto Nacional de
          Metrologia, Qualidade e Tecnologia (Inmetro).
        </p>
      ),
    },
    {
      title: "3. Uso Adequado",
      content: (
        <>
          <p>Voce concorda em usar o servico apenas para fins legitimos e de acordo com:</p>
          <ul className="list-none mt-4 space-y-2">
            <li className="flex items-start gap-3">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
              <span>Todas as leis e regulamentos aplicaveis</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
              <span>As orientacoes fornecidas na plataforma</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
              <span>Estes Termos de Uso e nossa Politica de Privacidade</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "4. Limitacoes de Responsabilidade",
      content: (
        <>
          <p className="mb-4">
            As informacoes fornecidas pelo Radar Check sao baseadas em dados publicos do Inmetro.
            Nao garantimos a precisao absoluta das informacoes e recomendamos verificacao adicional
            quando necessario. O uso das informacoes e por sua conta e risco.
          </p>
          <p className="mb-3 font-semibold text-foreground">Especificamente sobre os Recursos Gerados:</p>
          <ul className="list-none space-y-2">
            <li className="flex items-start gap-3">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-accent shrink-0" />
              <span>As sugestoes de recursos administrativos geradas pela plataforma sao apenas orientacoes analiticas baseadas em dados publicos, nao constituindo parecer juridico, tecnico ou metrologico</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-accent shrink-0" />
              <span>A decisao de interpor recurso e de exclusiva responsabilidade do usuario</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-accent shrink-0" />
              <span>Recomendamos consultar advogado ou profissional especializado antes de protocolar qualquer recurso</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-accent shrink-0" />
              <span>O Radar Check nao se responsabiliza por consequencias, custos ou resultados decorrentes do uso das sugestoes geradas</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-accent shrink-0" />
              <span>Os dados podem estar desatualizados ou incompletos, dependendo das atualizacoes das bases publicas do Inmetro</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "5. Propriedade Intelectual",
      content: (
        <p>
          Todo o conteudo do Radar Check, incluindo textos, graficos, logos e software,
          e propriedade da plataforma e protegido por leis de propriedade intelectual.
        </p>
      ),
    },
    {
      title: "6. Modificacoes",
      content: (
        <p>
          Reservamos o direito de modificar estes termos a qualquer momento.
          Continuando a usar o servico apos as alteracoes, voce concorda com os termos revisados.
        </p>
      ),
    },
    {
      title: "7. Contato",
      content: (
        <p>
          Para questoes sobre estes termos, entre em contato atraves da{" "}
          <Link to="/contato" className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors duration-200">
            pagina de contato
          </Link>.
        </p>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background font-body">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-strong shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500 group-hover:shadow-glow transition-all duration-300">
                <CircleCheckBig className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-display text-foreground">RadarCheck</h1>
                <p className="text-xs text-muted-foreground">Verificacao oficial Inmetro</p>
              </div>
            </Link>
            <Button variant="outline" size="sm" asChild className="border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300">
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative gradient-hero py-20 overflow-hidden">
        <div className="absolute inset-0 radar-rings opacity-40" />
        <div className="absolute inset-0 bg-grid-pattern" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-4 text-foreground">
              Termos de Uso
            </h1>
            <p className="text-muted-foreground">
              Ultima atualizacao: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 md:py-20 max-w-4xl">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="glass shadow-medium rounded-2xl p-8 md:p-12">
            <div className="space-y-10">
              {sections.map((section, i) => (
                <motion.section
                  key={i}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                >
                  <h2 className="text-xl md:text-2xl font-bold font-display mb-4 text-foreground">
                    {section.title}
                  </h2>
                  <div className="text-foreground/75 leading-relaxed">
                    {section.content}
                  </div>
                  {i < sections.length - 1 && (
                    <div className="mt-10 border-t border-border/30" />
                  )}
                </motion.section>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 py-10 glass">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-muted-foreground">
              &copy; 2024 RadarCheck. Todos os direitos reservados.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/sobre" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">Sobre</Link>
              <Link to="/contato" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">Contato</Link>
              <Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">FAQ</Link>
              <Link to="/privacidade" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">Privacidade</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
