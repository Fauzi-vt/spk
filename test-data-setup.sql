-- Test Data Setup Script for TOPSIS Rizki Batik
-- This script will populate the database with test data for quick testing
-- Run this in Supabase SQL Editor after setting up the database schema

-- First, let's create a test user (you'll need to replace this with your actual user_id)
-- You can get your user_id from the auth.users table or from your application

-- Step 1: Insert test kriteria data
INSERT INTO kriteria (user_id, nama, bobot, atribut) VALUES
-- Replace 'your-user-id-here' with your actual user_id from auth.users table
('your-user-id-here', 'Kualitas', 5, 'Benefit'),
('your-user-id-here', 'Daya Serap', 4, 'Benefit'),
('your-user-id-here', 'Tekstur', 4, 'Benefit'),
('your-user-id-here', 'Harga Perimeter', 3, 'Cost'),
('your-user-id-here', 'Ketersediaan di Pasar', 3, 'Benefit'),
('your-user-id-here', 'Ramah Lingkungan', 4, 'Benefit'),
('your-user-id-here', 'Kemudahan Proses Produksi Batik', 5, 'Benefit');

-- Step 2: Insert test alternatif data
INSERT INTO alternatif (user_id, nama, deskripsi) VALUES
('your-user-id-here', 'Kain Primisima', 'Kain katun premium berkualitas tinggi'),
('your-user-id-here', 'Kain Katun Basa', 'Kain katun standar untuk batik'),
('your-user-id-here', 'Kain Doby', 'Kain dengan tekstur bermotif halus'),
('your-user-id-here', 'Kain Viscose', 'Kain serat buatan dari selulosa'),
('your-user-id-here', 'Kain Safira', 'Kain campuran dengan daya serap baik'),
('your-user-id-here', 'Kain Polyester', 'Kain sintetis tahan lama'),
('your-user-id-here', 'Kain Rayon', 'Kain serat buatan dengan drape baik');

-- Step 3: Insert test penilaian data (assessment matrix)
-- Kain Primisima
INSERT INTO penilaian (user_id, alternatif_id, kriteria_id, nilai) VALUES
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Primisima' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Kualitas' AND user_id = 'your-user-id-here'), 85),
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Primisima' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Daya Serap' AND user_id = 'your-user-id-here'), 95),
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Primisima' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Tekstur' AND user_id = 'your-user-id-here'), 95),
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Primisima' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Harga Perimeter' AND user_id = 'your-user-id-here'), 90),
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Primisima' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Ketersediaan di Pasar' AND user_id = 'your-user-id-here'), 80),
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Primisima' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Ramah Lingkungan' AND user_id = 'your-user-id-here'), 85),
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Primisima' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Kemudahan Proses Produksi Batik' AND user_id = 'your-user-id-here'), 90);

-- Kain Katun Basa
INSERT INTO penilaian (user_id, alternatif_id, kriteria_id, nilai) VALUES
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Katun Basa' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Kualitas' AND user_id = 'your-user-id-here'), 85),
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Katun Basa' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Daya Serap' AND user_id = 'your-user-id-here'), 85),
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Katun Basa' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Tekstur' AND user_id = 'your-user-id-here'), 90),
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Katun Basa' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Harga Perimeter' AND user_id = 'your-user-id-here'), 90),
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Katun Basa' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Ketersediaan di Pasar' AND user_id = 'your-user-id-here'), 85),
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Katun Basa' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Ramah Lingkungan' AND user_id = 'your-user-id-here'), 90),
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Katun Basa' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Kemudahan Proses Produksi Batik' AND user_id = 'your-user-id-here'), 85);

-- Kain Doby
INSERT INTO penilaian (user_id, alternatif_id, kriteria_id, nilai) VALUES
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Doby' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Kualitas' AND user_id = 'your-user-id-here'), 80),
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Doby' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Daya Serap' AND user_id = 'your-user-id-here'), 85),
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Doby' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Tekstur' AND user_id = 'your-user-id-here'), 85),
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Doby' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Harga Perimeter' AND user_id = 'your-user-id-here'), 85),
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Doby' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Ketersediaan di Pasar' AND user_id = 'your-user-id-here'), 80),
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Doby' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Ramah Lingkungan' AND user_id = 'your-user-id-here'), 75),
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Doby' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Kemudahan Proses Produksi Batik' AND user_id = 'your-user-id-here'), 75);

