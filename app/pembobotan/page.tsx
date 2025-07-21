"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Save, Scale, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { useAuth } from "@/contexts/AuthContext";
import type { Kriteria } from "@/types";

const bobotOptions = [
  {
    value: "1",
    label: "Tidak Penting",
    description: "Kriteria ini tidak terlalu berpengaruh",
    color: "bg-red-100 text-red-700 border-red-200",
  },
  {
    value: "2",
    label: "Kurang Penting",
    description: "Kriteria ini sedikit berpengaruh",
    color: "bg-orange-100 text-orange-700 border-orange-200",
  },
  {
    value: "3",
    label: "Cukup Penting",
    description: "Kriteria ini cukup berpengaruh",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  {
    value: "4",
    label: "Penting",
    description: "Kriteria ini sangat berpengaruh",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    value: "5",
    label: "Sangat Penting",
    description: "Kriteria ini paling berpengaruh",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
];

interface LocalBobotData {
  [kriteriaId: string]: number;
}

export default function PembobotanPage() {
  const [kriteria, setKriteria] = useState<Kriteria[]>([]);
  const [bobot, setBobot] = useState<LocalBobotData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const { user } = useAuth();
  const supabase = createClient();

  const fetchData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch kriteria
      const { data: kriteriaData, error: kriteriaError } = await supabase.from("kriteria").select("*").eq("user_id", user.id).order("created_at");

      if (kriteriaError) throw kriteriaError;

      const mappedKriteria = (kriteriaData || []).map((item) => ({
        id: item.id,
        nama: item.nama,
        atribut: item.atribut,
        bobot: item.bobot,
      }));

      setKriteria(mappedKriteria);

      // Initialize bobot from existing data
      const bobotInit: LocalBobotData = {};
      mappedKriteria.forEach((k) => {
        bobotInit[k.id] = k.bobot || 3;
      });
      setBobot(bobotInit);
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

  const handleBobotChange = (kriteriaId: string, value: string) => {
    setBobot((prev) => ({
      ...prev,
      [kriteriaId]: Number.parseInt(value),
    }));
    setIsSaved(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // Update bobot for each kriteria
      for (const kriteriaId of Object.keys(bobot)) {
        const { error: updateError } = await supabase.from("kriteria").update({ bobot: bobot[kriteriaId] }).eq("id", kriteriaId).eq("user_id", user?.id);

        if (updateError) throw updateError;
      }

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error("Error saving bobot:", err);
      setError("Terjadi kesalahan saat menyimpan bobot.");
    } finally {
      setSaving(false);
    }
  };

  const getTotalBobot = () => {
    return Object.values(bobot).reduce((sum, b) => sum + b, 0);
  };

  const getNormalizedBobot = (kriteriaId: string) => {
    const total = getTotalBobot();
    return total > 0 ? ((bobot[kriteriaId] / total) * 100).toFixed(1) : "0.0";
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

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-600 mb-2">Data Tidak Tersedia</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => (window.location.href = "/kriteria")}>Tambah Kriteria</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-800 mb-2">Pembobotan Kriteria</h1>
        <p className="text-neutral-600">Tentukan tingkat kepentingan setiap kriteria dalam proses pengambilan keputusan</p>
      </div>

      {/* Summary Card */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{kriteria.length}</div>
              <div className="text-sm text-neutral-600">Total Kriteria</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{getTotalBobot()}</div>
              <div className="text-sm text-neutral-600">Total Bobot</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{kriteria.length > 0 ? (getTotalBobot() / kriteria.length).toFixed(1) : "0.0"}</div>
              <div className="text-sm text-neutral-600">Rata-rata Bobot</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pembobotan Cards */}
      <div className="space-y-6">
        {kriteria.map((krit, index) => (
          <Card key={krit.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold text-neutral-700">
                    {index + 1}. {krit.nama}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 rounded text-xs ${krit.atribut === "Benefit" ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"}`}>{krit.atribut}</span>
                    <span className="text-sm text-neutral-600">Kontribusi: {getNormalizedBobot(krit.id)}%</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-indigo-600">{bobot[krit.id]}</div>
                  <div className="text-sm text-neutral-600">Bobot</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <RadioGroup value={bobot[krit.id]?.toString() || "3"} onValueChange={(value) => handleBobotChange(krit.id, value)} className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {bobotOptions.map((option) => (
                  <div key={option.value} className="relative">
                    <RadioGroupItem value={option.value} id={`${krit.id}-${option.value}`} className="peer sr-only" />
                    <Label
                      htmlFor={`${krit.id}-${option.value}`}
                      className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md peer-checked:ring-2 peer-checked:ring-indigo-500 ${
                        bobot[krit.id]?.toString() === option.value ? `${option.color} border-current` : "bg-white border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-semibold text-sm mb-1">{option.label}</div>
                        <div className="text-xs opacity-75">{option.description}</div>
                        <div className="mt-2">
                          <Scale className="w-4 h-4 mx-auto" />
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Normalized Weights Summary */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-neutral-700">Ringkasan Bobot Ternormalisasi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {kriteria.map((krit) => {
              const normalizedWeight = Number.parseFloat(getNormalizedBobot(krit.id));
              return (
                <div key={krit.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="font-medium text-neutral-800">{krit.nama}</div>
                    <span className={`px-2 py-1 rounded text-xs ${krit.atribut === "Benefit" ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"}`}>{krit.atribut}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-neutral-600">Bobot: {bobot[krit.id] || 3}</div>
                      <div className="text-sm font-medium text-indigo-600">{normalizedWeight}%</div>
                    </div>
                    <div className="w-24 bg-neutral-200 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full transition-all duration-300" style={{ width: `${normalizedWeight}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="mt-8 flex justify-center">
        <Button onClick={handleSave} disabled={saving} className={`px-8 py-3 ${isSaved ? "bg-emerald-600 hover:bg-emerald-700" : "bg-indigo-600 hover:bg-indigo-700"}`}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Menyimpan..." : isSaved ? "Tersimpan!" : "Simpan Pembobotan"}
        </Button>
      </div>

      {isSaved && (
        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div className="flex items-center gap-2 text-emerald-700">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <p className="text-sm font-medium">Pembobotan berhasil disimpan!</p>
          </div>
          <p className="text-sm text-emerald-600 mt-1">Anda dapat melanjutkan ke tahap proses perhitungan TOPSIS.</p>
        </div>
      )}
    </div>
  );
}
