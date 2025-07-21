"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Star, TrendingUp, Download, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { useAuth } from "@/contexts/AuthContext";
import type { HasilPerhitungan } from "@/types";

const getRankingIcon = (ranking: number) => {
  switch (ranking) {
    case 1:
      return <Trophy className="w-6 h-6 text-yellow-600" />;
    case 2:
      return <Medal className="w-6 h-6 text-gray-600" />;
    case 3:
      return <Award className="w-6 h-6 text-orange-600" />;
    default:
      return <Star className="w-6 h-6 text-neutral-600" />;
  }
};

const getRankingBadge = (ranking: number) => {
  const variants = {
    1: "bg-yellow-100 text-yellow-800 border-yellow-300",
    2: "bg-gray-100 text-gray-800 border-gray-300",
    3: "bg-orange-100 text-orange-800 border-orange-300",
    4: "bg-neutral-100 text-neutral-800 border-neutral-300",
  };
  return variants[ranking as keyof typeof variants] || variants[4];
};

const getRankingColor = (ranking: number) => {
  switch (ranking) {
    case 1:
      return "bg-gradient-to-r from-yellow-400 to-yellow-600";
    case 2:
      return "bg-gradient-to-r from-gray-300 to-gray-500";
    case 3:
      return "bg-gradient-to-r from-orange-400 to-orange-600";
    default:
      return "bg-gradient-to-r from-gray-300 to-gray-500";
  }
};

interface HasilWithAlternatif extends HasilPerhitungan {
  alternatif?: {
    nama: string;
  };
}

export default function HasilPage() {
  const [results, setResults] = useState<HasilWithAlternatif[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const supabase = createClient();

  const fetchResults = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const { data: resultsData, error: resultsError } = await supabase
        .from("hasil_perhitungan")
        .select(
          `
          *,
          alternatif:alternatif_id (
            nama
          )
        `
        )
        .eq("user_id", user?.id)
        .order("ranking");

      if (resultsError) throw resultsError;

      if (!resultsData?.length) {
        setError("Belum ada hasil perhitungan. Silakan lakukan perhitungan TOPSIS terlebih dahulu.");
        return;
      }

      setResults(resultsData);
    } catch (err) {
      console.error("Error fetching results:", err);
      setError("Terjadi kesalahan saat mengambil hasil perhitungan.");
    } finally {
      setLoading(false);
    }
  }, [user?.id, supabase]);

  useEffect(() => {
    if (user) {
      fetchResults();
    }
  }, [user, fetchResults]);

  const handleExport = () => {
    window.location.href = "/export";
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4">Memuat hasil perhitungan...</p>
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
            <h3 className="text-lg font-semibold text-red-600 mb-2">Hasil Tidak Tersedia</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => (window.location.href = "/perhitungan")} className="mt-4">
              Mulai Perhitungan
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const winner = results[0];
  const secondPlace = results[1];

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-800 mb-2">Hasil Akhir Pemilihan Bahan Kain</h1>
        <p className="text-neutral-600">Ranking alternatif berdasarkan metode TOPSIS dengan nilai preferensi tertinggi</p>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">Alternatif Terbaik</p>
                <p className="text-lg font-bold text-indigo-600">{winner?.alternatif?.nama}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">Nilai Preferensi</p>
                <p className="text-lg font-bold text-emerald-600">{(winner?.nilai_preferensi * 100).toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">Total Alternatif</p>
                <p className="text-lg font-bold text-orange-600">{results.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Medal className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">Margin Kemenangan</p>
                <p className="text-lg font-bold text-purple-600">{secondPlace ? ((winner.nilai_preferensi - secondPlace.nilai_preferensi) * 100).toFixed(1) : "0"}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ranking Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {results.map((result) => (
          <Card key={result.id} className="relative overflow-hidden border-l-4" style={{ borderLeftColor: result.ranking <= 3 ? "#fbbf24" : "#9ca3af" }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getRankingColor(result.ranking)}`}>{getRankingIcon(result.ranking)}</div>
                  <div>
                    <h3 className="font-bold text-lg text-neutral-800">{result.alternatif?.nama}</h3>
                    <Badge className={`${getRankingBadge(result.ranking)} border`}>Ranking #{result.ranking}</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Nilai Preferensi</span>
                  <span className="font-semibold text-lg text-indigo-600">{(result.nilai_preferensi * 100).toFixed(1)}%</span>
                </div>

                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full transition-all duration-300" style={{ width: `${result.nilai_preferensi * 100}%` }}></div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
                  <div>
                    <span className="text-neutral-500">D+ (Positif)</span>
                    <p className="font-medium">{result.distance_positive.toFixed(4)}</p>
                  </div>
                  <div>
                    <span className="text-neutral-500">D- (Negatif)</span>
                    <p className="font-medium">{result.distance_negative.toFixed(4)}</p>
                  </div>
                </div>
              </div>

              {result.ranking === 1 && (
                <div className="absolute top-2 right-2">
                  <div className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">TERBAIK</div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analysis Summary */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            Rekomendasi & Analisis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-neutral-800 mb-2">{winner?.alternatif?.nama} adalah pilihan terbaik</h3>
            <p className="text-neutral-700 mb-4">
              Berdasarkan analisis menggunakan metode TOPSIS, <strong>{winner?.alternatif?.nama}</strong> memiliki nilai preferensi tertinggi sebesar <strong>{(winner?.nilai_preferensi * 100).toFixed(1)}%</strong>. Alternatif ini dipilih
              karena memiliki jarak terdekat dengan solusi ideal positif dan terjauh dari solusi ideal negatif.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-white rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-neutral-800 mb-2">Keunggulan Utama</h4>
                <p className="text-sm text-neutral-600">Nilai preferensi tertinggi menunjukkan keseimbangan optimal antar kriteria</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-neutral-800 mb-2">Efisiensi</h4>
                <p className="text-sm text-neutral-600">Rasio jarak positif-negatif memberikan efisiensi terbaik</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-neutral-800 mb-2">Konsistensi</h4>
                <p className="text-sm text-neutral-600">Performa konsisten di semua aspek penilaian</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Laporan
        </Button>
        <Button onClick={() => (window.location.href = "/perhitungan")} className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Lihat Perhitungan Detail
        </Button>
      </div>
    </div>
  );
}
