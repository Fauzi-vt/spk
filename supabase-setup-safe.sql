-- Supabase Database Schema for TOPSIS Rizki Batik (SAFE VERSION)
-- Run this script in Supabase SQL Editor

-- =====================================
-- 1. CREATE TABLES
-- =====================================

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create kriteria table
CREATE TABLE IF NOT EXISTS kriteria (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nama text NOT NULL,
  bobot integer NOT NULL CHECK (bobot >= 1 AND bobot <= 5),
  atribut text NOT NULL CHECK (atribut IN ('Benefit', 'Cost')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create alternatif table
CREATE TABLE IF NOT EXISTS alternatif (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nama text NOT NULL,
  deskripsi text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create penilaian table
CREATE TABLE IF NOT EXISTS penilaian (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  alternatif_id uuid REFERENCES alternatif(id) ON DELETE CASCADE NOT NULL,
  kriteria_id uuid REFERENCES kriteria(id) ON DELETE CASCADE NOT NULL,
  nilai integer NOT NULL CHECK (nilai >= 1 AND nilai <= 100),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, alternatif_id, kriteria_id)
);

-- Create hasil_perhitungan table
CREATE TABLE IF NOT EXISTS hasil_perhitungan (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  alternatif_id uuid REFERENCES alternatif(id) ON DELETE CASCADE NOT NULL,
  nilai_preferensi decimal(10,6) NOT NULL,
  ranking integer NOT NULL,
  distance_positive decimal(10,6) NOT NULL,
  distance_negative decimal(10,6) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, alternatif_id)
);

-- =====================================
-- 2. ENABLE ROW LEVEL SECURITY
-- =====================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE kriteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE alternatif ENABLE ROW LEVEL SECURITY;
ALTER TABLE penilaian ENABLE ROW LEVEL SECURITY;
ALTER TABLE hasil_perhitungan ENABLE ROW LEVEL SECURITY;

-- =====================================
-- 3. CREATE RLS POLICIES - PROFILES
-- =====================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create new policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- =====================================
-- 4. CREATE RLS POLICIES - KRITERIA
-- =====================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own kriteria" ON kriteria;
DROP POLICY IF EXISTS "Users can insert own kriteria" ON kriteria;
DROP POLICY IF EXISTS "Users can update own kriteria" ON kriteria;
DROP POLICY IF EXISTS "Users can delete own kriteria" ON kriteria;

-- Create new policies for kriteria
CREATE POLICY "Users can view own kriteria" ON kriteria
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own kriteria" ON kriteria
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own kriteria" ON kriteria
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own kriteria" ON kriteria
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================
-- 5. CREATE RLS POLICIES - ALTERNATIF
-- =====================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own alternatif" ON alternatif;
DROP POLICY IF EXISTS "Users can insert own alternatif" ON alternatif;
DROP POLICY IF EXISTS "Users can update own alternatif" ON alternatif;
DROP POLICY IF EXISTS "Users can delete own alternatif" ON alternatif;

-- Create new policies for alternatif
CREATE POLICY "Users can view own alternatif" ON alternatif
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own alternatif" ON alternatif
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own alternatif" ON alternatif
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own alternatif" ON alternatif
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================
-- 6. CREATE RLS POLICIES - PENILAIAN
-- =====================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own penilaian" ON penilaian;
DROP POLICY IF EXISTS "Users can insert own penilaian" ON penilaian;
DROP POLICY IF EXISTS "Users can update own penilaian" ON penilaian;
DROP POLICY IF EXISTS "Users can delete own penilaian" ON penilaian;

-- Create new policies for penilaian
CREATE POLICY "Users can view own penilaian" ON penilaian
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own penilaian" ON penilaian
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own penilaian" ON penilaian
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own penilaian" ON penilaian
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================
-- 7. CREATE RLS POLICIES - HASIL_PERHITUNGAN
-- =====================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own hasil_perhitungan" ON hasil_perhitungan;
DROP POLICY IF EXISTS "Users can insert own hasil_perhitungan" ON hasil_perhitungan;
DROP POLICY IF EXISTS "Users can update own hasil_perhitungan" ON hasil_perhitungan;
DROP POLICY IF EXISTS "Users can delete own hasil_perhitungan" ON hasil_perhitungan;

-- Create new policies for hasil_perhitungan
CREATE POLICY "Users can view own hasil_perhitungan" ON hasil_perhitungan
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own hasil_perhitungan" ON hasil_perhitungan
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own hasil_perhitungan" ON hasil_perhitungan
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own hasil_perhitungan" ON hasil_perhitungan
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================
-- 8. CREATE FUNCTIONS & TRIGGERS
-- =====================================

-- Drop existing function if exists
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================
-- 9. CREATE UPDATE TIMESTAMP FUNCTION
-- =====================================

-- Drop existing function if exists
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- =====================================
-- 10. CREATE UPDATE TRIGGERS
-- =====================================

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_kriteria_updated_at ON kriteria;
DROP TRIGGER IF EXISTS update_alternatif_updated_at ON alternatif;
DROP TRIGGER IF EXISTS update_penilaian_updated_at ON penilaian;
DROP TRIGGER IF EXISTS update_hasil_perhitungan_updated_at ON hasil_perhitungan;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_kriteria_updated_at 
  BEFORE UPDATE ON kriteria
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_alternatif_updated_at 
  BEFORE UPDATE ON alternatif
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_penilaian_updated_at 
  BEFORE UPDATE ON penilaian
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hasil_perhitungan_updated_at 
  BEFORE UPDATE ON hasil_perhitungan
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================
-- 11. VERIFICATION QUERIES (OPTIONAL)
-- =====================================

-- Run these to verify the setup worked correctly:

-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'kriteria', 'alternatif', 'penilaian', 'hasil_perhitungan');

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'kriteria', 'alternatif', 'penilaian', 'hasil_perhitungan');

-- Check if policies exist
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';

-- =====================================
-- SETUP COMPLETE! 🎉
-- =====================================

-- Your database is now ready for the TOPSIS application!
-- 
-- The database tables are created but empty - users will input their own data.
-- 
-- Next steps:
-- 1. Update your .env.local with Supabase credentials
-- 2. Test user registration in your app
-- 3. Users can add their own criteria and alternatives
-- 4. Verify data isolation is working for new users
-- 
-- Happy coding! 🚀
