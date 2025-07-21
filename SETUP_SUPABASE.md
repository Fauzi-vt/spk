# 🚀 Setup Supabase Authentication & Database

## 📋 Langkah 1: Setup Supabase Project

### 1.1 Buat Supabase Project

1. Kunjungi [supabase.com](https://supabase.com)
2. Klik "Start your project" atau "New Project"
3. Login/Register dengan GitHub atau email
4. Pilih organization atau buat baru
5. Buat project baru:
   - **Project Name:** `rifa-spk-topsis`
   - **Database Password:** Buat password yang kuat
   - **Region:** Pilih yang terdekat (Southeast Asia - Singapore)
6. Tunggu setup selesai (~2 menit)

### 1.2 Dapatkan API Keys

1. Di dashboard Supabase, buka **Settings > API**
2. Copy informasi berikut:
   - **Project URL:** `https://thqozynbmamkuupiugbq.supabase.co`
   - **Project API Keys > anon public:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocW96eW5ibWFta3V1cGl1Z2JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNzg0NTAsImV4cCI6MjA2ODY1NDQ1MH0.vZUwRK0E5dG3F4IhyVkS7O3R2n_lfKDRi8Z0woWvwxs`
   - **Project API Keys > service_role:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocW96eW5ibWFta3V1cGl1Z2JxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzA3ODQ1MCwiZXhwIjoyMDY4NjU0NDUwfQ.lszlzhlJ8YVgCGSc2oA_jvO16wyOtwa26U3Mo-T73Ds`

---

## 📋 Langkah 2: Setup Environment Variables

### 2.1 Update .env.local

Buka file `.env.local` dan ganti dengan data Anda:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Contoh:**

```bash
NEXT_PUBLIC_SUPABASE_URL=https://abcdef123456.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZjEyMzQ1NiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjc4OTAwODAwLCJleHAiOjE5OTQ0NzY4MDB9.example
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZjEyMzQ1NiIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE2Nzg5MDA4MDAsImV4cCI6MTk5NDQ3NjgwMH0.example
```

---

## 📋 Langkah 3: Setup Database Schema

### 3.1 Jalankan SQL Script

1. Di dashboard Supabase, buka **SQL Editor**
2. Klik **New Query**
3. Copy-paste seluruh isi file `supabase-setup-safe.sql` (BUKAN supabase-setup.sql)
4. Klik **Run** untuk execute
5. Tunggu sampai selesai (tanpa error)

**⚠️ PENTING:** Gunakan file `supabase-setup-safe.sql` karena file ini sudah diperbaiki untuk menghindari error "must be owner of table users".

### 3.2 Verifikasi Tables

Di **Table Editor**, pastikan tables berikut sudah dibuat:

- ✅ `profiles`
- ✅ `kriteria`
- ✅ `alternatif`
- ✅ `penilaian`
- ✅ `hasil_perhitungan`

---

## 📋 Langkah 4: Setup Authentication

### 4.1 Configure Auth Settings

1. Buka **Authentication > Settings**
2. Pastikan **Enable email confirmations** = ON
3. Di **Site URL**, masukkan: `http://localhost:3000`
4. Di **Redirect URLs**, tambahkan:
   - `http://localhost:3000/kriteria`
   - `http://localhost:3000/auth/callback`

### 4.2 Setup Google OAuth (Opsional)

1. Buka **Authentication > Providers**
2. Enable **Google**
3. Masukkan Google OAuth credentials:
   - **Client ID** dari Google Console
   - **Client Secret** dari Google Console
4. Redirect URL: `https://your-project-id.supabase.co/auth/v1/callback`

**Cara mendapat Google OAuth:**

1. Buka [Google Cloud Console](https://console.cloud.google.com)
2. Create project atau pilih existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `https://your-project-id.supabase.co/auth/v1/callback`

---

## 📋 Langkah 5: Test Application

### 5.1 Start Development Server

```bash
npm run dev
```

### 5.2 Test Registration

1. Buka `http://localhost:3000`
2. Akan redirect ke `/auth/login`
3. Klik "Daftar di sini"
4. Register dengan email/password
5. Cek email untuk konfirmasi
6. Setelah konfirmasi, login

### 5.3 Test Database

1. Login berhasil → redirect ke `/kriteria`
2. Tambah kriteria baru
3. Check di Supabase **Table Editor > kriteria**
4. Data harus muncul dengan `user_id` yang benar

---

## 🔧 Troubleshooting

### Error: "Invalid environment variables"

- ✅ Pastikan `.env.local` ada di root project
- ✅ Restart development server: `npm run dev`
- ✅ Check NEXT*PUBLIC* prefix untuk public vars

### Error: "Failed to connect to Supabase"

- ✅ Check URL dan Keys di dashboard Supabase
- ✅ Pastikan project Supabase aktif
- ✅ Check network connection

### Error: "RLS policy violation"

- ✅ Pastikan RLS policies sudah dijalankan
- ✅ Check user authentication status
- ✅ Verify table permissions

### Error: "Email not confirmed"

- ✅ Check email inbox & spam folder
- ✅ Resend confirmation dari Supabase dashboard
- ✅ Temporary disable email confirmation untuk testing

---

## 📊 Database Structure

```
┌─────────────────┬─────────────────┬──────────────────────┐
│     TABLE       │    PURPOSE      │    RELATIONSHIPS     │
├─────────────────┼─────────────────┼──────────────────────┤
│ profiles        │ User profiles   │ auth.users (1:1)     │
│ kriteria        │ Criteria data   │ users (N:1)          │
│ alternatif      │ Alternatives    │ users (N:1)          │
│ penilaian       │ Evaluations     │ users,alt,krit (N:1) │
│ hasil_perhitungan│ Results        │ users,alt (N:1)      │
└─────────────────┴─────────────────┴──────────────────────┘
```

## 🎯 Features yang Tersedia

### ✅ Authentication

- Email/Password registration & login
- Google OAuth login
- Protected routes dengan middleware
- Automatic profile creation
- Session management

### ✅ Database Features

- Row Level Security (RLS)
- User-specific data isolation
- Automatic timestamps
- Data validation constraints
- Soft relationships

### ✅ User Experience

- Automatic redirects
- Loading states
- Error handling
- Responsive design
- Real-time data

---

## 🚀 Next Steps

Setelah setup berhasil:

1. **Test semua fitur** - Registration, login, data input
2. **Customize UI** - Colors, branding, layouts
3. **Add features** - Export, sharing, history
4. **Deploy** - Vercel, Netlify, atau platform lain
5. **Setup production** - Production Supabase, custom domain

**Selamat! Aplikasi TOPSIS dengan multi-user sudah siap! 🎉**
