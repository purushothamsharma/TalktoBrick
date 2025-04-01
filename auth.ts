import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { toast } from 'sonner';
import { UserProfile } from '../types';

// Hook for managing auth state
export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        toast.error('Error getting session');
        setIsLoading(false);
        return;
      }

      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.name,
          role: session.user.user_metadata.role || 'user'
        });
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata.name,
            role: session.user.user_metadata.role || 'user'
          });

          if (event === 'SIGNED_IN') {
            toast.success('Signed in successfully');
          }
        } else {
          setUser(null);
          if (event === 'SIGNED_OUT') {
            toast.success('Signed out successfully');
          }
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const isAdmin = user?.role === 'admin';

  return { user, isLoading, isAdmin };
}

// Auth utility functions
export async function signUpUser(email: string, password: string, name: string) {
  try {
    if (password.length < 6) {
      return { 
        data: null, 
        error: new Error('Password must be at least 6 characters') 
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: 'user'
        }
      }
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error signing up:', error);
    return { data: null, error };
  }
}

export async function signInUser(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error signing in:', error);
    return { data: null, error };
  }
}

export async function signOutUser() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error signing out:', error);
    return { error };
  }
}

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { user, error: null };
  } catch (error) {
    console.error('Error getting current user:', error);
    return { user: null, error };
  }
}

// Demo user function
export async function createDemoUser() {
  try {
    // Generate a random demo user
    const demoId = crypto.randomUUID().slice(0, 8);
    const email = `demo${demoId}@brick.demo`;
    const password = crypto.randomUUID();

    // Try to create new demo user
    const { data, error } = await signUpUser(email, password, 'Demo User');
    if (error) throw error;

    // Sign in immediately
    const { data: signInData, error: signInError } = await signInUser(email, password);
    if (signInError) throw signInError;

    toast.success('Demo account ready');
    return { data: signInData, error: null };
  } catch (error) {
    console.error('Error in createDemoUser:', error);
    return { data: null, error };
  }
}