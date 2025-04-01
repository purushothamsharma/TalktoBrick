import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Lock } from 'lucide-react';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Order } from '../types';
import { processPayment } from '../lib/stripe';
import { toast } from 'sonner';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface PaymentModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function PaymentForm({ order, onClose, onSuccess }: Omit<PaymentModalProps, 'isOpen'>) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error('Card element not found');

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) throw error;

      await processPayment(order, paymentMethod.id);
      toast.success('Payment processed successfully!');
      onSuccess();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="p-4 bg-surface-50 rounded-xl border border-surface-200">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#1a1a1a',
                  '::placeholder': {
                    color: '#a0aec0',
                  },
                },
              },
            }}
          />
        </div>

        <div className="flex items-center gap-2 text-sm text-brick-950/60">
          <Lock className="w-4 h-4" />
          Secure payment powered by Stripe
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={processing}
          className="flex-1 btn-primary disabled:opacity-50"
        >
          {processing ? 'Processing...' : `Pay $${order.totalAmount.toFixed(2)}`}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={processing}
          className="btn-outline"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export function PaymentModal({ order, isOpen, onClose, onSuccess }: PaymentModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brick-950/50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md bg-white rounded-2xl shadow-luxury-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brick-500/10 rounded-lg">
                  <CreditCard className="w-6 h-6 text-brick-500" />
                </div>
                <h3 className="text-xl font-bold text-brick-950">Payment</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-brick-950/60 hover:text-brick-950 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <Elements stripe={stripePromise}>
              <PaymentForm
                order={order}
                onClose={onClose}
                onSuccess={onSuccess}
              />
            </Elements>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}