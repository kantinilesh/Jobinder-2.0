'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { signIn, signUp } from '@/lib/auth';
import { UserType } from '@/types';
import { useToast } from '@/hooks/use-toast';

export function AuthForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userType, setUserType] = useState<UserType>('job_seeker');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!email || !password) {
      setError('Email and password are required');
      return false;
    }
    if (!isLogin && !fullName) {
      setError('Full name is required for registration');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      if (isLogin) {
        const { data, error } = await signIn(email, password);
        if (error) throw error;
        
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
        });
        
        router.push('/dashboard');
        router.refresh();
      } else {
        const { data, error } = await signUp(email, password, {
          full_name: fullName,
          user_type: userType,
        });
        
        if (error) throw error;
        
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
        
        // Automatically sign in after registration
        const { error: signInError } = await signIn(email, password);
        if (signInError) throw signInError;
        
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: err.message || 'An error occurred during authentication',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      {!isLogin && (
        <>
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>I am a:</Label>
            <RadioGroup 
              value={userType} 
              onValueChange={(value: UserType) => setUserType(value)}
              disabled={isLoading}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="job_seeker" id="job_seeker" />
                <Label htmlFor="job_seeker">Job Seeker</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="employer" id="employer" />
                <Label htmlFor="employer">Employer</Label>
              </div>
            </RadioGroup>
          </div>
        </>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
      </Button>

      <Button
        type="button"
        variant="ghost"
        className="w-full"
        onClick={() => setIsLogin(!isLogin)}
        disabled={isLoading}
      >
        {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
      </Button>
    </form>
  );
}