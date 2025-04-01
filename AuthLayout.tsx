import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { createDemoUser } from '../lib/auth';
import { BrickBot } from './BrickBot';
import { AuthForm } from './AuthForm';
import { useAuth } from '../lib/auth';

export function AuthLayout() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const { user } = useAuth();

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleDemoAccess = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await createDemoUser();
      if (error) throw error;
      if (data.user) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error accessing demo:', error);
      toast.error('Failed to access demo', {
        description: error instanceof Error ? error.message : 'Please try again'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-3">
              <BrickBot size="sm" expression="happy" />
              <span className="text-xl font-bold text-brick-600">Brick</span>
            </Link>
            <Link 
              to="/"
              className="flex items-center text-brick-950/60 hover:text-brick-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Back to Home
            </Link>
          </div>

          <div className="mt-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-brick-950">Welcome to BFF</h2>
              <p className="mt-2 text-sm text-brick-950/70">
                {authMode === 'signin' 
                  ? 'Sign in to your account or try our demo'
                  : 'Create a new account to get started'
                }
              </p>
              <button
                onClick={handleDemoAccess}
                disabled={isLoading}
                className="mt-4 w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Accessing demo...' : 'Try Demo Account'}
              </button>
            </div>

            <AuthForm mode={authMode} onModeChange={setAuthMode} />
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="hidden lg:block relative w-0 flex-1">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf"
          alt="Restaurant interior"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brick-950/50 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-12">
            <div className="max-w-xl text-white">
              <h3 className="text-2xl font-bold mb-4">Transform Your Restaurant</h3>
              <p className="text-lg text-white/80">
                Join thousands of restaurants using Brick to streamline operations, 
                increase revenue, and delight customers with AI-powered ordering.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}