import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInUser, signUpUser } from '../lib/auth';
import { toast } from 'sonner';

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onModeChange: (mode: 'signin' | 'signup') => void;
}

export function AuthForm({ mode, onModeChange }: AuthFormProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    name: ''
  });

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: '',
      name: ''
    };

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Name validation (only for signup)
    if (mode === 'signup' && !formData.name) {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({ email: '', password: '', name: '' });

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const { error } = await signUpUser(formData.email, formData.password, formData.name);
        if (error) {
          if (error.message.includes('weak_password')) {
            setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }));
            return;
          }
          throw error;
        }
        toast.success('Account created successfully! Please check your email to verify your account.');
        onModeChange('signin'); // Switch to sign in mode after successful signup
      } else {
        const { data, error } = await signInUser(formData.email, formData.password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Invalid email or password');
            return;
          }
          throw error;
        }
        if (data?.user) {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === 'signup' && (
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-brick-950">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className={`input-field ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-brick-950">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className={`input-field ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-brick-950">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
          className={`input-field ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password}</p>
        )}
        {mode === 'signup' && !errors.password && (
          <p className="mt-1 text-sm text-brick-950/70">Password must be at least 6 characters</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
      </button>

      <p className="text-sm text-center text-brick-950/70">
        {mode === 'signin' ? (
          <>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => onModeChange('signup')}
              className="text-brick-600 hover:text-brick-700"
            >
              Sign Up
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => onModeChange('signin')}
              className="text-brick-600 hover:text-brick-700"
            >
              Sign In
            </button>
          </>
        )}
      </p>
    </form>
  );
}