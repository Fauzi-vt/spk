# 🎯 TOPSIS Rizki Batik - Multi-User System

Sistem Pendukung Keputusan (SPK) untuk pemilihan bahan kain terbaik menggunakan metode TOPSIS dengan dukungan multi-user dan database cloud.

## ✨ Fitur Utama

### 🔐 **Authentication & User Management**

- ✅ Email/Password registration & login
- ✅ Google OAuth integration
- ✅ Protected routes dengan middleware
- ✅ User-specific data isolation
- ✅ Profile management

### 📊 **TOPSIS Decision Support**

- ✅ Input kriteria dengan bobot dan atribut
- ✅ Input alternatif bahan kain
- ✅ Matriks penilaian
- ✅ Perhitungan TOPSIS otomatis
- ✅ Ranking dan visualisasi hasil

### 💾 **Database Features**

- ✅ Supabase cloud database
- ✅ Row Level Security (RLS)
- ✅ Real-time data synchronization
- ✅ Automatic backups

### 🎨 **User Interface**

- ✅ Modern responsive design
- ✅ Dark/Light mode support
- ✅ Interactive sidebar navigation
- ✅ Loading states & error handling

---

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone <repository-url>
cd rifa-spk
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Supabase

📖 **Follow detailed instructions in:** [`SETUP_SUPABASE.md`](./SETUP_SUPABASE.md)

**Quick steps:**

1. Create Supabase project
2. Get API keys
3. Update `.env.local`
4. Run SQL schema
5. Configure authentication

### 4. Start Development

```bash
npm run dev
```

### 5. Test Application

- Open `http://localhost:3000`
- Register new account
- Try TOPSIS workflow
