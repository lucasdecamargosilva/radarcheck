import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { CircleCheckBig, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background font-body flex flex-col">
      {/* Header */}
      <header className="glass-strong shadow-soft relative z-10">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="flex items-center gap-3 group w-fit">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500 group-hover:shadow-glow transition-all duration-300">
              <CircleCheckBig className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display text-foreground">RadarCheck</h1>
              <p className="text-xs text-muted-foreground">Verificacao oficial Inmetro</p>
            </div>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 radar-rings" />
        <div className="absolute inset-0 bg-grid-pattern" />

        {/* Animated radar rings centered */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[1, 2, 3, 4].map((ring) => (
            <motion.div
              key={ring}
              className="absolute rounded-full border border-primary/10"
              style={{
                width: `${ring * 180}px`,
                height: `${ring * 180}px`,
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: ring * 0.15, ease: "easeOut" }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h1 className="text-[8rem] md:text-[12rem] font-bold font-display leading-none bg-gradient-to-b from-primary/80 to-primary/10 bg-clip-text text-transparent select-none">
              404
            </h1>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold font-display text-foreground mb-3">
              Pagina nao encontrada
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              O radar nao detectou nada neste endereco. A pagina que voce procura pode ter sido movida ou removida.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Button size="lg" asChild className="gradient-primary text-primary-foreground font-semibold shadow-glow hover:opacity-90 transition-all duration-300">
              <Link to="/">
                <Home className="w-5 h-5 mr-2" />
                Voltar ao Inicio
              </Link>
            </Button>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
