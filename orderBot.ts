import { supabase } from './supabase';
import { Order } from '../types';

export const subscribeToOrders = (restaurantId: string, onOrder: (order: Order) => void) => {
  const channel = supabase
    .channel('orders')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'orders',
        filter: `restaurant_id=eq.${restaurantId}`
      },
      (payload) => {
        onOrder(payload.new as Order);
        
        // Play notification sound
        const audio = new Audio('/notification.mp3');
        audio.play().catch(console.error);
        
        // Show browser notification if permission granted
        if (Notification.permission === 'granted') {
          new Notification('New Order Received', {
            body: `Order #${payload.new.id.slice(-6)} has been placed`,
            icon: '/vila-labs-icon.svg'
          });
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const updateOrderStatus = async (
  orderId: string, 
  status: 'confirmed' | 'preparing' | 'ready' | 'served' | 'cancelled'
) => {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);

  if (error) throw error;
};

export const getRestaurantOrders = async (restaurantId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};