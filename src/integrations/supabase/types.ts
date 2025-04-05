export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      contact_lenses: {
        Row: {
          bc: string
          brand: string
          color: string | null
          created_at: string | null
          diameter: string
          id: string
          lens_id: string
          power: string
          price: number
          qty: number
          type: string
          updated_at: string | null
        }
        Insert: {
          bc: string
          brand: string
          color?: string | null
          created_at?: string | null
          diameter: string
          id?: string
          lens_id: string
          power: string
          price: number
          qty?: number
          type: string
          updated_at?: string | null
        }
        Update: {
          bc?: string
          brand?: string
          color?: string | null
          created_at?: string | null
          diameter?: string
          id?: string
          lens_id?: string
          power?: string
          price?: number
          qty?: number
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      daily_sales_summary: {
        Row: {
          contacts_sales_count: number
          created_at: string | null
          date: string
          exam_sales_count: number
          glasses_sales_count: number
          id: string
          location_id: string | null
          net_sales: number
          total_refunds: number
          total_sales: number
          updated_at: string | null
        }
        Insert: {
          contacts_sales_count?: number
          created_at?: string | null
          date: string
          exam_sales_count?: number
          glasses_sales_count?: number
          id?: string
          location_id?: string | null
          net_sales?: number
          total_refunds?: number
          total_sales?: number
          updated_at?: string | null
        }
        Update: {
          contacts_sales_count?: number
          created_at?: string | null
          date?: string
          exam_sales_count?: number
          glasses_sales_count?: number
          id?: string
          location_id?: string | null
          net_sales?: number
          total_refunds?: number
          total_sales?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      frames: {
        Row: {
          brand: string
          color: string
          created_at: string | null
          frame_id: string
          id: string
          model: string
          price: number
          qty: number
          size: string | null
          updated_at: string | null
        }
        Insert: {
          brand: string
          color: string
          created_at?: string | null
          frame_id: string
          id?: string
          model: string
          price: number
          qty?: number
          size?: string | null
          updated_at?: string | null
        }
        Update: {
          brand?: string
          color?: string
          created_at?: string | null
          frame_id?: string
          id?: string
          model?: string
          price?: number
          qty?: number
          size?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      invoice_records: {
        Row: {
          created_at: string | null
          date: string
          deposit_amount: number
          id: string
          invoice_id: string
          invoice_type: string
          is_paid: boolean
          is_refunded: boolean
          location_id: string | null
          patient_id: string | null
          patient_name: string
          payment_method: string
          refund_id: string | null
          remaining_amount: number
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          deposit_amount: number
          id?: string
          invoice_id: string
          invoice_type: string
          is_paid?: boolean
          is_refunded?: boolean
          location_id?: string | null
          patient_id?: string | null
          patient_name: string
          payment_method: string
          refund_id?: string | null
          remaining_amount: number
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          deposit_amount?: number
          id?: string
          invoice_id?: string
          invoice_type?: string
          is_paid?: boolean
          is_refunded?: boolean
          location_id?: string | null
          patient_id?: string | null
          patient_name?: string
          payment_method?: string
          refund_id?: string | null
          remaining_amount?: number
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      invoice_types_summary: {
        Row: {
          amount: number
          count: number
          created_at: string | null
          daily_summary_id: string | null
          id: string
          invoice_type: string
        }
        Insert: {
          amount?: number
          count?: number
          created_at?: string | null
          daily_summary_id?: string | null
          id?: string
          invoice_type: string
        }
        Update: {
          amount?: number
          count?: number
          created_at?: string | null
          daily_summary_id?: string | null
          id?: string
          invoice_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_types_summary_daily_summary_id_fkey"
            columns: ["daily_summary_id"]
            isOneToOne: false
            referencedRelation: "daily_sales_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      lens_coatings: {
        Row: {
          available_colors: string[] | null
          category: string
          coating_id: string
          created_at: string | null
          description: string | null
          id: string
          is_photochromic: boolean | null
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          available_colors?: string[] | null
          category: string
          coating_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_photochromic?: boolean | null
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          available_colors?: string[] | null
          category?: string
          coating_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_photochromic?: boolean | null
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      lens_pricing_combinations: {
        Row: {
          coating_id: string
          combo_id: string
          created_at: string | null
          id: string
          lens_type_id: string
          price: number
          thickness_id: string
          updated_at: string | null
        }
        Insert: {
          coating_id: string
          combo_id: string
          created_at?: string | null
          id?: string
          lens_type_id: string
          price: number
          thickness_id: string
          updated_at?: string | null
        }
        Update: {
          coating_id?: string
          combo_id?: string
          created_at?: string | null
          id?: string
          lens_type_id?: string
          price?: number
          thickness_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      lens_thicknesses: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          price: number
          thickness_id: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          price: number
          thickness_id: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          price?: number
          thickness_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      lens_types: {
        Row: {
          created_at: string | null
          id: string
          lens_id: string
          name: string
          price: number | null
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          lens_id: string
          name: string
          price?: number | null
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          lens_id?: string
          name?: string
          price?: number | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      monthly_sales_summary: {
        Row: {
          contacts_sales_count: number
          created_at: string | null
          exam_sales_count: number
          glasses_sales_count: number
          id: string
          location_id: string | null
          month: number
          net_sales: number
          total_refunds: number
          total_sales: number
          updated_at: string | null
          year: number
        }
        Insert: {
          contacts_sales_count?: number
          created_at?: string | null
          exam_sales_count?: number
          glasses_sales_count?: number
          id?: string
          location_id?: string | null
          month: number
          net_sales?: number
          total_refunds?: number
          total_sales?: number
          updated_at?: string | null
          year: number
        }
        Update: {
          contacts_sales_count?: number
          created_at?: string | null
          exam_sales_count?: number
          glasses_sales_count?: number
          id?: string
          location_id?: string | null
          month?: number
          net_sales?: number
          total_refunds?: number
          total_sales?: number
          updated_at?: string | null
          year?: number
        }
        Relationships: []
      }
      payment_methods_summary: {
        Row: {
          amount: number
          created_at: string | null
          daily_summary_id: string | null
          id: string
          payment_method: string
          transaction_count: number
        }
        Insert: {
          amount?: number
          created_at?: string | null
          daily_summary_id?: string | null
          id?: string
          payment_method: string
          transaction_count?: number
        }
        Update: {
          amount?: number
          created_at?: string | null
          daily_summary_id?: string | null
          id?: string
          payment_method?: string
          transaction_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "payment_methods_summary_daily_summary_id_fkey"
            columns: ["daily_summary_id"]
            isOneToOne: false
            referencedRelation: "daily_sales_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      refund_records: {
        Row: {
          amount: number
          created_at: string | null
          date: string
          id: string
          invoice_id: string
          location_id: string | null
          reason: string | null
          refund_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          date: string
          id?: string
          invoice_id: string
          location_id?: string | null
          reason?: string | null
          refund_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          date?: string
          id?: string
          invoice_id?: string
          location_id?: string | null
          reason?: string | null
          refund_id?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          price: number
          service_id: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          price: number
          service_id: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          price?: number
          service_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
