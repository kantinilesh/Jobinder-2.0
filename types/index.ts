export type UserType = 'job_seeker' | 'employer';

export interface User {
  id: string;
  email: string;
  full_name: string;
  user_type: UserType;
}

export interface Profile {
  id: string;
  user_id: string;
  avatar_url?: string;
  title?: string;
  bio?: string;
  location?: string;
  skills: string[];
  experience_years?: number;
}

export interface Job {
  id: string;
  employer_id: string;
  title: string;
  description: string;
  location?: string;
  salary_range?: string;
  required_skills: string[];
  experience_level?: string;
}