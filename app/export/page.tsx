"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, FileText, Calendar, User, Printer, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { useAuth } from "@/contexts/AuthContext";
import { AlertBanner } from "@/components/ui/alert-banner";

interface ReportData {
  metadata: {
    title: string;
    subtitle: string;
    generatedAt: Date;
    generatedBy: string;
    totalKriteria: number;
    totalAlternatif: number;
  };
  kriteria: Array<{
    nama: string;
    bobot: number;
    atribut: string;
    bobotNormal: string;
  }>;
  alternatif: Array<{
    nama: string;
    ranking: number;
    nilaiPreferensi: number;
  }>;
  penilaian: Record<string, Record<string, number>>;
}

export default function ExportPage() {
  const [exportFormat, setExportFormat] = useState<"pdf" | "csv" | "excel">("pdf");
  const [isExporting, setIsExporting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  const { user } = useAuth();
  const supabase = createClient();

  const fetchReportData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch kriteria
      const { data: kriteriaData, error: kriteriaError } = await supabase.from("kriteria").select("*").eq("user_id", user?.id);

      if (kriteriaError) throw kriteriaError;

      // Fetch alternatif
      const { data: alternatifData, error: alternatifError } = await supabase.from("alternatif").select("*").eq("user_id", user?.id);

      if (alternatifError) throw alternatifError;

      // Fetch hasil perhitungan
      const { data: hasilData, error: hasilError } = await supabase
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

      if (hasilError) throw hasilError;

      // Fetch penilaian
      const { data: penilaianData, error: penilaianError } = await supabase
        .from("penilaian")
        .select(
          `
          *,
          alternatif:alternatif_id (nama),
          kriteria:kriteria_id (nama)
        `
        )
        .eq("user_id", user?.id);

      if (penilaianError) throw penilaianError;

      if (!kriteriaData?.length || !alternatifData?.length) {
        setError("Belum ada data yang tersedia untuk diekspor. Silakan lengkapi data kriteria, alternatif, dan perhitungan terlebih dahulu.");
        return;
      }

      // Custom sorting for kriteria to match other pages
      const kriteriaPositionMap: Record<string, number> = {
        "kualitas": 0, "daya serap": 1, "tekstur": 2, "tesktur": 2,
        "harga permeter": 3, "ketersediaan di pasar": 4, "ramah lingkungan": 5,
        "kemudahan proses produksi batik": 6,
        "Kualitas": 0, "Daya serap": 1, "Tekstur": 2, "Tesktur": 2,
        "Harga permeter": 3, "Ketersediaan di pasar": 4, "Ramah lingkungan": 5,
        "Kemudahan proses produksi batik": 6,
      };

      const getKriteriaIndex = (kriteriaName: string) => {
        if (kriteriaPositionMap[kriteriaName] !== undefined) return kriteriaPositionMap[kriteriaName];
        const lowerName = kriteriaName.toLowerCase().trim();
        if (kriteriaPositionMap[lowerName] !== undefined) return kriteriaPositionMap[lowerName];
        if (lowerName.includes("kualitas")) return 0;
        if (lowerName.includes("daya") && lowerName.includes("serap")) return 1;
        if (lowerName.includes("tekstur") || lowerName.includes("tesktur")) return 2;
        if (lowerName.includes("harga")) return 3;
        if (lowerName.includes("ketersediaan")) return 4;
        if (lowerName.includes("ramah")) return 5;
        if (lowerName.includes("kemudahan") || lowerName.includes("proses") || lowerName.includes("produksi")) return 6;
        return 999;
      };

      // Custom sorting for alternatif to match other pages
      const alternatifPositionMap: Record<string, number> = {
        "Kain primisima": 0, "katun biasa": 1, "Kain doby": 2,
        "kain viscose": 3, "kain sutra": 4, "poliester": 5, "rayon": 6,
      };

      const getAlternatifIndex = (alternatifName: string) => {
        if (alternatifPositionMap[alternatifName] !== undefined) return alternatifPositionMap[alternatifName];
        const lowerName = alternatifName.toLowerCase().trim();
        const matchingKey = Object.keys(alternatifPositionMap).find(key => key.toLowerCase() === lowerName);
        if (matchingKey) return alternatifPositionMap[matchingKey];
        if (lowerName.includes("primisma") || lowerName.includes("prisma")) return 0;
        if (lowerName.includes("katun") && (lowerName.includes("biasa") || !lowerName.includes("dobi"))) return 1;
        if (lowerName.includes("doby") || lowerName.includes("dobi")) return 2;
        if (lowerName.includes("viscose")) return 3;
        if (lowerName.includes("sutra")) return 4;
        if (lowerName.includes("poliester") || lowerName.includes("polyester")) return 5;
        if (lowerName.includes("rayon")) return 6;
        return 999;
      };

      const sortedKriteriaData = kriteriaData.sort((a, b) => getKriteriaIndex(a.nama) - getKriteriaIndex(b.nama));
      const sortedAlternatifData = alternatifData.sort((a, b) => getAlternatifIndex(a.nama) - getAlternatifIndex(b.nama));

      // Calculate normalized weights
      const totalBobot = sortedKriteriaData.reduce((sum, k) => sum + k.bobot, 0);

      // Build report data
      const reportData: ReportData = {
        metadata: {
          title: "Laporan Sistem Pendukung Keputusan Pemilihan Bahan Kain",
          subtitle: "Menggunakan Metode TOPSIS (Technique for Order Preference by Similarity to Ideal Solution)",
          generatedAt: new Date(),
          generatedBy: user?.email || "User",
          totalKriteria: sortedKriteriaData.length,
          totalAlternatif: sortedAlternatifData.length,
        },
        kriteria: sortedKriteriaData.map((k) => ({
          nama: k.nama,
          bobot: k.bobot,
          atribut: k.atribut,
          bobotNormal: totalBobot > 0 ? ((k.bobot / totalBobot) * 100).toFixed(1) + "%" : "0%",
        })),
        alternatif:
          hasilData?.map((h) => ({
            nama: h.alternatif?.nama || "Unknown",
            ranking: h.ranking,
            nilaiPreferensi: h.nilai_preferensi,
          })) || [],
        penilaian: {},
      };

      // Build penilaian matrix
      if (penilaianData) {
        for (const p of penilaianData) {
          const altNama = p.alternatif?.nama;
          const kritNama = p.kriteria?.nama;
          if (altNama && kritNama) {
            if (!reportData.penilaian[altNama]) {
              reportData.penilaian[altNama] = {};
            }
            reportData.penilaian[altNama][kritNama] = p.nilai;
          }
        }
      }

      setReportData(reportData);
    } catch (err) {
      console.error("Error fetching report data:", err);
      setError("Terjadi kesalahan saat mengambil data laporan.");
    } finally {
      setLoading(false);
    }
  }, [user?.id, user?.email, supabase]);

  useEffect(() => {
    if (user) {
      fetchReportData();
    }
  }, [user, fetchReportData]);

  const generatePDFContent = (
    kriteria: Array<{
      nama: string;
      bobot: number;
      atribut: string;
    }>,
    alternatif: string[],
    penilaian: Record<string, Record<string, number>>,
    penilaianMatrix: number[][],
    normalisasi: number[][],
    terbobot: number[][],
    idealPositif: number[],
    idealNegatif: number[],
    dPlus: number[],
    dMinus: number[],
    preferensi: number[],
    metadata: {
      generatedBy: string;
    }
  ) => {
    const rankingData = preferensi
      .map((v, i) => ({
        nama: alternatif[i],
        preferensi: v,
      }))
      .sort((a, b) => b.preferensi - a.preferensi);

    return `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan TOPSIS - Pemilihan Bahan Kain</title>
    <style>
        @page {
            margin: 20mm;
            size: A4;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 210mm;
            margin: 0 auto;
            background: white;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
        }
        .header h1 {
            font-size: 24px;
            margin: 0;
            color: #1e40af;
        }
        .header p {
            font-size: 14px;
            color: #6b7280;
            margin: 5px 0;
        }
        .section {
            margin-bottom: 25px;
            page-break-inside: avoid;
        }
        .section h2 {
            font-size: 18px;
            color: #1e40af;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 8px;
            margin-bottom: 15px;
        }
        .section h3 {
            font-size: 16px;
            color: #374151;
            margin-bottom: 10px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 12px;
        }
        th, td {
            border: 1px solid #d1d5db;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f3f4f6;
            font-weight: 600;
            color: #374151;
        }
        .number {
            text-align: right;
        }
        .center {
            text-align: center;
        }
        .summary {
            background-color: #f0f9ff;
            border: 1px solid #bae6fd;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
        }
        .highlight {
            background-color: #fef3c7;
            font-weight: bold;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
            padding-top: 15px;
        }
        @media print {
            body { margin: 0; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>LAPORAN SISTEM PENDUKUNG KEPUTUSAN</h1>
        <h1>PEMILIHAN BAHAN KAIN TERBAIK</h1>
        <p>Menggunakan Metode TOPSIS (Technique for Order Preference by Similarity to Ideal Solution)</p>
        <p>Tanggal: ${new Date().toLocaleDateString("id-ID")} | Dibuat oleh: ${metadata.generatedBy}</p>
    </div>

    <div class="summary">
        <h3>Ringkasan Eksekutif</h3>
        <p>Analisis pemilihan bahan kain telah dilakukan menggunakan metode TOPSIS dengan ${kriteria.length} kriteria dan ${alternatif.length} alternatif. 
        Hasil menunjukkan bahwa <strong>${rankingData[0].nama}</strong> merupakan pilihan terbaik dengan nilai preferensi ${rankingData[0].preferensi.toFixed(4)}.</p>
    </div>

    <div class="section">
        <h2>1. Kriteria Penilaian</h2>
        <table>
            <thead>
                <tr>
                    <th class="center">No</th>
                    <th>Nama Kriteria</th>
                    <th class="center">Bobot</th>
                    <th class="center">Atribut</th>
                </tr>
            </thead>
            <tbody>
                ${kriteria
                  .map(
                    (k, i) => `
                <tr>
                    <td class="center">${i + 1}</td>
                    <td>${k.nama}</td>
                    <td class="center">${k.bobot}</td>
                    <td class="center">${k.atribut}</td>
                </tr>
                `
                  )
                  .join("")}
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>2. Matriks Penilaian Awal</h2>
        <table>
            <thead>
                <tr>
                    <th>Alternatif</th>
                    ${kriteria.map((k) => `<th class="center">${k.nama}</th>`).join("")}
                </tr>
            </thead>
            <tbody>
                ${alternatif
                  .map(
                    (alt, i) => `
                <tr>
                    <td><strong>${alt}</strong></td>
                    ${penilaianMatrix[i].map((val) => `<td class="number">${val}</td>`).join("")}
                </tr>
                `
                  )
                  .join("")}
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>3. Matriks Normalisasi</h2>
        <table>
            <thead>
                <tr>
                    <th>Alternatif</th>
                    ${kriteria.map((k) => `<th class="center">${k.nama}</th>`).join("")}
                </tr>
            </thead>
            <tbody>
                ${alternatif
                  .map(
                    (alt, i) => `
                <tr>
                    <td><strong>${alt}</strong></td>
                    ${normalisasi[i].map((val) => `<td class="number">${val.toFixed(3)}</td>`).join("")}
                </tr>
                `
                  )
                  .join("")}
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>4. Matriks Terbobot</h2>
        <table>
            <thead>
                <tr>
                    <th>Alternatif</th>
                    ${kriteria.map((k) => `<th class="center">${k.nama}</th>`).join("")}
                </tr>
            </thead>
            <tbody>
                ${alternatif
                  .map(
                    (alt, i) => `
                <tr>
                    <td><strong>${alt}</strong></td>
                    ${terbobot[i].map((val) => `<td class="number">${val.toFixed(3)}</td>`).join("")}
                </tr>
                `
                  )
                  .join("")}
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>5. Solusi Ideal</h2>
        <table>
            <thead>
                <tr>
                    <th>Solusi</th>
                    ${kriteria.map((k) => `<th class="center">${k.nama}</th>`).join("")}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Ideal Positif (Y+)</strong></td>
                    ${idealPositif.map((val) => `<td class="number">${val.toFixed(3)}</td>`).join("")}
                </tr>
                <tr>
                    <td><strong>Ideal Negatif (Y-)</strong></td>
                    ${idealNegatif.map((val) => `<td class="number">${val.toFixed(3)}</td>`).join("")}
                </tr>
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>6. Jarak dari Solusi Ideal</h2>
        <table>
            <thead>
                <tr>
                    <th>Alternatif</th>
                    <th class="center">D+ (Jarak dari Ideal Positif)</th>
                    <th class="center">D- (Jarak dari Ideal Negatif)</th>
                </tr>
            </thead>
            <tbody>
                ${alternatif
                  .map(
                    (alt, i) => `
                <tr>
                    <td><strong>${alt}</strong></td>
                    <td class="number">${dPlus[i].toFixed(3)}</td>
                    <td class="number">${dMinus[i].toFixed(3)}</td>
                </tr>
                `
                  )
                  .join("")}
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>7. Hasil Ranking Final</h2>
        <table>
            <thead>
                <tr>
                    <th class="center">Ranking</th>
                    <th>Alternatif</th>
                    <th class="center">Nilai Preferensi</th>
                    <th class="center">Nilai Preferensi</th>
                </tr>
            </thead>
            <tbody>
                ${rankingData
                  .map(
                    (item, idx) => `
                <tr ${idx === 0 ? 'class="highlight"' : ""}>
                    <td class="center"><strong>${idx + 1}</strong></td>
                    <td><strong>${item.nama}</strong></td>
                    <td class="number">${item.preferensi.toFixed(4)}</td>
                    <td class="number">${item.preferensi.toFixed(4)}</td>
                </tr>
                `
                  )
                  .join("")}
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>8. Kesimpulan</h2>
        <div class="summary">
            <p><strong>Kesimpulan:</strong></p>
            <p>Berdasarkan analisis menggunakan metode TOPSIS, <strong>${rankingData[0].nama}</strong> merupakan alternatif bahan kain terbaik 
            dengan nilai preferensi ${rankingData[0].preferensi.toFixed(4)}. 
            Alternatif ini unggul karena memiliki jarak terdekat dengan solusi ideal positif dan terjauh dari solusi ideal negatif.</p>
            
            <p><strong>Urutan Ranking:</strong></p>
            <ol>
                ${rankingData.map((item) => `<li>${item.nama} - ${item.preferensi.toFixed(4)}</li>`).join("")}
            </ol>
        </div>
    </div>

    <div class="footer">
        <p>Laporan ini dibuat secara otomatis oleh Sistem Pendukung Keputusan Pemilihan Bahan Kain</p>
        <p>Tanggal: ${new Date().toLocaleString("id-ID")}</p>
    </div>
</body>
</html>
    `;
  };

  const handleExport = async (format: "pdf" | "csv" | "excel") => {
    if (!reportData) return;

    setIsExporting(true);
    setExportFormat(format);

    try {
      // --- Prepare all data for TOPSIS steps ---
      const kriteria = reportData.kriteria;
      const alternatif = reportData.alternatif.map((a) => a.nama);
      const penilaian = reportData.penilaian;
      const bobotArr = kriteria.map((k) => k.bobot);
      const atributArr = kriteria.map((k) => k.atribut);

      // Matriks penilaian (raw)
      const penilaianMatrix = alternatif.map((alt) => kriteria.map((k) => penilaian[alt]?.[k.nama] ?? 0));

      // Pembagi untuk normalisasi
      const pembagi = kriteria.map((k, j) => {
        let sum = 0;
        for (let i = 0; i < alternatif.length; i++) {
          const v = penilaianMatrix[i][j];
          sum += v * v;
        }
        return Math.sqrt(sum);
      });

      // Matriks ternormalisasi
      const normalisasi = penilaianMatrix.map((row) => row.map((v, j) => (pembagi[j] > 0 ? v / pembagi[j] : 0)));

      // Bobot langsung tanpa normalisasi (untuk sesuai dengan Excel)
      const terbobot = normalisasi.map((row) => row.map((v, j) => v * bobotArr[j]));

      // Solusi ideal positif/negatif
      const idealPositif = kriteria.map((k, j) => {
        const col = terbobot.map((row) => row[j]);
        return k.atribut === "Benefit" ? Math.max(...col) : Math.min(...col);
      });
      const idealNegatif = kriteria.map((k, j) => {
        const col = terbobot.map((row) => row[j]);
        return k.atribut === "Benefit" ? Math.min(...col) : Math.max(...col);
      });

      // D+ dan D-
      const dPlus = terbobot.map((row) => Math.sqrt(row.reduce((sum, v, j) => sum + Math.pow(v - idealPositif[j], 2), 0)));
      const dMinus = terbobot.map((row) => Math.sqrt(row.reduce((sum, v, j) => sum + Math.pow(v - idealNegatif[j], 2), 0)));

      // Preferensi dan ranking
      const preferensi = dPlus.map((dp, i) => {
        const dm = dMinus[i];
        return dp + dm > 0 ? dm / (dp + dm) : 0;
      });

      if (format === "csv" || format === "excel") {
        // --- Build CSV sesuai template gambar screenshot kedua ---
        let csvContent = "";

        // Header utama
        csvContent += "PEMILIHAN BAHAN KAIN TERBAIK DI PERUSAHAAN RIZKI BATIK\n\n";

        // Tabel 1: Header kriteria dan bobot
        csvContent += "NAMA KRITERIA,KUALITAS,DATA SERAP,TEKSTUR,HARGA PERMETER,KETERSEDIAAN DI PASAR,RAMAH LINGKUNGAN,KEMUDAHAN PROSES PRODUKSI BATIK\n";
        csvContent += "BOBOT," + bobotArr.join(",") + "\n";
        csvContent += "ATRIBUT," + atributArr.join(",") + "\n\n";

        // Tabel 2: Data penilaian awal
        csvContent += ",KUALITAS,DATA SERAP,TEKSTUR,HARGA PERMETER,KETERSEDIAAN DI PASAR,RAMAH LINGKUNGAN,KEMUDAHAN PROSES PRODUKSI BATIK\n";
        alternatif.forEach((alt, i) => {
          csvContent += `${alt},` + penilaianMatrix[i].join(",") + "\n";
        });
        csvContent += "\n";

        // Tabel 3: Pembagi untuk normalisasi
        csvContent += "PEMBAGI," + pembagi.map((v) => v.toFixed(3)).join(",") + "\n";
        csvContent += ",KUALITAS,DATA SERAP,TEKSTUR,HARGA PERMETER,KETERSEDIAAN DI PASAR,RAMAH LINGKUNGAN,KEMUDAHAN PROSES PRODUKSI BATIK\n";

        // Tabel 4: Matriks Normalisasi
        alternatif.forEach((alt, i) => {
          csvContent += `${alt},` + normalisasi[i].map((v) => v.toFixed(3)).join(",") + "\n";
        });
        csvContent += "\n";

        // Tabel 5: Matriks Terbobot
        csvContent += ",KUALITAS,DATA SERAP,TEKSTUR,HARGA PERMETER,KETERSEDIAAN DI PASAR,RAMAH LINGKUNGAN,KEMUDAHAN PROSES PRODUKSI BATIK\n";
        alternatif.forEach((alt, i) => {
          csvContent += `${alt},` + terbobot[i].map((v) => v.toFixed(3)).join(",") + "\n";
        });
        csvContent += "\n";

        // Tabel 6: Solusi Ideal - tidak ada header lagi, langsung data
        csvContent += "Solusi Ideal Positif (Y+)," + idealPositif.map((v) => v.toFixed(3)).join(",") + "\n";
        csvContent += "Solusi Ideal Negatif (Y-)," + idealNegatif.map((v) => v.toFixed(3)).join(",") + "\n";
        csvContent += "\n";

        // Tabel 7: Jarak D+ dan D- - format baris bukan kolom
        csvContent += "D+," + alternatif.map((alt) => `${alt}`).join(",") + "\n";
        csvContent += "," + dPlus.map((v) => v.toFixed(3)).join(",") + "\n";
        csvContent += "D-," + alternatif.map((alt) => `${alt}`).join(",") + "\n";
        csvContent += "," + dMinus.map((v) => v.toFixed(3)).join(",") + "\n";
        csvContent += "\n";

        // Tabel 8: Hasil Akhir - Preferensi dan Ranking
        csvContent += "ALTERNATIF,PREFERENSI,RANGKING\n";

        // Sort berdasarkan preferensi untuk ranking
        const rankingData = preferensi
          .map((v, i) => ({
            nama: alternatif[i],
            preferensi: v,
          }))
          .sort((a, b) => b.preferensi - a.preferensi);

        rankingData.forEach((item, idx) => {
          csvContent += `${item.nama},${item.preferensi.toFixed(3)},${idx + 1}\n`;
        });

        // Download file
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `topsis-analysis-${new Date().toISOString().split("T")[0]}.${format === "excel" ? "csv" : "csv"}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else if (format === "pdf") {
        // Generate PDF content
        const pdfContent = generatePDFContent(kriteria, alternatif, penilaian, penilaianMatrix, normalisasi, terbobot, idealPositif, idealNegatif, dPlus, dMinus, preferensi, reportData.metadata);

        // Create and download PDF
        const blob = new Blob([pdfContent], { type: "text/html;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const printWindow = window.open(url, "_blank");

        if (printWindow) {
          printWindow.onload = () => {
            setTimeout(() => {
              printWindow.print();
              printWindow.close();
              URL.revokeObjectURL(url);
            }, 250);
          };
        } else {
          // Fallback: download as HTML file
          const link = document.createElement("a");
          link.setAttribute("href", url);
          link.setAttribute("download", `laporan-topsis-${new Date().toISOString().split("T")[0]}.html`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert("Gagal mengekspor laporan");
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-800 mb-2">Export & Download Laporan</h1>
          <p className="text-neutral-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-800 mb-2">Export & Download Laporan</h1>
          <p className="text-neutral-600">Terjadi kesalahan</p>
        </div>
        <AlertBanner type="error" title="Error" description={error} icon={AlertCircle} />
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-800 mb-2">Export & Download Laporan</h1>
          <p className="text-neutral-600">Belum ada data yang tersedia</p>
        </div>
        <AlertBanner type="warning" title="Tidak Ada Data" description="Belum ada data yang tersedia untuk diekspor. Silakan lengkapi data kriteria, alternatif, dan perhitungan terlebih dahulu." icon={AlertCircle} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-800 mb-2">Export & Download Laporan</h1>
        <p className="text-neutral-600">Unduh laporan lengkap hasil analisis pemilihan bahan kain dalam berbagai format</p>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleExport("pdf")}>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-neutral-800 mb-2">Export PDF</h3>
              <p className="text-sm text-neutral-600 mb-4">Laporan lengkap dengan format profesional, siap untuk presentasi</p>
              <Button onClick={() => handleExport("pdf")} disabled={isExporting && exportFormat === "pdf"} className="w-full bg-red-600 hover:bg-red-700">
                {isExporting && exportFormat === "pdf" ? "Mengexport..." : "Download PDF"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleExport("excel")}>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-neutral-800 mb-2">Export Excel</h3>
              <p className="text-sm text-neutral-600 mb-4">Data dalam format spreadsheet untuk analisis lebih lanjut</p>
              <Button onClick={() => handleExport("excel")} disabled={isExporting && exportFormat === "excel"} className="w-full bg-emerald-600 hover:bg-emerald-700">
                {isExporting && exportFormat === "excel" ? "Mengexport..." : "Download Excel"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleExport("csv")}>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-neutral-800 mb-2">Export CSV</h3>
              <p className="text-sm text-neutral-600 mb-4">Data mentah dalam format CSV untuk import ke sistem lain</p>
              <Button onClick={() => handleExport("csv")} disabled={isExporting && exportFormat === "csv"} className="w-full bg-blue-600 hover:bg-blue-700">
                {isExporting && exportFormat === "csv" ? "Mengexport..." : "Download CSV"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Print Option */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                <Printer className="w-5 h-5 text-neutral-600" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-800">Print Laporan</h3>
                <p className="text-sm text-neutral-600">Cetak laporan langsung dari browser</p>
              </div>
            </div>
            <Button onClick={handlePrint} variant="outline">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Preview */}
      <div className="print:block">
        <Card>
          <CardHeader className="text-center border-b">
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-neutral-800 mb-2">{reportData.metadata.title}</h1>
              <p className="text-neutral-600">{reportData.metadata.subtitle}</p>
            </div>
            <div className="flex justify-center gap-8 text-sm text-neutral-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Tanggal: {reportData.metadata.generatedAt.toLocaleDateString("id-ID")}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Dibuat oleh: {reportData.metadata.generatedBy}</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {/* Executive Summary */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-neutral-800 mb-4">Ringkasan Eksekutif</h2>
              <div className="bg-neutral-50 p-4 rounded-lg">
                <p className="text-neutral-700 mb-4">
                  Analisis pemilihan bahan kain telah dilakukan menggunakan metode TOPSIS dengan {reportData.metadata.totalKriteria} kriteria dan {reportData.metadata.totalAlternatif} alternatif. Hasil menunjukkan bahwa{" "}
                  <strong>Sutra</strong> merupakan pilihan terbaik dengan nilai preferensi 0.8234.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-indigo-600">4</div>
                    <div className="text-xs text-neutral-600">Kriteria</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-emerald-600">4</div>
                    <div className="text-xs text-neutral-600">Alternatif</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-orange-600">Sutra</div>
                    <div className="text-xs text-neutral-600">Terbaik</div>
                  </div>
                                  <div>
                  <div className="text-lg font-bold text-purple-600">0.8234</div>
                  <div className="text-xs text-neutral-600">Nilai Tertinggi</div>
                </div>
                </div>
              </div>
            </div>

            {/* Kriteria */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-neutral-800 mb-4">Kriteria Penilaian</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Nama Kriteria</TableHead>
                    <TableHead>Bobot</TableHead>
                    <TableHead>Bobot Normal</TableHead>
                    <TableHead>Atribut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.kriteria.map((kriteria, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{kriteria.nama}</TableCell>
                      <TableCell>{kriteria.bobot}</TableCell>
                      <TableCell>{kriteria.bobotNormal}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${kriteria.atribut === "Benefit" ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"}`}>{kriteria.atribut}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Penilaian */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-neutral-800 mb-4">Matriks Penilaian</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alternatif</TableHead>
                    {reportData.kriteria.map((kriteria) => (
                      <TableHead key={kriteria.nama} className="text-center">
                        {kriteria.nama}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(reportData.penilaian).map(([alternatif, nilai]) => (
                    <TableRow key={alternatif}>
                      <TableCell className="font-medium">{alternatif}</TableCell>
                      {Object.values(nilai).map((val, index) => (
                        <TableCell key={index} className="text-center">
                          {val}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Hasil Ranking */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-neutral-800 mb-4">Hasil Ranking</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ranking</TableHead>
                    <TableHead>Alternatif</TableHead>
                    <TableHead>Nilai Preferensi</TableHead>
                    <TableHead>Nilai Preferensi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.alternatif
                    .sort((a, b) => a.ranking - b.ranking)
                    .map((alt) => (
                      <TableRow key={alt.nama}>
                        <TableCell>
                          <span className="font-bold text-indigo-600">#{alt.ranking}</span>
                        </TableCell>
                        <TableCell className="font-medium">{alt.nama}</TableCell>
                        <TableCell>{alt.nilaiPreferensi.toFixed(4)}</TableCell>
                        <TableCell>{alt.nilaiPreferensi.toFixed(4)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>

            {/* Kesimpulan */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-neutral-800 mb-4">Kesimpulan</h2>
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
                <p className="text-neutral-700">
                  Berdasarkan analisis menggunakan metode TOPSIS, <strong>Sutra</strong> merupakan alternatif bahan kain terbaik dengan nilai preferensi 0.8234. Alternatif ini unggul karena memiliki jarak terdekat dengan solusi
                  ideal positif dan terjauh dari solusi ideal negatif.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-neutral-500 border-t pt-4">
              <p>Laporan ini dibuat secara otomatis oleh Sistem Pendukung Keputusan Pemilihan Bahan Kain</p>
              <p>Tanggal: {reportData.metadata.generatedAt.toLocaleString("id-ID")}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
