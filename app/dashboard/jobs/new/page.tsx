'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { JobForm } from '@/components/jobs/JobForm';
import { supabase } from '@/lib/supabase';

export default function NewJobPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .single();

      if (!profile) throw new Error('Profile not found');

      const { error } = await supabase.from('jobs').insert({
        employer_id: profile.id,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        salary_range: formData.salaryRange,
        required_skills: formData.skills,
        experience_level: formData.experienceLevel,
      });

      if (error) throw error;
      router.push('/dashboard/jobs');
    } catch (error) {
      console.error('Error creating job:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-3xl py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Job Posting</h1>
      <JobForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}