-- Kain Viscose
INSERT INTO penilaian (user_id, alternatif_id, kriteria_id, nilai) VALUES
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Viscose' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Kualitas' AND user_id = 'your-user-id-here'), 95),
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Viscose' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Daya Serap' AND user_id = 'your-user-id-here'), 90),
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Viscose' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Tekstur' AND user_id = 'your-user-id-here'), 90),
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Viscose' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Harga Perimeter' AND user_id = 'your-user-id-here'), 75),
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Viscose' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Ketersediaan di Pasar' AND user_id = 'your-user-id-here'), 80),
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Viscose' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Ramah Lingkungan' AND user_id = 'your-user-id-here'), 75),
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Viscose' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Kemudahan Proses Produksi Batik' AND user_id = 'your-user-id-here'), 85);

-- Kain Safira
INSERT INTO penilaian (user_id, alternatif_id, kriteria_id, nilai) VALUES
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Safira' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Kualitas' AND user_id = 'your-user-id-here'), 90),
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Safira' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Daya Serap' AND user_id = 'your-user-id-here'), 80),
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Safira' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Tekstur' AND user_id = 'your-user-id-here'), 90),
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Safira' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Harga Perimeter' AND user_id = 'your-user-id-here'), 75),
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Safira' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Ketersediaan di Pasar' AND user_id = 'your-user-id-here'), 80),
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Safira' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Ramah Lingkungan' AND user_id = 'your-user-id-here'), 90),
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Safira' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Kemudahan Proses Produksi Batik' AND user_id = 'your-user-id-here'), 90);

-- Kain Polyester
INSERT INTO penilaian (user_id, alternatif_id, kriteria_id, nilai) VALUES
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Polyester' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Kualitas' AND user_id = 'your-user-id-here'), 75),
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Polyester' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Daya Serap' AND user_id = 'your-user-id-here'), 70),
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Polyester' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Tekstur' AND user_id = 'your-user-id-here'), 75),
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Polyester' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Harga Perimeter' AND user_id = 'your-user-id-here'), 85),
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Polyester' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Ketersediaan di Pasar' AND user_id = 'your-user-id-here'), 85),
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Polyester' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Ramah Lingkungan' AND user_id = 'your-user-id-here'), 90),
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Polyester' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Kemudahan Proses Produksi Batik' AND user_id = 'your-user-id-here'), 70);

-- Kain Rayon
INSERT INTO penilaian (user_id, alternatif_id, kriteria_id, nilai) VALUES
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Rayon' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Kualitas' AND user_id = 'your-user-id-here'), 70),
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Rayon' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Daya Serap' AND user_id = 'your-user-id-here'), 75),
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Rayon' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Tekstur' AND user_id = 'your-user-id-here'), 70),
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Rayon' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Harga Perimeter' AND user_id = 'your-user-id-here'), 55),
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Rayon' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Ketersediaan di Pasar' AND user_id = 'your-user-id-here'), 80),
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Rayon' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Ramah Lingkungan' AND user_id = 'your-user-id-here'), 85),
('your-user-id-here', (SELECT id FROM alternatif WHERE nama = 'Kain Rayon' AND user_id = 'your-user-id-here'), (SELECT id FROM kriteria WHERE nama = 'Kemudahan Proses Produksi Batik' AND user_id = 'your-user-id-here'), 75);

-- Verification queries
SELECT 'Kriteria count:' as info, COUNT(*) as count FROM kriteria WHERE user_id = 'your-user-id-here'
UNION ALL
SELECT 'Alternatif count:' as info, COUNT(*) as count FROM alternatif WHERE user_id = 'your-user-id-here'
UNION ALL
SELECT 'Penilaian count:' as info, COUNT(*) as count FROM penilaian WHERE user_id = 'your-user-id-here'; 