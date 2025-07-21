# 🎯 CONTOH KASUS: Pemilihan Bahan Kain Terbaik untuk Produksi Batik

## 📋 Skenario Perusahaan

**Perusahaan:** Rizki Batik  
**Masalah:** Perlu memilih bahan kain terbaik dari 7 jenis kain yang tersedia  
**Metode:** TOPSIS (Technique for Order Preference by Similarity to Ideal Solution)

---

## 🎯 Langkah-langkah Penggunaan Aplikasi

### 1. **Input Kriteria** (`/kriteria`)

Tambahkan 7 kriteria penilaian:

| No  | Nama Kriteria                   | Bobot | Atribut | Keterangan                                    |
| --- | ------------------------------- | ----- | ------- | --------------------------------------------- |
| 1   | Kualitas                        | 5     | Benefit | Kualitas bahan kain secara keseluruhan        |
| 2   | Daya Serap                      | 4     | Benefit | Kemampuan menyerap pewarna batik              |
| 3   | Tekstur                         | 4     | Benefit | Kelembutan dan kenyamanan tekstur             |
| 4   | Harga Perimeter                 | 3     | Cost    | Harga per meter (semakin rendah semakin baik) |
| 5   | Ketersediaan di Pasar           | 3     | Benefit | Mudah tidaknya mendapat bahan                 |
| 6   | Ramah Lingkungan                | 4     | Benefit | Dampak terhadap lingkungan                    |
| 7   | Kemudahan Proses Produksi Batik | 5     | Benefit | Kemudahan dalam proses pembuatan batik        |

**Tips Input:**

- **Benefit:** Semakin tinggi nilai semakin baik
- **Cost:** Semakin rendah nilai semakin baik
- **Bobot 1-5:** 1=Tidak Penting, 5=Sangat Penting

---

### 2. **Input Alternatif** (`/alternatif`)

Tambahkan 7 jenis bahan kain:

| No  | Nama Alternatif | Deskripsi                             |
| --- | --------------- | ------------------------------------- |
| 1   | Kain Primisima  | Kain katun premium berkualitas tinggi |
| 2   | Kain Katun Basa | Kain katun standar untuk batik        |
| 3   | Kain Doby       | Kain dengan tekstur bermotif halus    |
| 4   | Kain Viscose    | Kain serat buatan dari selulosa       |
| 5   | Kain Safira     | Kain campuran dengan daya serap baik  |
| 6   | Kain Polyester  | Kain sintetis tahan lama              |
| 7   | Kain Rayon      | Kain serat buatan dengan drape baik   |

---

### 3. **Penilaian Alternatif** (`/penilaian`)

Berikan nilai 1-100 untuk setiap kombinasi alternatif-kriteria:

#### **Matriks Penilaian:**

| Alternatif          | Kualitas | Daya Serap | Tekstur | Harga/m | Ketersediaan | Ramah Lingkungan | Kemudahan Produksi |
| ------------------- | -------- | ---------- | ------- | ------- | ------------ | ---------------- | ------------------ |
| **Kain Primisima**  | 85       | 95         | 95      | 90      | 80           | 85               | 90                 |
| **Kain Katun Basa** | 85       | 85         | 90      | 90      | 85           | 90               | 85                 |
| **Kain Doby**       | 80       | 85         | 85      | 85      | 80           | 75               | 75                 |
| **Kain Viscose**    | 95       | 90         | 90      | 75      | 80           | 75               | 85                 |
| **Kain Safira**     | 90       | 80         | 90      | 75      | 80           | 90               | 90                 |
| **Kain Polyester**  | 75       | 70         | 75      | 85      | 85           | 90               | 70                 |
| **Kain Rayon**      | 70       | 75         | 70      | 55      | 80           | 85               | 75                 |

**Penjelasan Nilai:**

- **90-100:** Sangat Baik
- **80-89:** Baik
- **70-79:** Cukup
- **60-69:** Kurang
- **<60:** Sangat Kurang

