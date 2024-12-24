/*
  # Initial Schema Setup for JobMatch Platform

  1. Tables
    - profiles
      - Stores user profile information
      - Links to Supabase auth.users
    - jobs
      - Stores job listings
      - Posted by employers
    - job_matches
      - Stores job-seeker matches/likes
    - messages
      - Stores communication between users
  
  2. Security
    - RLS enabled on all tables
    - Policies for data access control
*/

-- Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('job_seeker', 'employer')),
  avatar_url TEXT,
  title TEXT,
  bio TEXT,
  location TEXT,
  skills TEXT[] DEFAULT '{}',
  experience_years INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  salary_range TEXT,
  required_skills TEXT[] DEFAULT '{}',
  experience_level TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Job matches table
CREATE TABLE IF NOT EXISTS job_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  job_seeker_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  employer_action BOOLEAN DEFAULT NULL,
  job_seeker_action BOOLEAN NOT NULL,
  matched_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(job_id, job_seeker_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES job_matches(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Jobs policies
CREATE POLICY "Jobs are viewable by everyone"
  ON jobs FOR SELECT
  USING (is_active = true);

CREATE POLICY "Employers can insert jobs"
  ON jobs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = employer_id
      AND user_id = auth.uid()
      AND user_type = 'employer'
    )
  );

CREATE POLICY "Employers can update own jobs"
  ON jobs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = employer_id
      AND user_id = auth.uid()
      AND user_type = 'employer'
    )
  );

-- Job matches policies
CREATE POLICY "Users can view own matches"
  ON job_matches FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = job_seeker_id
      AND user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM jobs
      WHERE id = job_id
      AND employer_id IN (
        SELECT id FROM profiles
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Job seekers can create matches"
  ON job_matches FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = job_seeker_id
      AND user_id = auth.uid()
      AND user_type = 'job_seeker'
    )
  );

-- Messages policies
CREATE POLICY "Users can view messages in their matches"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM job_matches m
      JOIN profiles p ON (m.job_seeker_id = p.id OR m.job_id IN (SELECT id FROM jobs WHERE employer_id = p.id))
      WHERE m.id = match_id
      AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages in their matches"
  ON messages FOR INSERT
  WITH CHECK (
    sender_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    ) AND
    EXISTS (
      SELECT 1 FROM job_matches m
      JOIN profiles p ON (m.job_seeker_id = p.id OR m.job_id IN (SELECT id FROM jobs WHERE employer_id = p.id))
      WHERE m.id = match_id
      AND p.user_id = auth.uid()
    )
  );