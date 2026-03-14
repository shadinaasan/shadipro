-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_own" ON public.profiles;

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Create vehicles table
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  registration_number TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  year INTEGER,
  current_odometer INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "vehicles_select_own" ON public.vehicles;
DROP POLICY IF EXISTS "vehicles_insert_own" ON public.vehicles;
DROP POLICY IF EXISTS "vehicles_update_own" ON public.vehicles;
DROP POLICY IF EXISTS "vehicles_delete_own" ON public.vehicles;

CREATE POLICY "vehicles_select_own" ON public.vehicles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "vehicles_insert_own" ON public.vehicles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "vehicles_update_own" ON public.vehicles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "vehicles_delete_own" ON public.vehicles FOR DELETE USING (auth.uid() = user_id);

-- Create trips table (driving log)
CREATE TABLE IF NOT EXISTS public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  driver_name TEXT,
  odometer_start INTEGER NOT NULL,
  odometer_end INTEGER NOT NULL,
  distance INTEGER GENERATED ALWAYS AS (odometer_end - odometer_start) STORED,
  start_location TEXT,
  destination TEXT,
  purpose TEXT,
  category TEXT CHECK (category IN ('private', 'business')) DEFAULT 'private',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "trips_select_own" ON public.trips;
DROP POLICY IF EXISTS "trips_insert_own" ON public.trips;
DROP POLICY IF EXISTS "trips_update_own" ON public.trips;
DROP POLICY IF EXISTS "trips_delete_own" ON public.trips;

CREATE POLICY "trips_select_own" ON public.trips FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "trips_insert_own" ON public.trips FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "trips_update_own" ON public.trips FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "trips_delete_own" ON public.trips FOR DELETE USING (auth.uid() = user_id);

-- Create journal entries table
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  entry_type TEXT CHECK (entry_type IN ('maintenance', 'repair', 'service', 'inspection', 'tire_change', 'insurance', 'registration', 'accident', 'general')) DEFAULT 'general',
  notes TEXT,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  cost DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "journal_entries_select_own" ON public.journal_entries;
DROP POLICY IF EXISTS "journal_entries_insert_own" ON public.journal_entries;
DROP POLICY IF EXISTS "journal_entries_update_own" ON public.journal_entries;
DROP POLICY IF EXISTS "journal_entries_delete_own" ON public.journal_entries;

CREATE POLICY "journal_entries_select_own" ON public.journal_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "journal_entries_insert_own" ON public.journal_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "journal_entries_update_own" ON public.journal_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "journal_entries_delete_own" ON public.journal_entries FOR DELETE USING (auth.uid() = user_id);

-- Create fuel entries table
CREATE TABLE IF NOT EXISTS public.fuel_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  odometer INTEGER NOT NULL,
  fuel_amount DECIMAL(10, 2) NOT NULL,
  total_cost DECIMAL(10, 2) NOT NULL,
  price_per_liter DECIMAL(10, 3),
  fuel_station TEXT,
  full_tank BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.fuel_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "fuel_entries_select_own" ON public.fuel_entries;
DROP POLICY IF EXISTS "fuel_entries_insert_own" ON public.fuel_entries;
DROP POLICY IF EXISTS "fuel_entries_update_own" ON public.fuel_entries;
DROP POLICY IF EXISTS "fuel_entries_delete_own" ON public.fuel_entries;

CREATE POLICY "fuel_entries_select_own" ON public.fuel_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "fuel_entries_insert_own" ON public.fuel_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "fuel_entries_update_own" ON public.fuel_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "fuel_entries_delete_own" ON public.fuel_entries FOR DELETE USING (auth.uid() = user_id);

-- Create maintenance entries table
CREATE TABLE IF NOT EXISTS public.maintenance_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  service_date DATE NOT NULL,
  service_type TEXT NOT NULL,
  mileage INTEGER,
  workshop TEXT,
  cost DECIMAL(10, 2),
  next_service_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.maintenance_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "maintenance_entries_select_own" ON public.maintenance_entries;
DROP POLICY IF EXISTS "maintenance_entries_insert_own" ON public.maintenance_entries;
DROP POLICY IF EXISTS "maintenance_entries_update_own" ON public.maintenance_entries;
DROP POLICY IF EXISTS "maintenance_entries_delete_own" ON public.maintenance_entries;

CREATE POLICY "maintenance_entries_select_own" ON public.maintenance_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "maintenance_entries_insert_own" ON public.maintenance_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "maintenance_entries_update_own" ON public.maintenance_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "maintenance_entries_delete_own" ON public.maintenance_entries FOR DELETE USING (auth.uid() = user_id);
