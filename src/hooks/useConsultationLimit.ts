import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ConsultationLimit {
  plano: string;
  plano_slug: string;
  limite_mensal: number;
  consultas_usadas: number;
  consultas_pagas: number;
  pode_consultar: boolean;
  mes_referencia: string;
}

export const useConsultationLimit = () => {
  const [limit, setLimit] = useState<ConsultationLimit | null>(null);
  const [loading, setLoading] = useState(true);

  const checkLimit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase.rpc("check_consultation_limit", {
        p_user_id: user.id,
      });

      if (error) throw error;
      setLimit(data as unknown as ConsultationLimit);
    } catch (error) {
      console.error("Error checking consultation limit:", error);
    } finally {
      setLoading(false);
    }
  };

  const incrementUsage = async (isPaid: boolean = false) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase.rpc("increment_consultation_usage", {
        p_user_id: user.id,
        p_is_paid: isPaid,
      });

      if (error) throw error;
      
      // Refresh limit after increment
      await checkLimit();
      return true;
    } catch (error) {
      console.error("Error incrementing usage:", error);
      return false;
    }
  };

  useEffect(() => {
    checkLimit();
  }, []);

  return { limit, loading, checkLimit, incrementUsage };
};
