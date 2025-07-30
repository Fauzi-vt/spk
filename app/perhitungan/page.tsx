"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { useAuth } from "@/contexts/AuthContext";
import type { Kriteria, Alternatif, PenilaianData } from "@/types";

export default function PerhitunganPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);
  const [kriteria, setKriteria] = useState<Kriteria[]>([]);
  const [alternatif, setAlternatif] = useState<Alternatif[]>([]);
  const [penilaian, setPenilaian] = useState<{ [key: string]: { [key: string]: number } }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const supabase = createClient();

  const fetchData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch kriteria
      const { data: kriteriaData, error: kriteriaError } = await supabase.from("kriteria").select("*").eq("user_id", user.id);

      if (kriteriaError) throw kriteriaError;

      // Fetch alternatif
      const { data: alternatifData, error: alternatifError } = await supabase.from("alternatif").select("*").eq("user_id", user.id);

      if (alternatifError) throw alternatifError;

      // Fetch penilaian
      const { data: penilaianData, error: penilaianError } = await supabase.from("penilaian").select("*").eq("user_id", user.id);

      if (penilaianError) throw penilaianError;

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

      // Custom sorting for kriteria to match penilaian page order
      const kriteriaPositionMap: Record<string, number> = {
        "kualitas": 0,
        "daya serap": 1,
        "tekstur": 2,
        "tesktur": 2,  // Actual database name (missing 'r')
        "harga permeter": 3,
        "ketersediaan di pasar": 4,
        "ramah lingkungan": 5,
        "kemudahan proses produksi batik": 6,
        
        "Kualitas": 0,
        "Daya serap": 1,
        "Tekstur": 2,
        "Tesktur": 2,  // Actual database name (missing 'r')
        "Harga permeter": 3,
        "Ketersediaan di pasar": 4,
        "Ramah lingkungan": 5,
        "Kemudahan proses produksi batik": 6,
      };

      const getKriteriaIndex = (kriteriaName: string) => {
        if (kriteriaPositionMap[kriteriaName] !== undefined) {
          return kriteriaPositionMap[kriteriaName];
        }
        
        const lowerName = kriteriaName.toLowerCase().trim();
        if (kriteriaPositionMap[lowerName] !== undefined) {
          return kriteriaPositionMap[lowerName];
        }
        
        if (lowerName.includes("kualitas")) return 0;
        if (lowerName.includes("daya") && lowerName.includes("serap")) return 1;
        if (lowerName.includes("tekstur") || lowerName.includes("tesktur")) return 2;
        if (lowerName.includes("harga")) return 3;
        if (lowerName.includes("ketersediaan")) return 4;
        if (lowerName.includes("ramah")) return 5;
        if (lowerName.includes("kemudahan") || lowerName.includes("proses") || lowerName.includes("produksi")) return 6;
        
        return 999;
      };

      // Custom sorting for alternatif to match penilaian page order
      const alternatifPositionMap: Record<string, number> = {
        "Kain primisima": 0,
        "katun biasa": 1,
        "Kain doby": 2,
        "kain viscose": 3,
        "kain sutra": 4,
        "poliester": 5,
        "rayon": 6,
      };

      const getAlternatifIndex = (alternatifName: string) => {
        if (alternatifPositionMap[alternatifName] !== undefined) {
          return alternatifPositionMap[alternatifName];
        }
        
        const lowerName = alternatifName.toLowerCase().trim();
        const matchingKey = Object.keys(alternatifPositionMap).find(key => key.toLowerCase() === lowerName);
        if (matchingKey) {
          return alternatifPositionMap[matchingKey];
        }
        
        if (lowerName.includes("primisma") || lowerName.includes("prisma")) return 0;
        if (lowerName.includes("katun") && (lowerName.includes("biasa") || !lowerName.includes("dobi"))) return 1;
        if (lowerName.includes("doby") || lowerName.includes("dobi")) return 2;
        if (lowerName.includes("viscose")) return 3;
        if (lowerName.includes("sutra")) return 4;
        if (lowerName.includes("poliester") || lowerName.includes("polyester")) return 5;
        if (lowerName.includes("rayon")) return 6;
        
        return 999;
      };

      const sortedKriteria = mappedKriteria.sort((a, b) => {
        const indexA = getKriteriaIndex(a.nama);
        const indexB = getKriteriaIndex(b.nama);
        return indexA - indexB;
      });

      const sortedAlternatif = mappedAlternatif.sort((a, b) => {
        const indexA = getAlternatifIndex(a.nama);
        const indexB = getAlternatifIndex(b.nama);
        return indexA - indexB;
      });

      // Check if we have complete data
      if (!sortedKriteria.length) {
        setError("Belum ada kriteria yang ditambahkan. Silakan tambahkan kriteria terlebih dahulu.");
        return;
      }

      if (!sortedAlternatif.length) {
        setError("Belum ada alternatif yang ditambahkan. Silakan tambahkan alternatif terlebih dahulu.");
        return;
      }

      if (!penilaianData?.length) {
        setError("Belum ada penilaian yang dilakukan. Silakan lakukan penilaian terlebih dahulu.");
        return;
      }

      // Check if all combinations are assessed
      const expectedAssessments = sortedKriteria.length * sortedAlternatif.length;
      console.log("Pengecekan penilaian:", {
        kriteriaCount: sortedKriteria.length,
        alternatifCount: sortedAlternatif.length,
        expectedAssessments,
        actualAssessments: penilaianData.length,
        penilaianData,
      });

      if (penilaianData.length < expectedAssessments) {
        setError(`Penilaian belum lengkap. Diperlukan ${expectedAssessments} penilaian (${sortedKriteria.length} kriteria × ${sortedAlternatif.length} alternatif), saat ini hanya ada ${penilaianData.length}.`);
        return;
      }

      setKriteria(sortedKriteria);
      setAlternatif(sortedAlternatif);

      // Convert penilaian to the expected format
      const penilaianMap: { [key: string]: { [key: string]: number } } = {};
      penilaianData.forEach((p: PenilaianData) => {
        if (!penilaianMap[p.alternatif_id]) {
          penilaianMap[p.alternatif_id] = {};
        }
        penilaianMap[p.alternatif_id][p.kriteria_id] = p.nilai;
      });

      setPenilaian(penilaianMap);
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

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4">Memuat data...</p>
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
            <h3 className="text-lg font-semibold text-red-600 mb-2">Data Tidak Lengkap</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Pastikan Anda sudah menambahkan kriteria, alternatif, dan melakukan penilaian lengkap.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate normalized matrix
  const calculateNormalizedMatrix = () => {
    const normalized: { [key: string]: { [key: string]: number } } = {};

    kriteria.forEach((kriteriaItem) => {
      // Calculate sum of squares for each criteria
      const sumOfSquares = alternatif.reduce((sum, alt) => {
        const value = penilaian[alt.id][kriteriaItem.id];
        if (value !== undefined && value !== null && !isNaN(value)) {
          return sum + value * value;
        }
        return sum;
      }, 0);

      const sqrtSum = Math.sqrt(sumOfSquares);

      // Normalize each value
      alternatif.forEach((alt) => {
        if (!normalized[alt.id]) normalized[alt.id] = {};

        const value = penilaian[alt.id][kriteriaItem.id];
        if (sqrtSum > 0 && value !== undefined && value !== null && !isNaN(value)) {
          normalized[alt.id][kriteriaItem.id] = value / sqrtSum;
        } else {
          // Handle edge case: if sqrtSum is 0, use equal distribution
          normalized[alt.id][kriteriaItem.id] = 1 / Math.sqrt(alternatif.length);
        }
      });
    });

    return normalized;
  };

  // Calculate weighted normalized matrix
  const calculateWeightedMatrix = (normalizedMatrix: { [key: string]: { [key: string]: number } }) => {
    const weighted: { [key: string]: { [key: string]: number } } = {};

    alternatif.forEach((alt) => {
      weighted[alt.id] = {};
      kriteria.forEach((kriteriaItem) => {
        // Use weight directly without normalizing (to match Excel)
        const weight = kriteriaItem.bobot;
        const normalizedValue = normalizedMatrix[alt.id][kriteriaItem.id];

        if (!isNaN(normalizedValue) && !isNaN(weight)) {
          weighted[alt.id][kriteriaItem.id] = normalizedValue * weight;
        } else {
          weighted[alt.id][kriteriaItem.id] = 0;
        }
      });
    });

    return weighted;
  };

  // Calculate ideal solutions
  const calculateIdealSolutions = (weightedMatrix: { [key: string]: { [key: string]: number } }) => {
    const idealPositive: { [key: string]: number } = {};
    const idealNegative: { [key: string]: number } = {};

    kriteria.forEach((kriteriaItem) => {
      const values = alternatif.map((alt) => weightedMatrix[alt.id][kriteriaItem.id]).filter((value) => !isNaN(value) && value !== undefined && value !== null);

      if (values.length === 0) {
        // Fallback if no valid values
        idealPositive[kriteriaItem.id] = 0;
        idealNegative[kriteriaItem.id] = 0;
        return;
      }

      if (kriteriaItem.atribut === "Benefit") {
        idealPositive[kriteriaItem.id] = Math.max(...values);
        idealNegative[kriteriaItem.id] = Math.min(...values);
      } else {
        idealPositive[kriteriaItem.id] = Math.min(...values);
        idealNegative[kriteriaItem.id] = Math.max(...values);
      }
    });

    console.log("Ideal Solutions:", { idealPositive, idealNegative });
    return { idealPositive, idealNegative };
  };

  // Calculate final TOPSIS results
  const calculateFinalResults = async (weightedMatrix: { [key: string]: { [key: string]: number } }, idealPositive: { [key: string]: number }, idealNegative: { [key: string]: number }) => {
    const results: Array<{
      alternatif_id: string;
      distance_positive: number;
      distance_negative: number;
      nilai_preferensi: number;
      ranking: number;
    }> = [];

    // Calculate distances and preference values
    alternatif.forEach((alt) => {
      let distancePositive = 0;
      let distanceNegative = 0;

      kriteria.forEach((krit) => {
        const value = weightedMatrix[alt.id][krit.id];
        if (value !== undefined && value !== null && !isNaN(value)) {
          distancePositive += Math.pow(value - idealPositive[krit.id], 2);
          distanceNegative += Math.pow(value - idealNegative[krit.id], 2);
        }
      });

      distancePositive = Math.sqrt(distancePositive);
      distanceNegative = Math.sqrt(distanceNegative);

      // Handle edge cases to prevent NaN or Infinity
      let nilaiPreferensi = 0;
      const totalDistance = distancePositive + distanceNegative;

      if (totalDistance > 0 && !isNaN(totalDistance)) {
        nilaiPreferensi = distanceNegative / totalDistance;
      } else if (distanceNegative === 0 && distancePositive === 0) {
        // Both distances are 0, meaning perfect match - assign highest score
        nilaiPreferensi = 1;
      } else if (distancePositive === 0) {
        // Perfect match to ideal positive
        nilaiPreferensi = 1;
      } else {
        // Default fallback
        nilaiPreferensi = 0;
      }

      // Ensure the value is a valid number between 0 and 1
      if (isNaN(nilaiPreferensi) || nilaiPreferensi < 0 || nilaiPreferensi > 1) {
        nilaiPreferensi = 0;
      }

      console.log(`Alternatif ${alt.nama}:`, {
        distancePositive: distancePositive.toFixed(3),
        distanceNegative: distanceNegative.toFixed(3),
        totalDistance: totalDistance.toFixed(3),
        nilaiPreferensi: nilaiPreferensi.toFixed(3),
      });

      results.push({
        alternatif_id: alt.id,
        distance_positive: distancePositive,
        distance_negative: distanceNegative,
        nilai_preferensi: nilaiPreferensi,
        ranking: 0, // Will be set after sorting
      });
    });

    // Sort by preference value (descending) and assign rankings
    results.sort((a, b) => b.nilai_preferensi - a.nilai_preferensi);
    results.forEach((result, index) => {
      result.ranking = index + 1;
    });

    // Save results to database
    try {
      console.log("Menyimpan hasil perhitungan:", results);

      // First, delete existing results for this user
      await supabase.from("hasil_perhitungan").delete().eq("user_id", user?.id);

      // Insert new results
      const { error: insertError } = await supabase.from("hasil_perhitungan").insert(
        results.map((result) => ({
          ...result,
          user_id: user?.id,
          created_at: new Date().toISOString(),
        }))
      );

      if (insertError) {
        console.error("Error inserting hasil_perhitungan:", insertError);
        throw insertError;
      }

      console.log("Hasil perhitungan berhasil disimpan");
      return results;
    } catch (err) {
      console.error("Error saving TOPSIS results:", err);
      throw err;
    }
  };

  const normalizedMatrix = calculateNormalizedMatrix();
  const weightedMatrix = calculateWeightedMatrix(normalizedMatrix);
  const { idealPositive, idealNegative } = calculateIdealSolutions(weightedMatrix);

  const handleNextStep = async () => {
    if (currentStep < 4) {
      setIsCalculating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsCalculating(false);
      }, 1500);
    }
  };

  const handleCalculateResults = async () => {
    try {
      setIsCalculating(true);
      setError(null);
      await calculateFinalResults(weightedMatrix, idealPositive, idealNegative);
      setCurrentStep(5); // Move to final step
    } catch (err) {
      console.error("Error calculating final results:", err);
      setError("Terjadi kesalahan saat menyimpan hasil perhitungan.");
    } finally {
      setIsCalculating(false);
    }
  };

  const steps = [
    { id: 1, title: "Matriks Keputusan", description: "Data penilaian alternatif" },
    { id: 2, title: "Normalisasi", description: "Normalisasi matriks keputusan" },
    { id: 3, title: "Pembobotan", description: "Matriks ternormalisasi terbobot" },
    { id: 4, title: "Solusi Ideal", description: "Solusi ideal positif dan negatif" },
    { id: 5, title: "Hasil Akhir", description: "Ranking dan nilai preferensi" },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="responsive-text-xl font-bold tracking-tight text-neutral-800 mb-2">Proses Perhitungan TOPSIS</h1>
        <p className="responsive-text-sm text-neutral-600">Ikuti langkah-langkah perhitungan metode TOPSIS untuk mendapatkan hasil akhir</p>
      </div>

      {/* Progress Steps - Mobile Optimized */}
      <Card className="mb-4 md:mb-6">
        <CardContent className="pt-4 md:pt-6">
          {/* Mobile Progress - Vertical */}
          <div className="block md:hidden">
            <div className="space-y-3">
              {steps.map((step) => (
                <div key={step.id} className={`flex items-center p-3 rounded-lg ${currentStep >= step.id ? "bg-indigo-50 border border-indigo-200" : "bg-neutral-50"}`}>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${currentStep >= step.id ? "bg-indigo-600 border-indigo-600 text-white" : "border-neutral-300 text-neutral-400"}`}>
                    {currentStep > step.id ? <CheckCircle className="w-4 h-4" /> : <span className="text-xs font-medium">{step.id}</span>}
                  </div>
                  <div className="ml-3 min-w-0 flex-1">
                    <div className={`text-sm font-medium ${currentStep >= step.id ? "text-neutral-800" : "text-neutral-400"}`}>{step.title}</div>
                    <div className="text-xs text-neutral-500">{step.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Progress - Horizontal */}
          <div className="hidden md:flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep >= step.id ? "bg-indigo-600 border-indigo-600 text-white" : "border-neutral-300 text-neutral-400"}`}>
                  {currentStep > step.id ? <CheckCircle className="w-5 h-5" /> : <span className="text-sm font-medium">{step.id}</span>}
                </div>
                <div className="ml-3">
                  <div className={`text-sm font-medium ${currentStep >= step.id ? "text-neutral-800" : "text-neutral-400"}`}>{step.title}</div>
                  <div className="text-xs text-neutral-500">{step.description}</div>
                </div>
                {index < steps.length - 1 && <ArrowRight className="w-5 h-5 text-neutral-300 mx-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="responsive-text-lg font-semibold text-neutral-700">Langkah 1: Matriks Keputusan</CardTitle>
            <p className="responsive-text-xs text-neutral-600">Matriks yang berisi penilaian setiap alternatif terhadap kriteria</p>
          </CardHeader>
          <CardContent>
            {/* Mobile Card View */}
            <div className="mobile-card-layout space-y-4">
              {alternatif.map((alt) => (
                <Card key={alt.id} className="border border-neutral-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-neutral-800 mb-3">{alt.nama}</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {kriteria.map((kriteriaItem) => (
                        <div key={kriteriaItem.id} className="flex justify-between items-center">
                          <span className="text-sm text-neutral-600 truncate pr-2">{kriteriaItem.nama}</span>
                          <span className="font-medium">{penilaian[alt.id][kriteriaItem.id]}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="desktop-table-layout table-mobile-scroll">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Alternatif</TableHead>
                    {kriteria.map((kriteriaItem) => (
                      <TableHead key={kriteriaItem.id} className="text-center">
                        <div>
                          <div className="font-semibold">{kriteriaItem.nama}</div>
                          <div className="text-xs text-neutral-500">({kriteriaItem.atribut})</div>
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alternatif.map((alt) => (
                    <TableRow key={alt.id}>
                      <TableCell className="font-medium">{alt.nama}</TableCell>
                      {kriteria.map((kriteriaItem) => (
                        <TableCell key={kriteriaItem.id} className="text-center">
                          {penilaian[alt.id][kriteriaItem.id]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="responsive-text-lg font-semibold text-neutral-700">Langkah 2: Normalisasi Matriks</CardTitle>
            <p className="responsive-text-xs text-neutral-600">
              Normalisasi menggunakan rumus: r<sub>ij</sub> = x<sub>ij</sub> / √(Σx<sub>ij</sub>²)
            </p>
          </CardHeader>
          <CardContent>
            {/* Mobile Card View */}
            <div className="mobile-card-layout space-y-4">
              {alternatif.map((alt) => (
                <Card key={alt.id} className="border border-neutral-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-neutral-800 mb-3">{alt.nama}</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {kriteria.map((kriteriaItem) => (
                        <div key={kriteriaItem.id} className="flex justify-between items-center py-1">
                          <span className="text-sm text-neutral-600 truncate pr-2">{kriteriaItem.nama}</span>
                          <span className="font-mono text-sm">{normalizedMatrix[alt.id][kriteriaItem.id].toFixed(4)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="desktop-table-layout table-mobile-scroll">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Alternatif</TableHead>
                    {kriteria.map((kriteriaItem) => (
                      <TableHead key={kriteriaItem.id} className="text-center">
                        {kriteriaItem.nama}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alternatif.map((alt) => (
                    <TableRow key={alt.id}>
                      <TableCell className="font-medium">{alt.nama}</TableCell>
                      {kriteria.map((kriteriaItem) => (
                        <TableCell key={kriteriaItem.id} className="text-center font-mono text-sm">
                          {normalizedMatrix[alt.id][kriteriaItem.id].toFixed(4)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="responsive-text-lg font-semibold text-neutral-700">Langkah 3: Matriks Ternormalisasi Terbobot</CardTitle>
            <p className="responsive-text-xs text-neutral-600">Mengalikan matriks ternormalisasi dengan bobot kriteria</p>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h4 className="font-medium text-neutral-800 mb-2">Bobot Kriteria:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-wrap gap-2 text-sm">
                {kriteria.map((kriteriaItem) => {
                  const totalBobot = kriteria.reduce((sum, k) => sum + k.bobot, 0);
                  const normalizedBobot = ((kriteriaItem.bobot / totalBobot) * 100).toFixed(1);
                  return (
                    <span key={kriteriaItem.id} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-center">
                      {kriteriaItem.nama}: {normalizedBobot}%
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="mobile-card-layout space-y-4">
              {alternatif.map((alt) => (
                <Card key={alt.id} className="border border-neutral-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-neutral-800 mb-3">{alt.nama}</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {kriteria.map((kriteriaItem) => (
                        <div key={kriteriaItem.id} className="flex justify-between items-center py-1">
                          <span className="text-sm text-neutral-600 truncate pr-2">{kriteriaItem.nama}</span>
                          <span className="font-mono text-sm">{weightedMatrix[alt.id][kriteriaItem.id].toFixed(4)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="desktop-table-layout table-mobile-scroll">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Alternatif</TableHead>
                    {kriteria.map((kriteriaItem) => (
                      <TableHead key={kriteriaItem.id} className="text-center">
                        {kriteriaItem.nama}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alternatif.map((alt) => (
                    <TableRow key={alt.id}>
                      <TableCell className="font-medium">{alt.nama}</TableCell>
                      {kriteria.map((kriteriaItem) => (
                        <TableCell key={kriteriaItem.id} className="text-center">
                          {weightedMatrix[alt.id][kriteriaItem.id].toFixed(4)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-neutral-700">Langkah 4: Solusi Ideal Positif dan Negatif</CardTitle>
            <p className="text-sm text-neutral-600">Menentukan solusi ideal positif (A+) dan solusi ideal negatif (A-)</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 text-emerald-700">Solusi Ideal Positif (A+)</h4>
                <div className="space-y-2">
                  {kriteria.map((kriteriaItem) => (
                    <div key={kriteriaItem.id} className="flex justify-between items-center p-2 bg-emerald-50 rounded">
                      <span className="text-sm">{kriteriaItem.nama}</span>
                      <span className="font-medium text-emerald-700">{idealPositive[kriteriaItem.id].toFixed(4)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3 text-red-700">Solusi Ideal Negatif (A-)</h4>
                <div className="space-y-2">
                  {kriteria.map((kriteriaItem) => (
                    <div key={kriteriaItem.id} className="flex justify-between items-center p-2 bg-red-50 rounded">
                      <span className="text-sm">{kriteriaItem.nama}</span>
                      <span className="font-medium text-red-700">{idealNegative[kriteriaItem.id].toFixed(4)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Button */}
      <div className="mt-6 md:mt-8 flex justify-center">
        {currentStep < 4 ? (
          <Button onClick={handleNextStep} disabled={isCalculating} className="w-full sm:w-auto px-6 md:px-8 py-3 bg-indigo-600 hover:bg-indigo-700">
            {isCalculating ? (
              <>
                <Calculator className="w-4 h-4 mr-2 animate-spin" />
                Menghitung...
              </>
            ) : (
              <>
                <Calculator className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Lanjutkan Perhitungan</span>
                <span className="sm:hidden">Lanjutkan</span>
              </>
            )}
          </Button>
        ) : currentStep === 4 ? (
          <Button onClick={handleCalculateResults} disabled={isCalculating} className="w-full sm:w-auto px-6 md:px-8 py-3 bg-emerald-600 hover:bg-emerald-700">
            {isCalculating ? (
              <>
                <Calculator className="w-4 h-4 mr-2 animate-spin" />
                <span className="hidden sm:inline">Menyimpan Hasil...</span>
                <span className="sm:hidden">Menyimpan...</span>
              </>
            ) : (
              <>
                <Calculator className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Hitung & Simpan Hasil</span>
                <span className="sm:hidden">Hitung Hasil</span>
              </>
            )}
          </Button>
        ) : (
          <Button onClick={() => (window.location.href = "/hasil")} className="w-full sm:w-auto px-6 md:px-8 py-3 bg-emerald-600 hover:bg-emerald-700">
            <ArrowRight className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Lihat Hasil Akhir</span>
            <span className="sm:hidden">Lihat Hasil</span>
          </Button>
        )}
      </div>

      {currentStep === 4 && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-blue-700">
            <Calculator className="w-4 h-4" />
            <p className="text-sm font-medium">Siap menghitung hasil final TOPSIS</p>
          </div>
          <p className="text-sm text-blue-600 mt-1">Klik tombol di atas untuk menghitung jarak ke solusi ideal dan ranking akhir alternatif.</p>
        </div>
      )}

      {currentStep === 5 && (
        <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle className="w-4 h-4" />
            <p className="text-sm font-medium">Perhitungan TOPSIS selesai!</p>
          </div>
          <p className="text-sm text-emerald-600 mt-1">Hasil perhitungan telah disimpan. Lanjutkan ke halaman hasil untuk melihat ranking akhir.</p>
        </div>
      )}
    </div>
  );
}
