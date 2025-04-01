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
          diameter: string
          id: string
          lens_id: string
          power: string
          price: number
          qty: number
          type: string
        }
        Insert: {
          bc: string
          brand: string
          color?: string | null
          diameter: string
          id?: string
          lens_id: string
          power: string
          price: number
          qty: number
          type: string
        }
        Update: {
          bc?: string
          brand?: string
          color?: string | null
          diameter?: string
          id?: string
          lens_id?: string
          power?: string
          price?: number
          qty?: number
          type?: string
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
          size: string
        }
        Insert: {
          brand: string
          color: string
          created_at?: string | null
          frame_id: string
          id?: string
          model: string
          price: number
          qty: number
          size: string
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
          size?: string
        }
        Relationships: []
      }
      invoice_contact_lens_items: {
        Row: {
          bc: string
          brand: string
          color: string | null
          diameter: string
          id: string
          invoice_id: string
          lens_id: string
          power: string
          price: number
          qty: number
          type: string
        }
        Insert: {
          bc: string
          brand: string
          color?: string | null
          diameter: string
          id?: string
          invoice_id: string
          lens_id: string
          power: string
          price: number
          qty?: number
          type: string
        }
        Update: {
          bc?: string
          brand?: string
          color?: string | null
          diameter?: string
          id?: string
          invoice_id?: string
          lens_id?: string
          power?: string
          price?: number
          qty?: number
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_contact_lens_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_edit_history: {
        Row: {
          id: string
          invoice_id: string
          notes: string
          timestamp: string
        }
        Insert: {
          id?: string
          invoice_id: string
          notes: string
          timestamp?: string
        }
        Update: {
          id?: string
          invoice_id?: string
          notes?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_edit_history_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_payments: {
        Row: {
          amount: number
          auth_number: string | null
          date: string
          id: string
          invoice_id: string
          method: string
        }
        Insert: {
          amount: number
          auth_number?: string | null
          date?: string
          id?: string
          invoice_id: string
          method: string
        }
        Update: {
          amount?: number
          auth_number?: string | null
          date?: string
          id?: string
          invoice_id?: string
          method?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          archive_reason: string | null
          archived_at: string | null
          auth_number: string | null
          coating: string | null
          coating_price: number
          created_at: string
          deposit: number
          discount: number
          frame_brand: string | null
          frame_color: string | null
          frame_model: string | null
          frame_price: number
          frame_size: string | null
          id: string
          invoice_id: string
          invoice_type: string | null
          is_archived: boolean | null
          is_paid: boolean | null
          is_picked_up: boolean | null
          is_refunded: boolean | null
          last_edited_at: string | null
          lens_price: number
          lens_type: string | null
          patient_id: string | null
          patient_name: string
          patient_phone: string
          payment_method: string
          picked_up_at: string | null
          refund_amount: number | null
          refund_date: string | null
          refund_id: string | null
          refund_method: string | null
          refund_reason: string | null
          remaining: number
          service_description: string | null
          service_id: string | null
          service_name: string | null
          service_price: number | null
          total: number
          work_order_id: string | null
        }
        Insert: {
          archive_reason?: string | null
          archived_at?: string | null
          auth_number?: string | null
          coating?: string | null
          coating_price?: number
          created_at?: string
          deposit?: number
          discount?: number
          frame_brand?: string | null
          frame_color?: string | null
          frame_model?: string | null
          frame_price?: number
          frame_size?: string | null
          id?: string
          invoice_id: string
          invoice_type?: string | null
          is_archived?: boolean | null
          is_paid?: boolean | null
          is_picked_up?: boolean | null
          is_refunded?: boolean | null
          last_edited_at?: string | null
          lens_price?: number
          lens_type?: string | null
          patient_id?: string | null
          patient_name: string
          patient_phone: string
          payment_method: string
          picked_up_at?: string | null
          refund_amount?: number | null
          refund_date?: string | null
          refund_id?: string | null
          refund_method?: string | null
          refund_reason?: string | null
          remaining: number
          service_description?: string | null
          service_id?: string | null
          service_name?: string | null
          service_price?: number | null
          total: number
          work_order_id?: string | null
        }
        Update: {
          archive_reason?: string | null
          archived_at?: string | null
          auth_number?: string | null
          coating?: string | null
          coating_price?: number
          created_at?: string
          deposit?: number
          discount?: number
          frame_brand?: string | null
          frame_color?: string | null
          frame_model?: string | null
          frame_price?: number
          frame_size?: string | null
          id?: string
          invoice_id?: string
          invoice_type?: string | null
          is_archived?: boolean | null
          is_paid?: boolean | null
          is_picked_up?: boolean | null
          is_refunded?: boolean | null
          last_edited_at?: string | null
          lens_price?: number
          lens_type?: string | null
          patient_id?: string | null
          patient_name?: string
          patient_phone?: string
          payment_method?: string
          picked_up_at?: string | null
          refund_amount?: number | null
          refund_date?: string | null
          refund_id?: string | null
          refund_method?: string | null
          refund_reason?: string | null
          remaining?: number
          service_description?: string | null
          service_id?: string | null
          service_name?: string | null
          service_price?: number | null
          total?: number
          work_order_id?: string | null
        }
        Relationships: []
      }
      lens_coatings: {
        Row: {
          category: string
          coating_id: string
          description: string | null
          id: string
          name: string
          price: number
        }
        Insert: {
          category: string
          coating_id: string
          description?: string | null
          id?: string
          name: string
          price: number
        }
        Update: {
          category?: string
          coating_id?: string
          description?: string | null
          id?: string
          name?: string
          price?: number
        }
        Relationships: []
      }
      lens_pricing_combinations: {
        Row: {
          coating_id: string
          combination_id: string
          created_at: string
          id: string
          lens_type_id: string
          price: number
          thickness_id: string
          updated_at: string
        }
        Insert: {
          coating_id: string
          combination_id: string
          created_at?: string
          id?: string
          lens_type_id: string
          price: number
          thickness_id: string
          updated_at?: string
        }
        Update: {
          coating_id?: string
          combination_id?: string
          created_at?: string
          id?: string
          lens_type_id?: string
          price?: number
          thickness_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lens_pricing_combinations_coating_id_fkey"
            columns: ["coating_id"]
            isOneToOne: false
            referencedRelation: "lens_coatings"
            referencedColumns: ["coating_id"]
          },
          {
            foreignKeyName: "lens_pricing_combinations_lens_type_id_fkey"
            columns: ["lens_type_id"]
            isOneToOne: false
            referencedRelation: "lens_types"
            referencedColumns: ["lens_id"]
          },
          {
            foreignKeyName: "lens_pricing_combinations_thickness_id_fkey"
            columns: ["thickness_id"]
            isOneToOne: false
            referencedRelation: "lens_thicknesses"
            referencedColumns: ["thickness_id"]
          },
        ]
      }
      lens_thicknesses: {
        Row: {
          category: string
          description: string | null
          id: string
          name: string
          price: number
          thickness_id: string
        }
        Insert: {
          category: string
          description?: string | null
          id?: string
          name: string
          price: number
          thickness_id: string
        }
        Update: {
          category?: string
          description?: string | null
          id?: string
          name?: string
          price?: number
          thickness_id?: string
        }
        Relationships: []
      }
      lens_types: {
        Row: {
          id: string
          lens_id: string
          name: string
          price: number | null
          type: string
        }
        Insert: {
          id?: string
          lens_id: string
          name: string
          price?: number | null
          type: string
        }
        Update: {
          id?: string
          lens_id?: string
          name?: string
          price?: number | null
          type?: string
        }
        Relationships: []
      }
      patient_contact_lens_rx: {
        Row: {
          created_at: string
          id: string
          left_eye_axis: string | null
          left_eye_bc: string | null
          left_eye_cylinder: string | null
          left_eye_dia: string | null
          left_eye_sphere: string | null
          patient_id: string
          right_eye_axis: string | null
          right_eye_bc: string | null
          right_eye_cylinder: string | null
          right_eye_dia: string | null
          right_eye_sphere: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          left_eye_axis?: string | null
          left_eye_bc?: string | null
          left_eye_cylinder?: string | null
          left_eye_dia?: string | null
          left_eye_sphere?: string | null
          patient_id: string
          right_eye_axis?: string | null
          right_eye_bc?: string | null
          right_eye_cylinder?: string | null
          right_eye_dia?: string | null
          right_eye_sphere?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          left_eye_axis?: string | null
          left_eye_bc?: string | null
          left_eye_cylinder?: string | null
          left_eye_dia?: string | null
          left_eye_sphere?: string | null
          patient_id?: string
          right_eye_axis?: string | null
          right_eye_bc?: string | null
          right_eye_cylinder?: string | null
          right_eye_dia?: string | null
          right_eye_sphere?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_contact_lens_rx_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_notes: {
        Row: {
          created_at: string
          id: string
          note_id: string
          patient_id: string
          text: string
        }
        Insert: {
          created_at?: string
          id?: string
          note_id: string
          patient_id: string
          text: string
        }
        Update: {
          created_at?: string
          id?: string
          note_id?: string
          patient_id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_notes_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_rx: {
        Row: {
          add_od: string | null
          add_os: string | null
          axis_od: string | null
          axis_os: string | null
          created_at: string
          cyl_od: string | null
          cyl_os: string | null
          id: string
          patient_id: string
          pd_left: string | null
          pd_right: string | null
          sphere_od: string | null
          sphere_os: string | null
        }
        Insert: {
          add_od?: string | null
          add_os?: string | null
          axis_od?: string | null
          axis_os?: string | null
          created_at?: string
          cyl_od?: string | null
          cyl_os?: string | null
          id?: string
          patient_id: string
          pd_left?: string | null
          pd_right?: string | null
          sphere_od?: string | null
          sphere_os?: string | null
        }
        Update: {
          add_od?: string | null
          add_os?: string | null
          axis_od?: string | null
          axis_os?: string | null
          created_at?: string
          cyl_od?: string | null
          cyl_os?: string | null
          id?: string
          patient_id?: string
          pd_left?: string | null
          pd_right?: string | null
          sphere_od?: string | null
          sphere_os?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_rx_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          created_at: string
          dob: string
          id: string
          name: string
          notes: string | null
          patient_id: string
          phone: string
        }
        Insert: {
          created_at?: string
          dob: string
          id?: string
          name: string
          notes?: string | null
          patient_id: string
          phone: string
        }
        Update: {
          created_at?: string
          dob?: string
          id?: string
          name?: string
          notes?: string | null
          patient_id?: string
          phone?: string
        }
        Relationships: []
      }
      refunds: {
        Row: {
          amount: number
          associated_invoice_id: string
          date: string
          id: string
          method: string
          reason: string
          refund_id: string
          staff_notes: string | null
        }
        Insert: {
          amount: number
          associated_invoice_id: string
          date?: string
          id?: string
          method: string
          reason: string
          refund_id: string
          staff_notes?: string | null
        }
        Update: {
          amount?: number
          associated_invoice_id?: string
          date?: string
          id?: string
          method?: string
          reason?: string
          refund_id?: string
          staff_notes?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          category: string
          description: string
          id: string
          name: string
          price: number
          service_id: string
        }
        Insert: {
          category: string
          description: string
          id?: string
          name: string
          price: number
          service_id: string
        }
        Update: {
          category?: string
          description?: string
          id?: string
          name?: string
          price?: number
          service_id?: string
        }
        Relationships: []
      }
      work_order_edit_history: {
        Row: {
          id: string
          notes: string
          timestamp: string
          work_order_id: string
        }
        Insert: {
          id?: string
          notes: string
          timestamp?: string
          work_order_id: string
        }
        Update: {
          id?: string
          notes?: string
          timestamp?: string
          work_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_order_edit_history_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      work_orders: {
        Row: {
          archive_reason: string | null
          archived_at: string | null
          created_at: string
          id: string
          is_archived: boolean | null
          is_picked_up: boolean | null
          is_refunded: boolean | null
          last_edited_at: string | null
          lens_type_name: string | null
          lens_type_price: number | null
          patient_id: string
          picked_up_at: string | null
          refund_date: string | null
          work_order_id: string
        }
        Insert: {
          archive_reason?: string | null
          archived_at?: string | null
          created_at?: string
          id?: string
          is_archived?: boolean | null
          is_picked_up?: boolean | null
          is_refunded?: boolean | null
          last_edited_at?: string | null
          lens_type_name?: string | null
          lens_type_price?: number | null
          patient_id: string
          picked_up_at?: string | null
          refund_date?: string | null
          work_order_id: string
        }
        Update: {
          archive_reason?: string | null
          archived_at?: string | null
          created_at?: string
          id?: string
          is_archived?: boolean | null
          is_picked_up?: boolean | null
          is_refunded?: boolean | null
          last_edited_at?: string | null
          lens_type_name?: string | null
          lens_type_price?: number | null
          patient_id?: string
          picked_up_at?: string | null
          refund_date?: string | null
          work_order_id?: string
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
