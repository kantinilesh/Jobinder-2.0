import { Job } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Briefcase, DollarSign } from 'lucide-react';

interface JobListProps {
  jobs: Job[];
  loading: boolean;
}

export function JobList({ jobs, loading }: JobListProps) {
  if (loading) {
    return <div>Loading jobs...</div>;
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No jobs posted yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job) => (
        <Card key={job.id}>
          <CardHeader>
            <CardTitle>{job.title}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {job.location || 'Remote'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                {job.salary_range || 'Competitive'}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                {job.experience_level || 'Not specified'}
              </div>
              <div className="flex flex-wrap gap-2">
                {job.required_skills?.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}