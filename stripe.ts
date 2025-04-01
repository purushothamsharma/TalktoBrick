import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';
import { Order } from '../types';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const plans = {
  starter: {
    name: 'Starter',
    price: 99,
    features: [
      'Single location',
      'Basic analytics',
      'Email support',
      'Menu management'
    ]
  },
  professional: {
    name: 'Professional',
    price: 199,
    features: [
      'Up to 3 locations',
      'Advanced analytics',
      'Priority support',
      'Custom branding',
      'API access'
    ]
  },
  enterprise: {
    name: 'Enterprise',
    price: 'Custom',
    features: [
      'Unlimited locations',
      'Enterprise analytics',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantee'
    ]
  }
};

export async function createPaymentIntent(order: Order) {
  try {
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
      },
      body: JSON.stringify({
        amount: Math.round(order.totalAmount * 100), // Convert to cents
        currency: 'usd',
        orderId: order.id
      })
    });

    const { clientSecret } = await response.json();
    return clientSecret;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

export async function processPayment(order: Order, paymentMethodId: string) {
  try {
    const response = await fetch('/api/process-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
      },
      body: JSON.stringify({
        paymentMethodId,
        orderId: order.id,
        amount: Math.round(order.totalAmount * 100)
      })
    });

    const result = await response.json();
    if (result.error) throw new Error(result.error);
    return result;
  } catch (error) {
    console.error('Error processing payment:', error);
    throw error;
  }
}

export async function getPaymentStatus(orderId: string) {
  try {
    const response = await fetch(`/api/payment-status/${orderId}`, {
      headers: {
        Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
      }
    });

    return await response.json();
  } catch (error) {
    console.error('Error getting payment status:', error);
    throw error;
  }
}