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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          city: string | null
          country: string | null
          created_at: string | null
          device_type: string | null
          event_type: string
          id: string
          ip_address: string | null
          link_id: string | null
          os: string | null
          user_id: string
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          device_type?: string | null
          event_type: string
          id?: string
          ip_address?: string | null
          link_id?: string | null
          os?: string | null
          user_id: string
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          device_type?: string | null
          event_type?: string
          id?: string
          ip_address?: string | null
          link_id?: string | null
          os?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          captured_at: string | null
          card_owner_id: string
          id: string
          notes: string | null
          tap_city: string | null
          tap_device: string | null
          visitor_email: string | null
          visitor_name: string
          visitor_phone: string | null
        }
        Insert: {
          captured_at?: string | null
          card_owner_id: string
          id?: string
          notes?: string | null
          tap_city?: string | null
          tap_device?: string | null
          visitor_email?: string | null
          visitor_name: string
          visitor_phone?: string | null
        }
        Update: {
          captured_at?: string | null
          card_owner_id?: string
          id?: string
          notes?: string | null
          tap_city?: string | null
          tap_device?: string | null
          visitor_email?: string | null
          visitor_name?: string
          visitor_phone?: string | null
        }
        Relationships: []
      }
      links: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          label: string | null
          mode: string | null
          platform: string
          sort_order: number | null
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          label?: string | null
          mode?: string | null
          platform: string
          sort_order?: number | null
          url: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          label?: string | null
          mode?: string | null
          platform?: string
          sort_order?: number | null
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      nfc_cards: {
        Row: {
          activated_at: string | null
          card_type: string | null
          created_at: string | null
          id: string
          order_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          activated_at?: string | null
          card_type?: string | null
          created_at?: string | null
          id?: string
          order_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          activated_at?: string | null
          card_type?: string | null
          created_at?: string | null
          id?: string
          order_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          card_price: number | null
          card_type: string | null
          created_at: string | null
          id: string
          plan: string | null
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          shipping_address: Json | null
          status: string | null
          subscription_price: number | null
          total_amount: number | null
          tracking_number: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          card_price?: number | null
          card_type?: string | null
          created_at?: string | null
          id?: string
          plan?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          shipping_address?: Json | null
          status?: string | null
          subscription_price?: number | null
          total_amount?: number | null
          tracking_number?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          card_price?: number | null
          card_type?: string | null
          created_at?: string | null
          id?: string
          plan?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          shipping_address?: Json | null
          status?: string | null
          subscription_price?: number | null
          total_amount?: number | null
          tracking_number?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          active_mode: string | null
          avatar_url: string | null
          bio: string | null
          bio_personal: string | null
          company: string | null
          country_code: string | null
          created_at: string | null
          designation: string | null
          email: string
          full_name: string
          id: string
          institution: string | null
          is_active: boolean | null
          is_student: boolean | null
          lead_gen_consent: boolean | null
          location: string | null
          phone: string | null
          plan: string | null
          plan_expires_at: string | null
          updated_at: string | null
          user_id: string
          username: string
        }
        Insert: {
          active_mode?: string | null
          avatar_url?: string | null
          bio?: string | null
          bio_personal?: string | null
          company?: string | null
          country_code?: string | null
          created_at?: string | null
          designation?: string | null
          email: string
          full_name: string
          id?: string
          institution?: string | null
          is_active?: boolean | null
          is_student?: boolean | null
          lead_gen_consent?: boolean | null
          location?: string | null
          phone?: string | null
          plan?: string | null
          plan_expires_at?: string | null
          updated_at?: string | null
          user_id: string
          username: string
        }
        Update: {
          active_mode?: string | null
          avatar_url?: string | null
          bio?: string | null
          bio_personal?: string | null
          company?: string | null
          country_code?: string | null
          created_at?: string | null
          designation?: string | null
          email?: string
          full_name?: string
          id?: string
          institution?: string | null
          is_active?: boolean | null
          is_student?: boolean | null
          lead_gen_consent?: boolean | null
          location?: string | null
          phone?: string | null
          plan?: string | null
          plan_expires_at?: string | null
          updated_at?: string | null
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      referral_uses: {
        Row: {
          code: string
          created_at: string | null
          id: string
          used_by: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          used_by?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          used_by?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          converted_at: string | null
          created_at: string | null
          id: string
          referred_email: string
          referred_user_id: string | null
          referrer_user_id: string
          status: string | null
        }
        Insert: {
          converted_at?: string | null
          created_at?: string | null
          id?: string
          referred_email: string
          referred_user_id?: string | null
          referrer_user_id: string
          status?: string | null
        }
        Update: {
          converted_at?: string | null
          created_at?: string | null
          id?: string
          referred_email?: string
          referred_user_id?: string | null
          referrer_user_id?: string
          status?: string | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          business_owner_id: string
          card_id: string | null
          email: string
          id: string
          invited_at: string | null
          joined_at: string | null
          name: string
          role: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          business_owner_id: string
          card_id?: string | null
          email: string
          id?: string
          invited_at?: string | null
          joined_at?: string | null
          name: string
          role?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          business_owner_id?: string
          card_id?: string | null
          email?: string
          id?: string
          invited_at?: string | null
          joined_at?: string | null
          name?: string
          role?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "nfc_cards"
            referencedColumns: ["id"]
          },
        ]
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
    Enums: {},
  },
} as const
