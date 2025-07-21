import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export type SupabaseDatabase = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      kriteria: {
        Row: {
          id: string;
          user_id: string;
          nama: string;
          bobot: number;
          atribut: "Benefit" | "Cost";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          nama: string;
          bobot: number;
          atribut: "Benefit" | "Cost";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          nama?: string;
          bobot?: number;
          atribut?: "Benefit" | "Cost";
          created_at?: string;
          updated_at?: string;
        };
      };
      alternatif: {
        Row: {
          id: string;
          user_id: string;
          nama: string;
          deskripsi: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          nama: string;
          deskripsi?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          nama?: string;
          deskripsi?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      penilaian: {
        Row: {
          id: string;
          user_id: string;
          alternatif_id: string;
          kriteria_id: string;
          nilai: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          alternatif_id: string;
          kriteria_id: string;
          nilai: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          alternatif_id?: string;
          kriteria_id?: string;
          nilai?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      hasil_perhitungan: {
        Row: {
          id: string;
          user_id: string;
          alternatif_id: string;
          nilai_preferensi: number;
          ranking: number;
          distance_positive: number;
          distance_negative: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          alternatif_id: string;
          nilai_preferensi: number;
          ranking: number;
          distance_positive: number;
          distance_negative: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          alternatif_id?: string;
          nilai_preferensi?: number;
          ranking?: number;
          distance_positive?: number;
          distance_negative?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};
