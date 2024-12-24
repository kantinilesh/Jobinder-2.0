'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Job } from '@/types';
import { useDebounce } from '@/hooks/useDebounce';

interface JobSearchFilters {
  query: string;
  location: string;
  experienceLevel: string;
  employmentType: string;
  remoteOnly: boolean;
  skills: string[];
  salaryMin: string;
  salaryMax: string;
}

export function useJobSearch(filters: JobSearchFilters) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedFilters = useDebounce(filters, 300);

  useEffect(() => {
    async function searchJobs() {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('jobs')
          .select('*')
          .eq('is_active', true);

        if (debouncedFilters.query) {
          query = query.or(`title.ilike.%${debouncedFilters.query}%,description.ilike.%${debouncedFilters.query}%`);
        }

        if (debouncedFilters.location) {
          query = query.ilike('location', `%${debouncedFilters.location}%`);
        }

        if (debouncedFilters.experienceLevel) {
          query = query.eq('experience_level', debouncedFilters.experienceLevel);
        }

        if (debouncedFilters.skills.length > 0) {
          query = query.contains('required_skills', debouncedFilters.skills);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;
        setJobs(data);
      } catch (err) {
        setError('Failed to load jobs');
        console.error('Error loading jobs:', err);
      } finally {
        setLoading(false);
      }
    }

    searchJobs();
  }, [debouncedFilters]);

  return { jobs, loading, error };
}