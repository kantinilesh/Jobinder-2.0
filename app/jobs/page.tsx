'use client';

import { useState } from 'react';
import { JobSearch } from '@/components/jobs/search/JobSearch';
import { JobResults } from '@/components/jobs/search/JobResults';
import { useJobSearch } from '@/hooks/useJobSearch';

export default function JobsPage() {
  const [filters, setFilters] = useState({
    query: '',
    location: '',
    experienceLevel: '',
    employmentType: '',
    remoteOnly: false,
    skills: [] as string[],
    salaryMin: '',
    salaryMax: '',
  });

  const { jobs, loading, error } = useJobSearch(filters);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Find Your Next Job</h1>
      <div className="grid gap-6 lg:grid-cols-[300px,1fr]">
        <JobSearch filters={filters} onFiltersChange={setFilters} />
        <JobResults jobs={jobs} loading={loading} error={error} />
      </div>
    </div>
  );
}