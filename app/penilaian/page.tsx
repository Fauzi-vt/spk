"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { StatsCard } from "@/components/ui/stats-card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { AlertBanner } from "@/components/ui/alert-banner";
import { PenilaianTable } from "@/components/tables/penilaian-table";
import { Card, CardContent } from "@/components/ui/card";
import { Save, AlertCircle, TrendingUp, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { useAuth } from "@/contexts/AuthContext";
import type { Kriteria, Alternatif } from "@/types";

interface LocalPenilaianData {
  [alternatifId: string]: {
    [kriteriaId: string]: number;
  };
}

export default function PenilaianPage() {
  const [kriteria, setKriteria] = useState<Kriteria[]>([]);
  const [alternatif, setAlternatif] = useState<Alternatif[]>([]);
  const [penilaian, setPenilaian] = useState<LocalPenilaianData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const supabase = createClient();

  const fetchData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch kriteria
      const { data: kriteriaData, error: kriteriaError } = await supabase.from("kriteria").select("*").eq("user_id", user.id).order("nama");

      if (kriteriaError) throw kriteriaError;

      // Fetch alternatif
      const { data: alternatifData, error: alternatifError } = await supabase.from("alternatif").select("*").eq("user_id", user?.id).order("nama");

      if (alternatifError) throw alternatifError;

      // Check if we have data
      if (!kriteriaData?.length) {
        setError("Belum ada kriteria yang ditambahkan. Silakan tambahkan kriteria terlebih dahulu.");
        return;
      }

      if (!alternatifData?.length) {
        setError("Belum ada alternatif yang ditambahkan. Silakan tambahkan alternatif terlebih dahulu.");
        return;
      }

      const mappedKriteria = (kriteriaData || []).map((item) => ({
        id: item.id,
        nama: item.nama,
        atribut: item.atribut,
        bobot: item.bobot,
      }));

      const mappedAlternatif = (alternatifData || []).map((item) => ({
        id: item.id,
        nama: item.nama,
        deskripsi: item.deskripsi,
      }));

      setKriteria(mappedKriteria);
      setAlternatif(mappedAlternatif);

      // Fetch existing penilaian
      const { data: penilaianData, error: penilaianError } = await supabase.from("penilaian").select("*").eq("user_id", user.id);

      if (penilaianError) throw penilaianError;

      // Initialize penilaian matrix
      const initialData: LocalPenilaianData = {};
      mappedAlternatif.forEach((alt) => {
        initialData[alt.id] = {};
        mappedKriteria.forEach((krit) => {
          const existingPenilaian = penilaianData?.find((p) => p.alternatif_id === alt.id && p.kriteria_id === krit.id);
          initialData[alt.id][krit.id] = existingPenilaian?.nilai || 0;
        });
      });

      setPenilaian(initialData);

      // Check if all assessments are completed
      const totalRequired = mappedKriteria.length * mappedAlternatif.length;
      const completed = penilaianData?.length || 0;
      setIsSaved(completed === totalRequired && completed > 0);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Terjadi kesalahan saat mengambil data.");
    } finally {
      setLoading(false);
    }
  }, [user?.id, supabase]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  const handleValueChange = (alternatifId: string, kriteriaId: string, value: string) => {
    const numValue = Math.max(0, Math.min(100, Number.parseInt(value) || 0));
    setPenilaian((prev) => ({
      ...prev,
      [alternatifId]: {
        ...prev[alternatifId],
        [kriteriaId]: numValue,
      },
    }));
    setIsSaved(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // Prepare data for upsert
      const penilaianArray = [];
      for (const altId of Object.keys(penilaian)) {
        for (const kritId of Object.keys(penilaian[altId])) {
          if (penilaian[altId][kritId] !== undefined && penilaian[altId][kritId] !== null && penilaian[altId][kritId] >= 0) {
            penilaianArray.push({
              user_id: user?.id,
              alternatif_id: altId,
              kriteria_id: kritId,
              nilai: penilaian[altId][kritId],
            });
          }
        }
      }

      // Delete existing penilaian for this user
      const { error: deleteError } = await supabase.from("penilaian").delete().eq("user_id", user?.id);

      if (deleteError) throw deleteError;

      // Insert new penilaian
      if (penilaianArray.length > 0) {
        const { error: insertError } = await supabase.from("penilaian").insert(penilaianArray);

        if (insertError) throw insertError;
      }

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error("Error saving penilaian:", err);
      setError("Terjadi kesalahan saat menyimpan penilaian.");
    } finally {
      setSaving(false);
    }
  };

  const isComplete = () => {
    return alternatif.every((alt) => kriteria.every((krit) => penilaian[alt.id]?.[krit.id] !== undefined && penilaian[alt.id]?.[krit.id] !== null));
  };

  const getCompletionPercentage = () => {
    const total = alternatif.length * kriteria.length;
    const filled = alternatif.reduce((acc, alt) => acc + kriteria.filter((krit) => penilaian[alt.id]?.[krit.id] !== undefined && penilaian[alt.id]?.[krit.id] !== null).length, 0);
    return Math.round((filled / total) * 100);
  };

  const getFilledCount = () => {
    return alternatif.reduce((acc, alt) => acc + kriteria.filter((krit) => penilaian[alt.id]?.[krit.id] !== undefined && penilaian[alt.id]?.[krit.id] !== null).length, 0);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4">Memuat data penilaian...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-600 mb-2">Data Tidak Tersedia</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => (window.location.href = "/kriteria")}>Tambah Kriteria</Button>
              <Button onClick={() => (window.location.href = "/alternatif")} variant="outline">
                Tambah Alternatif
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalCells = alternatif.length * kriteria.length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <PageHeader title="Penilaian Alternatif terhadap Kriteria" description="Berikan nilai untuk setiap alternatif berdasarkan kriteria yang telah ditentukan (0-100)" />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Total Penilaian" value={`${getFilledCount()}/${totalCells}`} icon={TrendingUp} color="indigo" />
        <StatsCard title="Progress" value={`${getCompletionPercentage()}%`} icon={CheckCircle} color="emerald" />
        <StatsCard title="Alternatif" value={alternatif.length} icon={AlertCircle} color="orange" />
        <StatsCard title="Kriteria" value={kriteria.length} icon={Save} color="purple" />
      </div>

      {/* Progress Card */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-neutral-800">Progress Penilaian</h3>
              <p className="text-sm text-neutral-600">
                {getCompletionPercentage()}% selesai ({alternatif.length} alternatif × {kriteria.length} kriteria)
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-indigo-600">{getCompletionPercentage()}%</div>
            </div>
          </div>
          <ProgressBar value={getCompletionPercentage()} color="indigo" showLabel={false} className="w-full" />
        </CardContent>
      </Card>

      {/* Penilaian Table */}
      <PenilaianTable kriteria={kriteria} alternatif={alternatif} penilaian={penilaian} onValueChange={handleValueChange} />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {kriteria.map((krit) => {
          const values = alternatif.map((alt) => penilaian[alt.id]?.[krit.id] || 0);
          const avg = values.reduce((a: number, b: number) => a + b, 0) / values.length;
          const max = Math.max(...values);
          const min = Math.min(...values);

          return (
            <Card key={krit.id}>
              <CardContent className="pt-4">
                <h4 className="font-semibold text-neutral-800 mb-2">{krit.nama}</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Rata-rata:</span>
                    <span className="font-medium">{avg.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Tertinggi:</span>
                    <span className="font-medium text-emerald-600">{max}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Terendah:</span>
                    <span className="font-medium text-orange-600">{min}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-center">
        <Button onClick={handleSave} disabled={!isComplete() || saving} className={`px-8 py-3 ${isSaved ? "bg-emerald-600 hover:bg-emerald-700" : "bg-indigo-600 hover:bg-indigo-700"}`}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Menyimpan..." : isSaved ? "Tersimpan!" : "Simpan Penilaian"}
        </Button>
      </div>

      {/* Alert */}
      {!isComplete() && (
        <div className="mt-4">
          <AlertBanner type="warning" title="Lengkapi semua penilaian sebelum menyimpan" description={`Masih ada ${totalCells - getFilledCount()} nilai yang belum diisi.`} icon={AlertCircle} />
        </div>
      )}
    </div>
  );
}
