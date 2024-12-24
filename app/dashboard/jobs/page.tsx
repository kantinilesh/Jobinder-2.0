'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { JobList } from '@/components/jobs/JobList';
import { supabase } from '@/lib/supabase';
import { Job } from '@/types';
import { Plus } from 'lucide-react';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJobs() {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .single();

        if (!profile) return;

        const { data: jobs, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('employer_id', profile.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setJobs(jobs);
      } catch (error) {
        console.error('Error loading jobs:', error);
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, []);

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Job Postings</h1>
        <Link href="/dashboard/jobs/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </Link>
      </div>
      <JobList jobs={jobs} loading={loading} />
    </div>
  );
}