import React, { useEffect, useState } from 'react';
import { Bell, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { subscribeToOrders, updateOrderStatus } from '../lib/orderBot';
import { Order } from '../types';
import { toast } from 'sonner';

interface OrderNotificationsProps {
  restaurantId: string;
}

export function OrderNotifications({ restaurantId }: OrderNotificationsProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Subscribe to orders
    const unsubscribe = subscribeToOrders(restaurantId, (order) => {
      setOrders(prev => [order, ...prev]);
      toast.success('New order received!', {
        description: `Order #${order.id.slice(-6)} has been placed`
      });
    });

    return () => {
      unsubscribe();
    };
  }, [restaurantId]);

  const handleStatusUpdate = async (orderId: string, status: Order['status']) => {
    try {
      await updateOrderStatus(orderId, status);
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId ? { ...order, status } : order
        )
      );
      toast.success(`Order #${orderId.slice(-6)} marked as ${status}`);
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order status');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-brick-950/60 hover:text-brick-950"
      >
        <Bell className="w-6 h-6" />
        {orders.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-brick-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {orders.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-luxury border border-surface-200 overflow-hidden"
          >
            <div className="p-4 border-b border-surface-200">
              <h3 className="font-semibold">Orders</h3>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {orders.length === 0 ? (
                <div className="p-4 text-center text-brick-950/60">
                  No new orders
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 border-b border-surface-200 hover:bg-surface-50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-medium">
                          Order #{order.id.slice(-6)}
                        </span>
                        <p className="text-sm text-brick-950/60">
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                      </div>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'ready' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'served' ? 'bg-purple-100 text-purple-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.quantity}x {item.item.name}</span>
                          <span>${item.totalPrice.toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-surface-200 flex justify-between font-medium">
                        <span>Total</span>
                        <span>${order.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {order.status === 'confirmed' && (
                        <button
                          onClick={() => handleStatusUpdate(order.id!, 'preparing')}
                          className="btn-primary flex-1 py-2"
                        >
                          Start Preparing
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button
                          onClick={() => handleStatusUpdate(order.id!, 'ready')}
                          className="btn-primary flex-1 py-2"
                        >
                          Mark as Ready
                        </button>
                      )}
                      {order.status === 'ready' && (
                        <button
                          onClick={() => handleStatusUpdate(order.id!, 'served')}
                          className="btn-primary flex-1 py-2"
                        >
                          Mark as Served
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}