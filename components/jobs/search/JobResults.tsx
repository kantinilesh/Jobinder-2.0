import { Job } from '@/types';
import { JobList } from '@/components/jobs/JobList';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface JobResultsProps {
  jobs: Job[];
  loading: boolean;
  error: string | null;
}

export function JobResults({ jobs, loading, error }: JobResultsProps) {
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return <JobList jobs={jobs} loading={loading} />;
}