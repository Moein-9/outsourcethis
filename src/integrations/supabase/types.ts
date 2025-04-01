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
