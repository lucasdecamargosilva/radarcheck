import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { InstallPWA } from "@/components/InstallPWA";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Perfil from "./pages/Perfil";
import Planos from "./pages/Planos";
import AdminDashboard from "./pages/AdminDashboard";
import Status from "./pages/Status";
import TermosDeUso from "./pages/TermosDeUso";
import Privacidade from "./pages/Privacidade";
import Sobre from "./pages/Sobre";
import Contato from "./pages/Contato";
import FAQ from "./pages/FAQ";
import RecuperarSenha from "./pages/RecuperarSenha";
import ResetarSenha from "./pages/ResetarSenha";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <InstallPWA />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/planos" element={<Planos />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/status" element={<Status />} />
          <Route path="/termos-de-uso" element={<TermosDeUso />} />
          <Route path="/privacidade" element={<Privacidade />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          <Route path="/resetar-senha" element={<ResetarSenha />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
