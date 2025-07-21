# 🚨 QUICK FIX - Supabase Setup Error

## Error yang Terjadi:

```
ERROR: 42501: must be owner of table users
```

## ✅ Solusi:

### 1. **JANGAN GUNAKAN** `supabase-setup.sql`

File tersebut mengandung error karena mencoba memodifikasi tabel `auth.users` yang tidak diizinkan.

### 2. **GUNAKAN** `supabase-setup-safe.sql`

Saya telah membuat versi yang aman tanpa error.

### 3. **Langkah-langkah Perbaikan:**

#### Step 1: Bersihkan Database (jika perlu)

Jika Anda sudah menjalankan script yang error, hapus tabel yang sudah dibuat:

```sql
-- Jalankan di Supabase SQL Editor jika perlu cleanup
DROP TABLE IF EXISTS hasil_perhitungan CASCADE;
DROP TABLE IF EXISTS penilaian CASCADE;
DROP TABLE IF EXISTS alternatif CASCADE;
DROP TABLE IF EXISTS kriteria CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
```

#### Step 2: Jalankan Script yang Benar

1. Buka **Supabase Dashboard > SQL Editor**
2. Klik **New Query**
3. Copy-paste **SELURUH ISI** file `supabase-setup-safe.sql`
4. Klik **Run**
5. Tunggu hingga selesai (success ✅)

#### Step 3: Verifikasi

Jalankan query ini untuk memastikan semua tabel terbuat:

```sql
-- Check tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'kriteria', 'alternatif', 'penilaian', 'hasil_perhitungan');

-- Check RLS status
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'kriteria', 'alternatif', 'penilaian', 'hasil_perhitungan');
```

Hasil yang diharapkan:

- 5 tabel terbuat
- RLS enabled untuk semua tabel

---

## 🎯 Mengapa Error Terjadi?

**Penjelasan Teknis:**

- Tabel `auth.users` dikelola oleh Supabase secara internal
- User biasa tidak punya permission untuk mengubah tabel sistem
- RLS sudah otomatis aktif untuk `auth.users`

**Solusi di `supabase-setup-safe.sql`:**

- ✅ Menghapus baris `alter table auth.users enable row level security;`
- ✅ Menambahkan `IF NOT EXISTS` untuk avoid conflict
- ✅ Menambahkan `DROP ... IF EXISTS` untuk cleanup
- ✅ Proper error handling

---

## 🚀 Test Setelah Setup

### 1. Environment Variables

Pastikan `.env.local` sudah benar:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2. Test Authentication

```bash
npm run dev
# Buka http://localhost:3000
# Register user baru
# Login
# Cek apakah data masuk ke database
```

### 3. Verifikasi Database

Di Supabase **Table Editor**, cek:

- ✅ Tabel `profiles` ada data user
- ✅ Bisa insert data ke tabel lain
- ✅ RLS berfungsi (user hanya lihat data sendiri)

---

## 🎉 Selesai!

Setelah menggunakan `supabase-setup-safe.sql`, aplikasi Anda akan:

- ✅ Berjalan tanpa error
- ✅ Multi-user ready
- ✅ Data isolation aktif
- ✅ Production ready

**Happy coding! 🚀**
