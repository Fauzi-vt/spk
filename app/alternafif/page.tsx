"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { StatsCard } from "@/components/ui/stats-card";
import { EmptyState } from "@/components/ui/empty-state";
import { AlertBanner } from "@/components/ui/alert-banner";
import { AlternatifForm } from "@/components/forms/alternatif-form";
import { AlternatifCard } from "@/components/cards/alternatif-card";
import { Shirt, CheckCircle, TrendingUp, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { useAuth } from "@/contexts/AuthContext";
import type { Alternatif } from "@/types";

export default function AlternatifPage() {
  const [alternatif, setAlternatif] = useState<Alternatif[]>([]);
  const [editingAlternatif, setEditingAlternatif] = useState<Alternatif | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const supabase = createClient();

  const fetchAlternatif = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase.from("alternatif").select("*").eq("user_id", user.id).order("created_at");

      if (fetchError) throw fetchError;

      // Map the data to match our interface
      const mappedData = (data || []).map((item) => ({
        id: item.id,
        nama: item.nama,
        deskripsi: item.deskripsi,
      }));

      setAlternatif(mappedData);
    } catch (err) {
      console.error("Error fetching alternatif:", err);
      setError("Terjadi kesalahan saat mengambil data alternatif.");
    } finally {
      setLoading(false);
    }
  }, [user?.id, supabase]);

  useEffect(() => {
    if (user) {
      fetchAlternatif();
    }
  }, [user, fetchAlternatif]);

  const handleSubmit = async (data: Omit<Alternatif, "id">) => {
    try {
      setSaving(true);
      setError(null);

      if (editingAlternatif) {
        // Update existing alternatif
        const { error: updateError } = await supabase.from("alternatif").update({ nama: data.nama }).eq("id", editingAlternatif.id).eq("user_id", user?.id);

        if (updateError) throw updateError;

        setAlternatif(alternatif.map((alt) => (alt.id === editingAlternatif.id ? { ...alt, nama: data.nama } : alt)));
        setEditingAlternatif(null);
      } else {
        // Create new alternatif
        const { data: newData, error: insertError } = await supabase
          .from("alternatif")
          .insert({
            nama: data.nama,
            user_id: user?.id,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        const newAlternatif: Alternatif = {
          id: newData.id,
          nama: newData.nama,
          deskripsi: newData.deskripsi,
        };

        setAlternatif([...alternatif, newAlternatif]);
      }
    } catch (err) {
      console.error("Error saving alternatif:", err);
      setError("Terjadi kesalahan saat menyimpan alternatif.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: Alternatif) => {
    setEditingAlternatif(item);
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);

      const { error: deleteError } = await supabase.from("alternatif").delete().eq("id", id).eq("user_id", user?.id);

      if (deleteError) throw deleteError;

      setAlternatif(alternatif.filter((alt) => alt.id !== id));
      if (editingAlternatif?.id === id) {
        setEditingAlternatif(null);
      }
    } catch (err) {
      console.error("Error deleting alternatif:", err);
      setError("Terjadi kesalahan saat menghapus alternatif.");
    }
  };

  const handleCancel = () => {
    setEditingAlternatif(null);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4">Memuat data alternatif...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <PageHeader title="Input Alternatif Bahan Kain" description="Tambahkan alternatif bahan kain yang akan dievaluasi dalam sistem" />

      {/* Error Alert */}
      {error && (
        <div className="mb-6">
          <AlertBanner type="error" title="Terjadi Kesalahan" description={error} icon={AlertCircle} />
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatsCard title="Total Alternatif" value={alternatif.length} icon={Shirt} color="indigo" />
        <StatsCard title="Alternatif Terbaru" value={alternatif.length > 0 ? alternatif[alternatif.length - 1].nama : "-"} icon={TrendingUp} color="emerald" />
        <StatsCard title="Status" value={alternatif.length > 0 ? "Siap" : "Kosong"} icon={CheckCircle} color={alternatif.length > 0 ? "emerald" : "orange"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <AlternatifForm onSubmit={handleSubmit} editData={editingAlternatif || undefined} onCancel={editingAlternatif ? handleCancel : undefined} loading={saving} />

        {/* Stats Card */}
        <StatsCard title="Total Alternatif" value={alternatif.length} icon={Shirt} color="indigo" description={alternatif.length > 0 ? `Terakhir ditambahkan: ${alternatif[alternatif.length - 1]?.nama}` : "Belum ada alternatif"} />
      </div>

      {/* Alternatif Grid */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-neutral-700 mb-4">Daftar Alternatif Bahan Kain ({alternatif.length})</h3>
        {alternatif.length === 0 ? (
          <EmptyState icon={Shirt} title="Belum ada alternatif yang ditambahkan" description="Mulai dengan menambahkan alternatif bahan kain di form sebelah kiri" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {alternatif.map((item, index) => (
              <AlternatifCard key={item.id} alternatif={item} index={index} onEdit={handleEdit} onDelete={handleDelete} isEditing={editingAlternatif?.id === item.id} />
            ))}
          </div>
        )}
      </div>

      {/* Success Alert */}
      {alternatif.length > 0 && (
        <div className="mt-6">
          <AlertBanner type="success" title="Siap untuk langkah selanjutnya" description={`Anda telah menambahkan ${alternatif.length} alternatif. Lanjutkan ke tahap penilaian alternatif terhadap kriteria.`} icon={CheckCircle} />
        </div>
      )}
    </div>
  );
}
