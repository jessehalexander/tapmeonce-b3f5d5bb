// ─────────────────────────────────────────────
// TapMeOnce — Plans Configuration
// Indian pricing: Free / ₹299 Professional / ₹999 Business
// ─────────────────────────────────────────────

import { Plan, PlanId } from '@/types';

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    yearlyPrice: 0,
    cardPriceNote: 'PVC ₹499 • Metal ₹1,499',
    description: 'Included with every card purchase',
    tagline: 'A simple digital presence — replace paper cards forever.',
    highlighted: false,
    limits: {
      users: 1,
      profileModes: 1,
      analytics: 'basic',
      customSubdomain: false,
      customDomain: false,
      leadCapture: false,
      aiFeatures: false,
      removeBranding: false,
      qrCode: true,
      cardActivation: true,
    },
    features: [
      { label: 'Digital Profile Page', included: true, note: 'Name, photo, designation, bio' },
      { label: 'Unlimited Social Links', included: true },
      { label: 'WhatsApp Direct Link', included: true },
      { label: 'QR Code', included: true },
      { label: 'Real-Time Profile Editing', included: true },
      { label: 'Basic Tap Counter', included: true },
      { label: 'vCard / Contact Save', included: true },
      { label: 'Smart Analytics', included: false },
      { label: 'Lead Capture Form', included: false },
      { label: 'AI Bio Generator', included: false },
      { label: 'Remove TapMeOnce Branding', included: false },
      { label: 'Custom Subdomain', included: false },
      { label: 'Personal & Business Profiles', included: false },
      { label: 'Card Activate / Deactivate', included: true },
    ],
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    price: 299,
    yearlyPrice: 2990,
    cardPriceNote: 'PVC ₹499 • Metal ₹1,499 — ₹299/mo per card',
    description: 'For freelancers, consultants & sales professionals',
    tagline: 'Capture leads, track engagement, and show two faces — work & personal.',
    highlighted: true,
    limits: {
      users: 1,
      profileModes: 2,
      analytics: 'smart',
      customSubdomain: true,
      customDomain: false,
      leadCapture: true,
      aiFeatures: true,
      removeBranding: true,
      qrCode: true,
      cardActivation: true,
    },
    features: [
      { label: 'Everything in Free', included: true },
      { label: 'Smart Analytics Dashboard', included: true, note: 'Taps, link clicks, city, device' },
      { label: 'Lead Capture Form', included: true, note: 'Visitors share details voluntarily' },
      { label: 'AI Bio Generator', included: true, note: '3 tones: formal, friendly, bold' },
      { label: 'Remove TapMeOnce Branding', included: true },
      { label: 'Custom Subdomain', included: true, note: 'yourname.tapmeonce.com' },
      { label: 'Personal & Business Profiles', included: true, note: 'Switch modes from dashboard' },
      { label: 'WhatsApp Lead Alerts', included: true },
      { label: 'Card Activate / Deactivate', included: true },
      { label: 'Multi-User Team', included: false },
      { label: 'Custom Domain', included: false },
      { label: 'Team Admin Dashboard', included: false },
    ],
  },
  business: {
    id: 'business',
    name: 'Business',
    price: 999,
    yearlyPrice: 9990,
    cardPriceNote: 'Min 5 users — ₹200/mo per card (save 33%)',
    description: 'For teams, startups & enterprises',
    tagline: 'One subscription, your whole team. Custom domain, CRM-ready analytics.',
    highlighted: false,
    limits: {
      users: 5,
      profileModes: 2,
      analytics: 'full',
      customSubdomain: true,
      customDomain: true,
      leadCapture: true,
      aiFeatures: true,
      removeBranding: true,
      qrCode: true,
      cardActivation: true,
    },
    features: [
      { label: 'Everything in Professional', included: true },
      { label: 'Minimum 5 Team Members', included: true },
      { label: 'Custom Domain', included: true, note: 'yourcompany.com/team/name' },
      { label: 'Team Admin Dashboard', included: true },
      { label: 'Centralized Lead Management', included: true },
      { label: 'Full Analytics Suite', included: true, note: 'Across all team members' },
      { label: 'Single Payment & Billing', included: true, note: 'Admin pays for whole team' },
      { label: 'Add Team Members Anytime', included: true, note: '+₹200/mo per additional user' },
      { label: 'Priority Support', included: true },
      { label: 'WhatsApp Business Alerts', included: true },
    ],
  },
};

export const PLAN_LIST = Object.values(PLANS);

export function getPlan(id: PlanId): Plan {
  return PLANS[id];
}

export function getPlanColor(id: PlanId): string {
  switch (id) {
    case 'professional': return 'text-primary';
    case 'business': return 'text-amber-400';
    default: return 'text-muted-foreground';
  }
}

export function isFeatureAllowed(plan: PlanId, feature: keyof Plan['limits']): boolean {
  return !!PLANS[plan].limits[feature];
}

export const CARD_PRICES = {
  pvc_standard: 499,
  metallic_premium: 1499,
};

export const REFERRAL_CONFIG = {
  referralsNeededForFreeYear: 3,
  rewardDescription: 'Get 1 year free subscription',
};

// Per-card cost by plan (for display motivation)
export function getPerCardCost(plan: PlanId): string {
  switch (plan) {
    case 'free': return '₹0/mo';
    case 'professional': return '₹299/mo';
    case 'business': return '₹200/mo';
    default: return '';
  }
}
