
export interface Database {
  public: {
    Tables: {
      frames: {
        Row: {
          id: string;
          frame_id: string;
          brand: string;
          model: string;
          color: string;
          size: string | null;
          price: number;
          qty: number;
          created_at: string;
          updated_at: string;
        };
      };
      lens_types: {
        Row: {
          id: string;
          lens_id: string;
          name: string;
          type: string;
          price: number | null;
          created_at: string;
          updated_at: string;
        };
      };
      lens_coatings: {
        Row: {
          id: string;
          coating_id: string;
          name: string;
          price: number;
          description: string | null;
          category: string;
          is_photochromic: boolean;
          available_colors: string[] | null;
          created_at: string;
          updated_at: string;
        };
      };
      lens_thicknesses: {
        Row: {
          id: string;
          thickness_id: string;
          name: string;
          price: number;
          description: string | null;
          category: string;
          created_at: string;
          updated_at: string;
        };
      };
      lens_pricing_combinations: {
        Row: {
          id: string;
          combo_id: string;
          lens_type_id: string;
          coating_id: string;
          thickness_id: string;
          price: number;
          created_at: string;
          updated_at: string;
        };
      };
      contact_lenses: {
        Row: {
          id: string;
          lens_id: string;
          brand: string;
          type: string;
          bc: string;
          diameter: string;
          power: string;
          price: number;
          qty: number;
          color: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      services: {
        Row: {
          id: string;
          service_id: string;
          name: string;
          description: string | null;
          price: number;
          category: string;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
}
