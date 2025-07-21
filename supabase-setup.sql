-- Supabase Database Schema for TOPSIS Rizki Batik
-- Note: auth.users table is managed by Supabase, no need to enable RLS

-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create kriteria table
create table kriteria (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  nama text not null,
  bobot integer not null check (bobot >= 1 and bobot <= 5),
  atribut text not null check (atribut in ('Benefit', 'Cost')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create alternatif table
create table alternatif (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  nama text not null,
  deskripsi text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create penilaian table
create table penilaian (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  alternatif_id uuid references alternatif(id) on delete cascade not null,
  kriteria_id uuid references kriteria(id) on delete cascade not null,
  nilai integer not null check (nilai >= 1 and nilai <= 100),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, alternatif_id, kriteria_id)
);

-- Create hasil_perhitungan table
create table hasil_perhitungan (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  alternatif_id uuid references alternatif(id) on delete cascade not null,
  nilai_preferensi decimal(10,6) not null,
  ranking integer not null,
  distance_positive decimal(10,6) not null,
  distance_negative decimal(10,6) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, alternatif_id)
);

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table kriteria enable row level security;
alter table alternatif enable row level security;
alter table penilaian enable row level security;
alter table hasil_perhitungan enable row level security;

-- Create RLS policies for profiles
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on profiles
  for insert with check (auth.uid() = id);

-- Create RLS policies for kriteria
create policy "Users can view own kriteria" on kriteria
  for select using (auth.uid() = user_id);

create policy "Users can insert own kriteria" on kriteria
  for insert with check (auth.uid() = user_id);

create policy "Users can update own kriteria" on kriteria
  for update using (auth.uid() = user_id);

create policy "Users can delete own kriteria" on kriteria
  for delete using (auth.uid() = user_id);

-- Create RLS policies for alternatif
create policy "Users can view own alternatif" on alternatif
  for select using (auth.uid() = user_id);

create policy "Users can insert own alternatif" on alternatif
  for insert with check (auth.uid() = user_id);

create policy "Users can update own alternatif" on alternatif
  for update using (auth.uid() = user_id);

create policy "Users can delete own alternatif" on alternatif
  for delete using (auth.uid() = user_id);

-- Create RLS policies for penilaian
create policy "Users can view own penilaian" on penilaian
  for select using (auth.uid() = user_id);

create policy "Users can insert own penilaian" on penilaian
  for insert with check (auth.uid() = user_id);

create policy "Users can update own penilaian" on penilaian
  for update using (auth.uid() = user_id);

create policy "Users can delete own penilaian" on penilaian
  for delete using (auth.uid() = user_id);

-- Create RLS policies for hasil_perhitungan
create policy "Users can view own hasil_perhitungan" on hasil_perhitungan
  for select using (auth.uid() = user_id);

create policy "Users can insert own hasil_perhitungan" on hasil_perhitungan
  for insert with check (auth.uid() = user_id);

create policy "Users can update own hasil_perhitungan" on hasil_perhitungan
  for update using (auth.uid() = user_id);

create policy "Users can delete own hasil_perhitungan" on hasil_perhitungan
  for delete using (auth.uid() = user_id);

-- Create function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger update_profiles_updated_at before update on profiles
  for each row execute procedure public.update_updated_at_column();

create trigger update_kriteria_updated_at before update on kriteria
  for each row execute procedure public.update_updated_at_column();

create trigger update_alternatif_updated_at before update on alternatif
  for each row execute procedure public.update_updated_at_column();

create trigger update_penilaian_updated_at before update on penilaian
  for each row execute procedure public.update_updated_at_column();

create trigger update_hasil_perhitungan_updated_at before update on hasil_perhitungan
  for each row execute procedure public.update_updated_at_column();
