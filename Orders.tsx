import React, { useEffect, useState, useRef } from 'react';
import { format, isToday, isThisWeek } from 'date-fns';
import { Filter, RefreshCw, ChefHat, CheckCircle, XCircle, Clock, Volume2, VolumeX } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { supabase } from '../lib/supabase';
import { Order } from '../types';

type TimeFilter = 'all' | 'today' | 'week';
type OrderStatus = 'confirmed' | 'preparing' | 'ready' | 'served' | 'cancelled';

const orderSound = new Audio('/notification.mp3');

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('today');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const newOrdersRef = useRef<Set<string>>(new Set());
  const isVisibleRef = useRef(true);

  useEffect(() => {
    // Handle visibility change
    const handleVisibilityChange = () => {
      isVisibleRef.current = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial fetch
    fetchOrders();

    // Subscribe to changes
    const channel = supabase
      .channel('orders_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          if (payload.eventType === 'INSERT' && payload.new.status === 'confirmed') {
            handleNewOrder(payload.new);
          } else {
            fetchOrders();
          }
        }
      )
      .subscribe();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      supabase.removeChannel(channel);
    };
  }, [timeFilter]);

  const handleNewOrder = async (order: any) => {
    // Only notify if we're on the admin page and the tab is visible
    if (!isVisibleRef.current) {
      // If tab is not visible, show a browser notification
      if (Notification.permission === 'granted') {
        new Notification('New Order Received', {
          body: `Order #${order.id.slice(-6)} has been placed`,
          icon: '/logo.png'
        });
      }
    }

    // Play sound if enabled
    if (soundEnabled) {
      try {
        await orderSound.play();
      } catch (error) {
        console.error('Error playing sound:', error);
      }
    }

    // Show toast notification
    toast('New Order Received', {
      description: `Order #${order.id.slice(-6)} has been placed`,
      duration: 5000,
    });

    // Add to new orders set
    newOrdersRef.current.add(order.id);
    
    // Remove highlight after 10 seconds
    setTimeout(() => {
      newOrdersRef.current.delete(order.id);
      fetchOrders(); // Refresh to update UI
    }, 10000);

    // Refresh orders
    fetchOrders();
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .not('status', 'eq', 'draft')
        .order('confirmed_at', { ascending: false });

      if (error) throw error;

      const parsedOrders: Order[] = data.map(order => ({
        ...order,
        created_at: new Date(order.created_at),
        updated_at: new Date(order.updated_at),
        confirmed_at: order.confirmed_at ? new Date(order.confirmed_at) : undefined,
        items: order.items
      }));

      // Apply time filter
      const filteredOrders = parsedOrders.filter(order => {
        if (!order.confirmed_at) return false;
        switch (timeFilter) {
          case 'today':
            return isToday(order.confirmed_at);
          case 'week':
            return isThisWeek(order.confirmed_at);
          default:
            return true;
        }
      });

      setOrders(filteredOrders);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;
      
      // Optimistically update local state
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status, updated_at: new Date() }
          : order
      ));

      // Show toast notification for status change
      toast.success(`Order #${orderId.slice(-6)} marked as ${status}`);
    } catch (err) {
      console.error('Error updating order:', err);
      setError('Failed to update order status');
      toast.error('Failed to update order status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'served':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Request notification permission on mount
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="min-h-screen bg-surface-50 p-6">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-brick-950">Order Management</h1>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg ${
                soundEnabled ? 'text-brick-600' : 'text-brick-950/40'
              }`}
              title={soundEnabled ? 'Disable sound' : 'Enable sound'}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-brick-950/60" />
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
                className="rounded-lg border-surface-200 text-sm focus:ring-brick-500 focus:border-brick-500"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="all">All Orders</option>
              </select>
            </div>
            
            <button
              onClick={fetchOrders}
              className="p-2 text-brick-950/60 hover:text-brick-950 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brick-500 mx-auto"></div>
            <p className="mt-4 text-brick-950/60">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-luxury">
            <p className="text-brick-950/60">No orders found for the selected period</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className={`bg-white rounded-lg shadow-luxury p-6 transition-all duration-500 ${
                  newOrdersRef.current.has(order.id!)
                    ? 'ring-2 ring-brick-500 animate-pulse'
                    : ''
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-brick-950">
                        Order #{order.id?.slice(-6)}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-brick-950/60">
                      {order.confirmed_at && format(order.confirmed_at, 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    {order.status === 'confirmed' && (
                      <button
                        onClick={() => updateOrderStatus(order.id!, 'preparing')}
                        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        title="Start Preparing"
                      >
                        <ChefHat className="w-5 h-5" />
                      </button>
                    )}
                    
                    {order.status === 'preparing' && (
                      <button
                        onClick={() => updateOrderStatus(order.id!, 'ready')}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Mark as Ready"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    )}
                    
                    {order.status === 'ready' && (
                      <button
                        onClick={() => updateOrderStatus(order.id!, 'served')}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Mark as Served"
                      >
                        <Clock className="w-5 h-5" />
                      </button>
                    )}
                    
                    {['confirmed', 'preparing'].includes(order.status) && (
                      <button
                        onClick={() => updateOrderStatus(order.id!, 'cancelled')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Cancel Order"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start text-sm">
                      <div>
                        <div className="font-medium text-brick-950">{item.quantity}x {item.item.name}</div>
                        {Object.entries(item.customizations).length > 0 && (
                          <div className="text-brick-950/60 text-xs ml-4">
                            {Object.entries(item.customizations).map(([key, value]) => (
                              <div key={key}>{key}: {value}</div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="font-medium text-brick-950">${item.totalPrice.toFixed(2)}</div>
                    </div>
                  ))}
                  
                  <div className="pt-3 mt-3 border-t border-surface-200 flex justify-between items-center font-semibold text-brick-950">
                    <span>Total</span>
                    <span>${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}