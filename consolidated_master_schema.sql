-- 0. CLEAN SLATE: Drop everything to start fresh
-- ====================================================================
-- WARNING: This will delete all your testing data!
-- ====================================================================
DROP TABLE IF EXISTS public.booking_assignments CASCADE;
DROP TABLE IF EXISTS public.mentor_reviews CASCADE;
DROP TABLE IF EXISTS public.mentor_expertise CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.partner_profiles CASCADE;
DROP TABLE IF EXISTS public.mentor_profiles CASCADE;
DROP TABLE IF EXISTS public.expertise_categories CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 1. Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Base Profiles Table
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  full_name text,
  email text,
  phone text,
  role text DEFAULT 'mentee' CHECK (role IN ('mentee', 'mentor', 'partner', 'admin', 'superadmin')),
  gender text CHECK (gender IN ('male', 'female')),
  approval_status text DEFAULT 'approved' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  profile_photo_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Expertise Categories
CREATE TABLE public.expertise_categories (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text,
  icon text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Mentor Profiles
CREATE TABLE public.mentor_profiles (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL UNIQUE,
  bio text,
  years_experience integer,
  company text,
  job_title text,
  linkedin_url text,
  availability_hours integer DEFAULT 10,
  is_active boolean DEFAULT true,
  rating numeric(3,2) DEFAULT 0.00,
  total_sessions integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Mentor Expertise (Junction)
CREATE TABLE public.mentor_expertise (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  mentor_id uuid REFERENCES public.mentor_profiles(id) ON DELETE CASCADE NOT NULL,
  expertise_category_id uuid REFERENCES public.expertise_categories(id) ON DELETE CASCADE NOT NULL,
  proficiency_level text DEFAULT 'intermediate' CHECK (proficiency_level IN ('beginner', 'intermediate', 'expert')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(mentor_id, expertise_category_id)
);

-- 5. Partner Profiles
CREATE TABLE public.partner_profiles (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL UNIQUE,
  organization_name text NOT NULL,
  organization_type text CHECK (organization_type IN ('corporate', 'educational', 'ngo', 'government', 'other')),
  website text,
  description text,
  partnership_interests text[],
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Bookings Table (Refined)
CREATE TABLE public.bookings (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  mentor_id uuid REFERENCES public.mentor_profiles(id),
  assigned_by uuid REFERENCES auth.users,
  expertise_category_id uuid REFERENCES public.expertise_categories(id),
  topic text,
  notes text,
  date date NOT NULL,
  time time NOT NULL,
  booking_status text DEFAULT 'pending', -- Legacy status field
  approval_status text DEFAULT 'pending_assignment' 
    CHECK (approval_status IN ('pending_assignment', 'assigned_pending_mentor', 'approved', 'rejected', 'completed', 'cancelled')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Booking Assignments Tracker
CREATE TABLE public.booking_assignments (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  mentor_id uuid REFERENCES public.mentor_profiles(id) NOT NULL,
  assigned_by uuid REFERENCES auth.users NOT NULL,
  assigned_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  mentor_response text DEFAULT 'pending' CHECK (mentor_response IN ('pending', 'accepted', 'rejected')),
  mentor_response_at timestamp with time zone,
  rejection_reason text
);

-- 8. Mentor Reviews
CREATE TABLE public.mentor_reviews (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  mentor_id uuid REFERENCES public.mentor_profiles(id) ON DELETE CASCADE NOT NULL,
  mentee_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(booking_id)
);

-- 9. Contact Messages
CREATE TABLE public.messages (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'unread',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- RLS POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expertise_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_reviews ENABLE ROW LEVEL SECURITY;

-- Profiles: Viewable by all, editable by self
CREATE POLICY "Profiles viewable by all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Profiles updateable by owner" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Expertise: Viewable by all
CREATE POLICY "Anyone can view categories" ON public.expertise_categories FOR SELECT USING (true);

-- Bookings: Mentees view own, Admins view all, Mentors view assigned
CREATE POLICY "Mentees view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Mentees insert bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage all bookings" ON public.bookings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);
CREATE POLICY "Mentors view assigned bookings" ON public.bookings FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.mentor_profiles WHERE id = bookings.mentor_id AND user_id = auth.uid())
);

-- Assignments
CREATE POLICY "Admins manage assignments" ON public.booking_assignments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);
CREATE POLICY "Mentors view assignments" ON public.booking_assignments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.mentor_profiles WHERE id = booking_assignments.mentor_id AND user_id = auth.uid())
);

-- Reviews
CREATE POLICY "Mentees create reviews" ON public.mentor_reviews FOR INSERT WITH CHECK (auth.uid() = mentee_id);
CREATE POLICY "Admins view reviews" ON public.mentor_reviews FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);

-- Messages: Anyone can insert, Admins manage
CREATE POLICY "Anyone can send messages" ON public.messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins view all messages" ON public.messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);
CREATE POLICY "Admins update messages" ON public.messages FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);

-- ====================================================================
-- TRIGGERS & FUNCTIONS
-- ====================================================================

-- Handle New User Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email, new.raw_user_meta_data->>'phone');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Update Mentor Rating Function
CREATE OR REPLACE FUNCTION update_mentor_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.mentor_profiles
  SET rating = (SELECT AVG(rating)::numeric(3,2) FROM public.mentor_reviews WHERE mentor_id = NEW.mentor_id),
      total_sessions = (SELECT COUNT(*) FROM public.bookings WHERE mentor_id = NEW.mentor_id AND approval_status = 'completed')
  WHERE id = NEW.mentor_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS update_mentor_rating_trigger ON public.mentor_reviews;
CREATE TRIGGER update_mentor_rating_trigger
  AFTER INSERT ON public.mentor_reviews
  FOR EACH ROW EXECUTE PROCEDURE update_mentor_rating();

-- ====================================================================
-- DATA SEEDING & ADMIN PROMOTION
-- ====================================================================

INSERT INTO public.expertise_categories (name, description, icon) VALUES
  ('Business Planning', 'Strategic planning, business models, and growth strategies', 'briefcase'),
  ('Marketing & Sales', 'Digital marketing, branding, and sales strategies', 'megaphone'),
  ('Finance & Accounting', 'Financial planning, budgeting, and accounting', 'dollar-sign'),
  ('Technology & Innovation', 'Tech startups, product development, and innovation', 'cpu')
ON CONFLICT (name) DO NOTHING;

-- PROMOTE SUPERADMINS (Correct emails here)
UPDATE public.profiles SET role = 'superadmin', approval_status = 'approved' WHERE email = 'cliveheartkins254@gmail.com';
UPDATE public.profiles SET role = 'admin', approval_status = 'approved' WHERE email = 'admincliff@gmail.com';

-- ====================================================================
-- STORAGE SETUP
-- ====================================================================

-- 1. Create the profile-photos bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public access to view profile photos
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'profile-photos' );

-- 3. Allow authenticated users to upload their own photos
CREATE POLICY "Users can upload their own profile photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Allow users to update/delete their own photos
CREATE POLICY "Users can update their own profile photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own profile photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
