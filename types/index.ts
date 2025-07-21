// Central type definitions for the TOPSIS decision support system

export interface Kriteria {
  id: string;
  nama: string;
  bobot: number;
  atribut: "Benefit" | "Cost";
  createdAt?: Date | string;
}

export interface Alternatif {
  id: string;
  nama: string;
  deskripsi?: string;
}

export interface PenilaianData {
  alternatif_id: string;
  kriteria_id: string;
  nilai: number;
}

export interface BobotData {
  kriteria_id: string;
  bobot: number;
}

export interface HasilPerhitungan {
  id: string;
  alternatif_id: string;
  alternatif_nama: string;
  skor_akhir: number;
  ranking: number;
  created_at?: string;
  // Database fields
  nilai_preferensi: number;
  distance_positive: number;
  distance_negative: number;
}

export interface ReportData {
  kriteria: Kriteria[];
  alternatif: Alternatif[];
  penilaian: PenilaianData[];
  hasil: HasilPerhitungan[];
}

// Form interfaces
export interface KriteriaFormProps {
  editData?: Kriteria | null;
  onSubmit: (kriteria: Omit<Kriteria, "id">) => void;
  onCancel?: () => void;
  loading?: boolean;
}

export interface AlternatifFormProps {
  editData?: Alternatif | null;
  onSubmit: (alternatif: Omit<Alternatif, "id">) => void;
  onCancel?: () => void;
  loading?: boolean;
}

// Table interfaces
export interface KriteriaTableProps {
  kriteria: Kriteria[];
  onEdit: (kriteria: Kriteria) => void;
  onDelete: (id: string) => void;
}

export interface PenilaianTableProps {
  kriteria: Kriteria[];
  alternatif: Alternatif[];
  penilaian: Record<string, Record<string, number>>;
  onValueChange: (alternatifId: string, kriteriaId: string, value: string) => void;
}

// Card interfaces
export interface AlternatifCardProps {
  alternatif: Alternatif;
  index: number;
  onEdit: (alternatif: Alternatif) => void;
  onDelete: (id: string) => void;
  isEditing?: boolean;
}

// UI component interfaces
export interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: React.ReactNode;
}

export interface AlertBannerProps {
  type: "success" | "error" | "warning" | "info";
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

// TOPSIS calculation types
export interface TOPSISMatrix {
  normalized: number[][];
  weighted: number[][];
  idealPositive: number[];
  idealNegative: number[];
  distances: {
    positive: number[];
    negative: number[];
  };
  scores: number[];
}

// Supabase Database types
export interface Database {
  public: {
    Tables: {
      kriteria: {
        Row: Kriteria;
        Insert: Omit<Kriteria, "id">;
        Update: Partial<Omit<Kriteria, "id">>;
      };
      alternatif: {
        Row: Alternatif;
        Insert: Omit<Alternatif, "id">;
        Update: Partial<Omit<Alternatif, "id">>;
      };
      penilaian: {
        Row: PenilaianData & { id: string };
        Insert: Omit<PenilaianData, "id">;
        Update: Partial<PenilaianData>;
      };
      hasil_perhitungan: {
        Row: HasilPerhitungan;
        Insert: Omit<HasilPerhitungan, "id" | "created_at">;
        Update: Partial<Omit<HasilPerhitungan, "id" | "created_at">>;
      };
    };
  };
}
