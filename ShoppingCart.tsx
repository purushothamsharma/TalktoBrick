import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShoppingCart } from 'use-shopping-cart';
import { X, ShoppingBag, CreditCard } from 'lucide-react';

export function ShoppingCart({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { 
    cartDetails, 
    removeItem, 
    formattedTotalPrice,
    redirectToCheckout,
    cartCount
  } = useShoppingCart();

  const handleCheckout = async () => {
    try {
      const result = await redirectToCheckout();
      if (result?.error) {
        console.error('Checkout error:', result.error);
        throw result.error;
      }
    } catch (error) {
      console.error('Failed to redirect to checkout:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brick-950/50 z-40"
          />

          {/* Cart Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-luxury-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-surface-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-brick-500" />
                <h2 className="text-lg font-semibold text-brick-950">Your Cart</h2>
                <span className="bg-brick-500/10 text-brick-500 text-sm font-medium px-2 py-1 rounded-full">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-brick-950/60 hover:text-brick-950 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {Object.values(cartDetails).map((item) => (
                <div key={item.id} className="bg-surface-50 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-brick-950">{item.name}</h3>
                    <div className="text-sm text-brick-950/70">
                      ${(item.price / 100).toFixed(2)}
                      {item.interval && <span>/{item.interval}</span>}
                      {item.oneTime && <span> one-time</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-brick-950/60 hover:text-brick-950 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {cartCount === 0 && (
                <div className="text-center py-8 text-brick-950/60">
                  Your cart is empty
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-surface-200 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-brick-950">Total</span>
                <span className="text-xl font-bold text-brick-950">{formattedTotalPrice}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={cartCount === 0}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CreditCard className="w-5 h-5" />
                Proceed to Checkout
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}