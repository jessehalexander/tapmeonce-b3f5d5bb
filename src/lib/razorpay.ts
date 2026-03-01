// ─────────────────────────────────────────────
// TapMeOnce — Razorpay Integration
// Set VITE_RAZORPAY_KEY_ID in .env
// ─────────────────────────────────────────────

import { PlanId } from '@/types';
import { PLANS, CARD_PRICES } from './plans';

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID as string;

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Load Razorpay checkout script dynamically
export function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export interface PaymentOptions {
  orderId: string;         // Razorpay order ID from your backend
  amount: number;          // Amount in paise (₹1 = 100 paise)
  currency: string;        // 'INR'
  name: string;            // Customer name
  email: string;
  phone: string;
  plan: PlanId;
  description: string;
  onSuccess: (paymentId: string, orderId: string, signature: string) => void;
  onFailure: (error: any) => void;
}

export async function initiatePayment(opts: PaymentOptions): Promise<void> {
  const loaded = await loadRazorpay();
  if (!loaded) {
    opts.onFailure(new Error('Razorpay failed to load'));
    return;
  }

  const options = {
    key: RAZORPAY_KEY,
    amount: opts.amount,
    currency: opts.currency || 'INR',
    name: 'TapMeOnce',
    description: opts.description,
    order_id: opts.orderId,
    prefill: {
      name: opts.name,
      email: opts.email,
      contact: opts.phone,
    },
    notes: {
      plan: opts.plan,
    },
    theme: {
      color: '#C9A227', // TapMeOnce gold
    },
    modal: {
      ondismiss: () => opts.onFailure(new Error('Payment dismissed')),
    },
    handler: function (response: any) {
      opts.onSuccess(
        response.razorpay_payment_id,
        response.razorpay_order_id,
        response.razorpay_signature
      );
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
}

export function calculateOrderTotal(
  plan: PlanId,
  cardType: 'pvc_standard' | 'metallic_premium',
  billingCycle: 'monthly' | 'yearly',
  teamSize = 1
): {
  cardPrice: number;
  subscriptionPrice: number;
  subscriptionLabel: string;
  total: number;
  savings?: number;
} {
  const cardPrice = CARD_PRICES[cardType];
  const planData = PLANS[plan];

  let subscriptionPrice = 0;
  let subscriptionLabel = '';
  let savings: number | undefined;

  if (plan !== 'free') {
    if (plan === 'business') {
      const baseUsers = Math.max(teamSize, 5);
      if (billingCycle === 'yearly') {
        subscriptionPrice = planData.yearlyPrice * baseUsers / 5;
        subscriptionLabel = `₹${subscriptionPrice}/year (${baseUsers} users)`;
        savings = planData.price * 12 - planData.yearlyPrice;
      } else {
        subscriptionPrice = (planData.price / 5) * baseUsers;
        subscriptionLabel = `₹${subscriptionPrice}/month (${baseUsers} users)`;
      }
    } else {
      if (billingCycle === 'yearly') {
        subscriptionPrice = planData.yearlyPrice;
        subscriptionLabel = `₹${subscriptionPrice}/year`;
        savings = planData.price * 12 - planData.yearlyPrice;
      } else {
        subscriptionPrice = planData.price;
        subscriptionLabel = `₹${subscriptionPrice}/month`;
      }
    }
  }

  return {
    cardPrice,
    subscriptionPrice,
    subscriptionLabel,
    total: cardPrice + subscriptionPrice,
    savings,
  };
}
