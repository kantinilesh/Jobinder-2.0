'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { UserType } from '@/types';
import Link from 'next/link';
import { Briefcase, Search, Building2, User } from 'lucide-react';

export default function DashboardPage() {
  const [userType, setUserType] = useState<UserType | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function getUserProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.user_type) {
        setUserType(user.user_metadata.user_type as UserType);
      }
    }
    getUserProfile();
  }, []);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {userType === 'employer' ? (
          <>
            <Link href="/dashboard/jobs/new">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Post a New Job
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Create a new job posting and find the perfect candidate
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/dashboard/jobs">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Manage Jobs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  View and manage your job postings
                </CardContent>
              </Card>
            </Link>
          </>
        ) : (
          <>
            <Link href="/jobs">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Find Jobs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Search and apply for jobs that match your skills
                </CardContent>
              </Card>
            </Link>
          </>
        )}
        
        <Link href="/dashboard/profile">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              Update your profile and preferences
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}