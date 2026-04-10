export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      api_health_checks: {
        Row: {
          checked_at: string
          error_message: string | null
          id: string
          metadata: Json | null
          response_time_ms: number | null
          status: string
        }
        Insert: {
          checked_at?: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          response_time_ms?: number | null
          status: string
        }
        Update: {
          checked_at?: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          response_time_ms?: number | null
          status?: string
        }
        Relationships: []
      }
      assinaturas: {
        Row: {
          created_at: string
          fim: string | null
          id: string
          inicio: string
          plano_id: string
          status: string
          stripe_customer_id: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          fim?: string | null
          id?: string
          inicio?: string
          plano_id: string
          status?: string
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          fim?: string | null
          id?: string
          inicio?: string
          plano_id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assinaturas_plano_id_fkey"
            columns: ["plano_id"]
            isOneToOne: false
            referencedRelation: "planos"
            referencedColumns: ["id"]
          },
        ]
      }
      consultas: {
        Row: {
          cpf_cnpj_condutor: string | null
          cpf_cnpj_proprietario: string | null
          created_at: string
          data_infracao: string | null
          id: string
          local_infracao: string | null
          nome_condutor: string | null
          nome_proprietario: string | null
          numero_auto: string | null
          numero_serie: string
          radar_id: string | null
          resultado: Json | null
          user_id: string
        }
        Insert: {
          cpf_cnpj_condutor?: string | null
          cpf_cnpj_proprietario?: string | null
          created_at?: string
          data_infracao?: string | null
          id?: string
          local_infracao?: string | null
          nome_condutor?: string | null
          nome_proprietario?: string | null
          numero_auto?: string | null
          numero_serie: string
          radar_id?: string | null
          resultado?: Json | null
          user_id: string
        }
        Update: {
          cpf_cnpj_condutor?: string | null
          cpf_cnpj_proprietario?: string | null
          created_at?: string
          data_infracao?: string | null
          id?: string
          local_infracao?: string | null
          nome_condutor?: string | null
          nome_proprietario?: string | null
          numero_auto?: string | null
          numero_serie?: string
          radar_id?: string | null
          resultado?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultas_radar_id_fkey"
            columns: ["radar_id"]
            isOneToOne: false
            referencedRelation: "radares"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultas_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      disclaimer_aceites: {
        Row: {
          created_at: string
          id: string
          ip_address: string | null
          tipo_disclaimer: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: string | null
          tipo_disclaimer?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: string | null
          tipo_disclaimer?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      pagamentos: {
        Row: {
          consulta_id: string | null
          created_at: string
          currency_id: string | null
          description: string | null
          external_reference: string | null
          id: string
          merchant_order_id: string | null
          payer_email: string | null
          payer_identification_number: string | null
          payer_identification_type: string | null
          payment_id: string
          payment_method_id: string | null
          payment_type: string | null
          preference_id: string | null
          processed_at: string | null
          recurso_gerado: boolean | null
          recurso_gerado_at: string | null
          status: string
          status_detail: string | null
          transaction_amount: number
          updated_at: string
          user_id: string
          webhook_received_at: string | null
        }
        Insert: {
          consulta_id?: string | null
          created_at?: string
          currency_id?: string | null
          description?: string | null
          external_reference?: string | null
          id?: string
          merchant_order_id?: string | null
          payer_email?: string | null
          payer_identification_number?: string | null
          payer_identification_type?: string | null
          payment_id: string
          payment_method_id?: string | null
          payment_type?: string | null
          preference_id?: string | null
          processed_at?: string | null
          recurso_gerado?: boolean | null
          recurso_gerado_at?: string | null
          status?: string
          status_detail?: string | null
          transaction_amount: number
          updated_at?: string
          user_id: string
          webhook_received_at?: string | null
        }
        Update: {
          consulta_id?: string | null
          created_at?: string
          currency_id?: string | null
          description?: string | null
          external_reference?: string | null
          id?: string
          merchant_order_id?: string | null
          payer_email?: string | null
          payer_identification_number?: string | null
          payer_identification_type?: string | null
          payment_id?: string
          payment_method_id?: string | null
          payment_type?: string | null
          preference_id?: string | null
          processed_at?: string | null
          recurso_gerado?: boolean | null
          recurso_gerado_at?: string | null
          status?: string
          status_detail?: string | null
          transaction_amount?: number
          updated_at?: string
          user_id?: string
          webhook_received_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pagamentos_consulta_id_fkey"
            columns: ["consulta_id"]
            isOneToOne: false
            referencedRelation: "consultas"
            referencedColumns: ["id"]
          },
        ]
      }
      planos: {
        Row: {
          ativo: boolean
          consultas_mensais: number
          created_at: string
          features: Json
          id: string
          nome: string
          preco: number
          slug: string
        }
        Insert: {
          ativo?: boolean
          consultas_mensais: number
          created_at?: string
          features?: Json
          id?: string
          nome: string
          preco?: number
          slug: string
        }
        Update: {
          ativo?: boolean
          consultas_mensais?: number
          created_at?: string
          features?: Json
          id?: string
          nome?: string
          preco?: number
          slug?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          cpf_cnpj: string | null
          created_at: string
          full_name: string | null
          id: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          cpf_cnpj?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          cpf_cnpj?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      radares: {
        Row: {
          created_at: string
          data_certificado: string | null
          id: string
          last_checked_at: string
          marca: string | null
          mensagem: string | null
          modelo: string | null
          municipio: string | null
          numero_certificado: string | null
          numero_serie: string
          status_aprovado: boolean
          uf: string | null
          validade_certificado: string | null
        }
        Insert: {
          created_at?: string
          data_certificado?: string | null
          id?: string
          last_checked_at?: string
          marca?: string | null
          mensagem?: string | null
          modelo?: string | null
          municipio?: string | null
          numero_certificado?: string | null
          numero_serie: string
          status_aprovado?: boolean
          uf?: string | null
          validade_certificado?: string | null
        }
        Update: {
          created_at?: string
          data_certificado?: string | null
          id?: string
          last_checked_at?: string
          marca?: string | null
          mensagem?: string | null
          modelo?: string | null
          municipio?: string | null
          numero_certificado?: string | null
          numero_serie?: string
          status_aprovado?: boolean
          uf?: string | null
          validade_certificado?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      uso_consultas: {
        Row: {
          consultas_pagas: number
          consultas_usadas: number
          created_at: string
          id: string
          mes_referencia: string
          updated_at: string
          user_id: string
        }
        Insert: {
          consultas_pagas?: number
          consultas_usadas?: number
          created_at?: string
          id?: string
          mes_referencia: string
          updated_at?: string
          user_id: string
        }
        Update: {
          consultas_pagas?: number
          consultas_usadas?: number
          created_at?: string
          id?: string
          mes_referencia?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_consultation_limit: { Args: { p_user_id: string }; Returns: Json }
      get_admin_stats: { Args: never; Returns: Json }
      get_all_users_with_roles: {
        Args: never
        Returns: {
          created_at: string
          email: string
          full_name: string
          roles: string[]
          user_id: string
        }[]
      }
      get_api_uptime_stats: { Args: { period_hours?: number }; Returns: Json }
      get_consultas_por_plano: {
        Args: never
        Returns: {
          plano_nome: string
          total_consultas: number
          usuarios_unicos: number
        }[]
      }
      get_monthly_growth: {
        Args: never
        Returns: {
          mes: string
          nova_receita: number
          novas_consultas: number
          novos_usuarios: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_consultation_usage: {
        Args: { p_is_paid?: boolean; p_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
