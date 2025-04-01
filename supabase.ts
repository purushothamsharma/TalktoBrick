import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';
import { Order } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-application-name': 'brick-food'
    }
  },
  db: {
    schema: 'public'
  }
});

// Add request interceptor for error handling
supabase.handleError = (error: any) => {
  console.error('Supabase Error:', error);
  // Add error reporting service here
};

// Add response interceptor for data sanitization
supabase.handleResponse = (response: any) => {
  // Add response sanitization here
  return response;
};

// Enhanced order management functions
export async function saveOrder(order: Order): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user?.id) {
      return { success: false, error: 'User not authenticated' };
    }

    const { error } = await supabase
      .from('orders')
      .insert({
        user_id: user.user.id,
        items: order.items,
        total_amount: order.totalAmount,
        status: order.status,
        confirmed_at: order.status === 'confirmed' ? new Date().toISOString() : null,
        metadata: {
          customizations: order.items.flatMap(item => Object.entries(item.customizations)),
          specialInstructions: order.specialInstructions,
          timeOfDay: new Date().getHours()
        }
      });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error saving order:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to save order' 
    };
  }
}

export async function getLastOrder(): Promise<Order | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'confirmed')
      .order('confirmed_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      items: data.items,
      totalAmount: data.total_amount,
      status: data.status,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at),
      confirmed_at: data.confirmed_at ? new Date(data.confirmed_at) : undefined
    };
  } catch (error) {
    console.error('Error fetching last order:', error);
    return null;
  }
}

export async function getOrderHistory(): Promise<Order[] | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('confirmed_at', { ascending: false })
      .limit(10);

    if (error || !data) return null;

    return data.map(order => ({
      id: order.id,
      items: order.items,
      totalAmount: order.total_amount,
      status: order.status,
      created_at: new Date(order.created_at),
      updated_at: new Date(order.updated_at),
      confirmed_at: order.confirmed_at ? new Date(order.confirmed_at) : undefined
    }));
  } catch (error) {
    console.error('Error fetching order history:', error);
    return null;
  }
}