---

### 4. **Pembobotan Kriteria** (`/pembobotan`)

Atur bobot sesuai prioritas perusahaan:

| Kriteria           | Bobot | Alasan                               |
| ------------------ | ----- | ------------------------------------ |
| Kualitas           | 5     | Paling penting untuk reputasi produk |
| Kemudahan Produksi | 5     | Efisiensi produksi sangat krusial    |
| Daya Serap         | 4     | Penting untuk kualitas pewarnaan     |
| Tekstur            | 4     | Mempengaruhi kenyamanan produk       |
| Ramah Lingkungan   | 4     | CSR dan sustainability               |
| Harga Perimeter    | 3     | Budget consideration                 |
| Ketersediaan       | 3     | Supply chain stability               |

---

### 5. **Proses Perhitungan TOPSIS** (`/perhitungan`)

Ikuti 4 langkah perhitungan:

1. **Matriks Keputusan:** Data mentah penilaian
2. **Normalisasi:** Standardisasi menggunakan akar kuadrat
3. **Pembobotan:** Kalikan dengan bobot kriteria
4. **Solusi Ideal:** Hitung jarak ke solusi ideal positif/negatif

---

### 6. **Lihat Hasil Akhir** (`/hasil`)

Analisis ranking hasil:

#### **Hasil yang Diharapkan:**

| Rank | Alternatif      | Nilai Preferensi | Alasan                           |
| ---- | --------------- | ---------------- | -------------------------------- |
| 🥇 1 | Kain Katun Basa | 0.650            | Seimbang di semua aspek          |
| 🥈 2 | Kain Doby       | 0.613            | Tekstur baik, harga wajar        |
| 🥉 3 | Kain Viscose    | 0.554            | Kualitas tinggi tapi harga mahal |

---

## 💡 Tips Penggunaan

### **Untuk Pengguna Baru:**

1. Mulai dari halaman `/kriteria`
2. Ikuti urutan menu dari atas ke bawah
3. Pastikan semua data diisi sebelum lanjut
4. Gunakan nilai realistis (jangan ekstrem)

### **Untuk Analisis:**

- Bandingkan nilai preferensi antar alternatif
- Perhatikan jarak ke solusi ideal
- Analisis sensitifitas dengan mengubah bobot
- Dokumentasikan alasan pemberian nilai

### **Skenario Variasi:**

1. **Budget Terbatas:** Naikkan bobot "Harga Perimeter"
2. **Kualitas Premium:** Naikkan bobot "Kualitas" dan "Tekstur"
3. **Produksi Massal:** Naikkan bobot "Ketersediaan" dan "Kemudahan Produksi"
4. **Eco-Friendly:** Naikkan bobot "Ramah Lingkungan"

---

## 🎯 Ekspektasi Hasil

### **Skenario Normal:**

- **Pemenang:** Kain dengan nilai seimbang
- **Runner-up:** Alternatif dengan keunggulan spesifik
- **Terakhir:** Kain dengan kelemahan di kriteria penting

### **Validasi Hasil:**

1. ✅ Ranking masuk akal dengan input
2. ✅ Nilai preferensi antara 0-1
3. ✅ Alternatif terbaik unggul di kriteria berbobot tinggi
4. ✅ Konsisten dengan ekspektasi bisnis

---

## 📊 Contoh Interpretasi

**Jika Kain Katun Basa menang:**

> "Kain Katun Basa dipilih sebagai alternatif terbaik karena memberikan keseimbangan optimal antara kualitas (85), kemudahan produksi (85), dan harga yang kompetitif (90). Meskipun bukan yang tertinggi di setiap kriteria, kain ini memberikan value terbaik secara keseluruhan untuk produksi batik."

**Rekomendasi Bisnis:**

- Gunakan Kain Katun Basa untuk produksi utama
- Kain Primisima untuk produk premium
- Kain Polyester untuk produk budget-friendly

---

_Selamat mencoba aplikasi TOPSIS! 🎉_
