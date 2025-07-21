"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { StatsCard } from "@/components/ui/stats-card";
import { EmptyState } from "@/components/ui/empty-state";
import { AlertBanner } from "@/components/ui/alert-banner";
import { KriteriaForm } from "@/components/forms/kriteria-form";
import { KriteriaTable } from "@/components/tables/kriteria-table";
import { KriteriaCard } from "@/components/cards/kriteria-card";
import { ClipboardList, CheckCircle, Shirt, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { useAuth } from "@/contexts/AuthContext";
import type { Kriteria } from "@/types";

export default function KriteriaPage() {
  const [kriteria, setKriteria] = useState<Kriteria[]>([]);
  const [editingKriteria, setEditingKriteria] = useState<Kriteria | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const supabase = createClient();

  const fetchKriteria = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase.from("kriteria").select("*").eq("user_id", user.id).order("created_at");

      if (fetchError) throw fetchError;

      // Map the data to match our interface
      const mappedData = (data || []).map((item) => ({
        id: item.id,
        nama: item.nama,
        atribut: item.atribut,
        bobot: item.bobot || 3,
        createdAt: item.created_at,
      }));

      setKriteria(mappedData);
    } catch (err) {
      console.error("Error fetching kriteria:", err);
      setError("Terjadi kesalahan saat mengambil data kriteria.");
    } finally {
      setLoading(false);
    }
  }, [user?.id, supabase]);

  useEffect(() => {
    if (user) {
      fetchKriteria();
    }
  }, [user, fetchKriteria]);

  const handleSubmit = async (data: Omit<Kriteria, "id">) => {
    try {
      setSaving(true);
      setError(null);

      if (editingKriteria) {
        // Update existing kriteria
        const { error: updateError } = await supabase
          .from("kriteria")
          .update({
            nama: data.nama,
            atribut: data.atribut,
            bobot: data.bobot,
          })
          .eq("id", editingKriteria.id)
          .eq("user_id", user?.id);

        if (updateError) throw updateError;

        setKriteria(kriteria.map((k) => (k.id === editingKriteria.id ? { ...k, nama: data.nama, atribut: data.atribut, bobot: data.bobot } : k)));
        setEditingKriteria(null);
      } else {
        // Create new kriteria
        const { data: newData, error: insertError } = await supabase
          .from("kriteria")
          .insert({
            nama: data.nama,
            atribut: data.atribut,
            bobot: data.bobot,
            user_id: user?.id,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        const newKriteria: Kriteria = {
          id: newData.id,
          nama: newData.nama,
          atribut: newData.atribut,
          bobot: newData.bobot,
          createdAt: newData.created_at,
        };

        setKriteria([...kriteria, newKriteria]);
      }
    } catch (err) {
      console.error("Error saving kriteria:", err);
      setError("Terjadi kesalahan saat menyimpan kriteria.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: Kriteria) => {
    setEditingKriteria(item);
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);

      const { error: deleteError } = await supabase.from("kriteria").delete().eq("id", id).eq("user_id", user?.id);

      if (deleteError) throw deleteError;

      setKriteria(kriteria.filter((k) => k.id !== id));
      if (editingKriteria?.id === id) {
        setEditingKriteria(null);
      }
    } catch (err) {
      console.error("Error deleting kriteria:", err);
      setError("Terjadi kesalahan saat menghapus kriteria.");
    }
  };

  const handleCancel = () => {
    setEditingKriteria(null);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4">Memuat data kriteria...</p>
        </div>
      </div>
    );
  }

  const totalBobot = kriteria.reduce((sum, k) => sum + k.bobot, 0);
  const avgBobot = kriteria.length > 0 ? (totalBobot / kriteria.length).toFixed(1) : "0";

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <PageHeader title="Input Kriteria" description="Tambahkan kriteria yang akan digunakan dalam penilaian bahan kain" />

      {/* Error Alert */}
      {error && (
        <div className="mb-6">
          <AlertBanner type="error" title="Terjadi Kesalahan" description={error} icon={AlertCircle} />
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatsCard title="Total Kriteria" value={kriteria.length} icon={ClipboardList} color="indigo" />
        <StatsCard title="Total Bobot" value={totalBobot} icon={CheckCircle} color="emerald" />
        <StatsCard title="Rata-rata Bobot" value={avgBobot} icon={Shirt} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <KriteriaForm onSubmit={handleSubmit} editData={editingKriteria || undefined} onCancel={editingKriteria ? handleCancel : undefined} loading={saving} />

        {/* Kriteria Cards */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-neutral-700">Daftar Kriteria ({kriteria.length})</h3>
          {kriteria.length === 0 ? (
            <EmptyState icon={ClipboardList} title="Belum ada kriteria yang ditambahkan" description="Mulai dengan menambahkan kriteria di form sebelah kiri" />
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {kriteria.map((item, index) => (
                <KriteriaCard key={item.id} kriteria={item} index={index} onEdit={handleEdit} onDelete={handleDelete} isEditing={editingKriteria?.id === item.id} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      {kriteria.length > 0 && (
        <div className="mt-8">
          <KriteriaTable kriteria={kriteria} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      )}

      {/* Success Alert */}
      {kriteria.length > 0 && (
        <div className="mt-6">
          <AlertBanner type="success" title="Siap untuk langkah selanjutnya" description={`Anda telah menambahkan ${kriteria.length} kriteria. Lanjutkan ke tahap input alternatif bahan kain.`} icon={CheckCircle} />
        </div>
      )}
    </div>
  );
}
