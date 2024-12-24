import { AuthForm } from '@/components/auth/AuthForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">JobMatch</h1>
        <p className="text-gray-600">Find your perfect job match</p>
      </div>
      <AuthForm />
    </main>
  );
}