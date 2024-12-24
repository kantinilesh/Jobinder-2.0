'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SkillSelect } from '@/components/jobs/SkillSelect';
import { Card } from '@/components/ui/card';

interface JobSearchProps {
  filters: {
    query: string;
    location: string;
    experienceLevel: string;
    employmentType: string;
    remoteOnly: boolean;
    skills: string[];
    salaryMin: string;
    salaryMax: string;
  };
  onFiltersChange: (filters: any) => void;
}

export function JobSearch({ filters, onFiltersChange }: JobSearchProps) {
  const handleChange = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <Card className="p-4 space-y-6">
      <div className="space-y-2">
        <Label htmlFor="query">Search Jobs</Label>
        <Input
          id="query"
          placeholder="Job title or keyword"
          value={filters.query}
          onChange={(e) => handleChange('query', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="City or remote"
          value={filters.location}
          onChange={(e) => handleChange('location', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="experienceLevel">Experience Level</Label>
        <select
          id="experienceLevel"
          className="w-full rounded-md border border-input bg-background px-3 py-2"
          value={filters.experienceLevel}
          onChange={(e) => handleChange('experienceLevel', e.target.value)}
        >
          <option value="">Any Level</option>
          <option value="entry">Entry Level</option>
          <option value="mid">Mid Level</option>
          <option value="senior">Senior Level</option>
          <option value="lead">Lead</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="employmentType">Employment Type</Label>
        <select
          id="employmentType"
          className="w-full rounded-md border border-input bg-background px-3 py-2"
          value={filters.employmentType}
          onChange={(e) => handleChange('employmentType', e.target.value)}
        >
          <option value="">Any Type</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
          <option value="internship">Internship</option>
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="remoteOnly"
          checked={filters.remoteOnly}
          onCheckedChange={(checked) => handleChange('remoteOnly', checked)}
        />
        <Label htmlFor="remoteOnly">Remote Only</Label>
      </div>

      <div className="space-y-2">
        <Label>Skills</Label>
        <SkillSelect
          selectedSkills={filters.skills}
          onSkillsChange={(skills) => handleChange('skills', skills)}
        />
      </div>

      <div className="space-y-2">
        <Label>Salary Range</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Min"
            value={filters.salaryMin}
            onChange={(e) => handleChange('salaryMin', e.target.value)}
          />
          <Input
            placeholder="Max"
            value={filters.salaryMax}
            onChange={(e) => handleChange('salaryMax', e.target.value)}
          />
        </div>
      </div>
    </Card>
  );
}