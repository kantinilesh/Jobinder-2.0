'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SkillSelect } from '@/components/jobs/SkillSelect';

const jobSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  location: z.string().min(2, 'Location is required'),
  salaryRange: z.string().min(1, 'Salary range is required'),
  experienceLevel: z.string().min(1, 'Experience level is required'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
});

interface JobFormProps {
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
  initialData?: any;
}

export function JobForm({ onSubmit, isSubmitting, initialData }: JobFormProps) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(initialData?.skills || []);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: initialData || {},
  });

  const handleFormSubmit = async (data: any) => {
    await onSubmit({ ...data, skills: selectedSkills });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Job Title</Label>
        <Input
          id="title"
          {...register('title')}
          placeholder="e.g., Senior Frontend Developer"
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message as string}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Job Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Describe the role, responsibilities, and requirements..."
          rows={6}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message as string}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            {...register('location')}
            placeholder="e.g., New York, NY"
          />
          {errors.location && (
            <p className="text-sm text-red-500">{errors.location.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="salaryRange">Salary Range</Label>
          <Input
            id="salaryRange"
            {...register('salaryRange')}
            placeholder="e.g., $80,000 - $120,000"
          />
          {errors.salaryRange && (
            <p className="text-sm text-red-500">{errors.salaryRange.message as string}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="experienceLevel">Experience Level</Label>
        <select
          id="experienceLevel"
          {...register('experienceLevel')}
          className="w-full rounded-md border border-input bg-background px-3 py-2"
        >
          <option value="">Select experience level</option>
          <option value="entry">Entry Level</option>
          <option value="mid">Mid Level</option>
          <option value="senior">Senior Level</option>
          <option value="lead">Lead</option>
        </select>
        {errors.experienceLevel && (
          <p className="text-sm text-red-500">{errors.experienceLevel.message as string}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Required Skills</Label>
        <SkillSelect
          selectedSkills={selectedSkills}
          onSkillsChange={setSelectedSkills}
        />
        {errors.skills && (
          <p className="text-sm text-red-500">{errors.skills.message as string}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Creating...' : 'Create Job Posting'}
      </Button>
    </form>
  );
}