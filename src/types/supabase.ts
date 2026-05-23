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
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      books: {
        Row: {
          author: string | null
          category: string | null
          condition: string | null
          cover_url: string | null
          created_at: string | null
          id: string
          isbn: string | null
          language: string | null
          origin: string | null
          replacement_cost: number | null
          sponsor_id: string | null
          status: string | null
          summary: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author?: string | null
          category?: string | null
          condition?: string | null
          cover_url?: string | null
          created_at?: string | null
          id?: string
          isbn?: string | null
          language?: string | null
          origin?: string | null
          replacement_cost?: number | null
          sponsor_id?: string | null
          status?: string | null
          summary?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string | null
          category?: string | null
          condition?: string | null
          cover_url?: string | null
          created_at?: string | null
          id?: string
          isbn?: string | null
          language?: string | null
          origin?: string | null
          replacement_cost?: number | null
          sponsor_id?: string | null
          status?: string | null
          summary?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "books_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      donations_pending: {
        Row: {
          book_author: string | null
          book_title: string
          created_at: string | null
          donor_id: string | null
          id: string
          notes: string | null
          review_notes: string | null
          reviewed_at: string | null
          reviewer_id: string | null
          status: string | null
        }
        Insert: {
          book_author?: string | null
          book_title: string
          created_at?: string | null
          donor_id?: string | null
          id?: string
          notes?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string | null
        }
        Update: {
          book_author?: string | null
          book_title?: string
          created_at?: string | null
          donor_id?: string | null
          id?: string
          notes?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_pending_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_pending_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_agreements: {
        Row: {
          agreement_text: string | null
          book_id: string | null
          checkbox_accepted: boolean
          id: string
          ip_address: string | null
          loan_id: string | null
          pdf_url: string | null
          signature_url: string | null
          signed_at: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          agreement_text?: string | null
          book_id?: string | null
          checkbox_accepted: boolean
          id?: string
          ip_address?: string | null
          loan_id?: string | null
          pdf_url?: string | null
          signature_url?: string | null
          signed_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          agreement_text?: string | null
          book_id?: string | null
          checkbox_accepted?: boolean
          id?: string
          ip_address?: string | null
          loan_id?: string | null
          pdf_url?: string | null
          signature_url?: string | null
          signed_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loan_agreements_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loan_agreements_loan_id_fkey"
            columns: ["loan_id"]
            isOneToOne: false
            referencedRelation: "loans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loan_agreements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      loans: {
        Row: {
          agreement_id: string | null
          book_id: string
          collected_at: string | null
          created_at: string | null
          due_date: string | null
          id: string
          notes: string | null
          renewals: number | null
          reserved_at: string | null
          returned_at: string | null
          status: string | null
          updated_at: string | null
          user_id: string
          warnings_sent: number | null
        }
        Insert: {
          agreement_id?: string | null
          book_id: string
          collected_at?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          renewals?: number | null
          reserved_at?: string | null
          returned_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          warnings_sent?: number | null
        }
        Update: {
          agreement_id?: string | null
          book_id?: string
          collected_at?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          renewals?: number | null
          reserved_at?: string | null
          returned_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          warnings_sent?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "loans_agreement_id_fkey"
            columns: ["agreement_id"]
            isOneToOne: false
            referencedRelation: "loan_agreements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loans_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments_pool: {
        Row: {
          amount: number
          concept: string
          created_at: string | null
          created_by: string | null
          donor_id: string | null
          id: string
          receipt_url: string | null
          type: string
        }
        Insert: {
          amount: number
          concept: string
          created_at?: string | null
          created_by?: string | null
          donor_id?: string | null
          id?: string
          receipt_url?: string | null
          type: string
        }
        Update: {
          amount?: number
          concept?: string
          created_at?: string | null
          created_by?: string | null
          donor_id?: string | null
          id?: string
          receipt_url?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_pool_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_pool_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          dni: string | null
          full_name: string
          gdpr_consent: boolean | null
          gdpr_date: string | null
          id: string
          phone: string | null
          role: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dni?: string | null
          full_name: string
          gdpr_consent?: boolean | null
          gdpr_date?: string | null
          id: string
          phone?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dni?: string | null
          full_name?: string
          gdpr_consent?: boolean | null
          gdpr_date?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_admin_role: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
