// ─────────────────────────────────────────────
// TapMeOnce — Core TypeScript Types
// ─────────────────────────────────────────────

export type PlanId = 'free' | 'professional' | 'business';
export type ProfileMode = 'personal' | 'business';
export type CardStatus = 'active' | 'inactive' | 'pending';
export type OrderStatus = 'placed' | 'confirmed' | 'in_production' | 'dispatched' | 'delivered';

export interface Plan {
  id: PlanId;
  name: string;
  price: number; // ₹/month
  yearlyPrice: number;
  cardPriceNote: string;
  description: string;
  tagline: string;
  highlighted: boolean;
  features: Feature[];
  limits: PlanLimits;
}

export interface Feature {
  label: string;
  included: boolean;
  note?: string;
}

export interface PlanLimits {
  users: number; // 1 for free/pro, 5+ for business
  profileModes: number; // 1 for free, 2 for pro+
  analytics: 'basic' | 'smart' | 'full';
  customSubdomain: boolean;
  customDomain: boolean; // business only
  leadCapture: boolean;
  aiFeatures: boolean;
  removeBranding: boolean;
  qrCode: boolean;
  cardActivation: boolean;
}

export interface UserProfile {
  id: string;
  user_id: string;
  username: string;
  full_name: string;
  email: string;
  phone: string;
  country_code: string;
  avatar_url?: string;
  designation?: string;
  company?: string;
  is_student: boolean;
  institution?: string;
  location?: string;
  bio?: string;
  bio_personal?: string;
  active_mode: ProfileMode;
  plan: PlanId;
  plan_expires_at?: string;
  is_active: boolean;
  lead_gen_consent: boolean;
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  user_id: string;
  platform: SocialPlatform | string;
  label: string;
  url: string;
  icon?: string;
  sort_order: number;
  mode: ProfileMode | 'both';
  is_active: boolean;
}

export type SocialPlatform =
  | 'linkedin'
  | 'instagram'
  | 'twitter'
  | 'facebook'
  | 'youtube'
  | 'whatsapp'
  | 'website'
  | 'email'
  | 'github'
  | 'behance'
  | 'dribbble'
  | 'medium'
  | 'telegram'
  | 'custom';

export interface NfcCard {
  id: string;
  user_id: string;
  card_type: 'pvc_standard' | 'metallic_premium';
  status: CardStatus;
  order_id?: string;
  activated_at?: string;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  plan: PlanId;
  card_type: 'pvc_standard' | 'metallic_premium';
  card_price: number;
  subscription_price: number;
  total_amount: number;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  status: OrderStatus;
  tracking_number?: string;
  shipping_address: ShippingAddress;
  created_at: string;
  updated_at: string;
}

export interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface Lead {
  id: string;
  card_owner_id: string;
  visitor_name: string;
  visitor_phone?: string;
  visitor_email?: string;
  captured_at: string;
  tap_city?: string;
  tap_device?: string;
  notes?: string;
}

export interface AnalyticsEvent {
  id: string;
  user_id: string;
  event_type: 'tap' | 'link_click' | 'vcf_download' | 'lead_form_open' | 'lead_submitted';
  link_id?: string;
  ip_address?: string;
  city?: string;
  country?: string;
  device_type?: 'mobile' | 'tablet' | 'desktop';
  os?: string;
  created_at: string;
}

export interface TeamMember {
  id: string;
  business_owner_id: string;
  user_id?: string;
  name: string;
  email: string;
  role: string;
  status: 'invited' | 'active' | 'inactive';
  card_id?: string;
  invited_at: string;
  joined_at?: string;
}

export interface Referral {
  id: string;
  referrer_user_id: string;
  referred_email: string;
  referred_user_id?: string;
  status: 'pending' | 'signed_up' | 'paid';
  created_at: string;
  converted_at?: string;
}

// Setup wizard state
export interface SetupState {
  step: number;
  plan: PlanId;
  cardType: 'pvc_standard' | 'metallic_premium';
  // Account
  fullName: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  countryCode: string;
  isStudent: boolean;
  company: string;
  // Profile
  avatarFile?: File;
  designation: string;
  bio: string;
  location: string;
  // Links
  links: Partial<SocialLink>[];
  whatsappSameAsPhone: boolean;
  whatsappNumber?: string;
  // Shipping
  shippingAddress: Partial<ShippingAddress>;
  // Consent
  leadGenConsent: boolean;
  referralCode: string;
}
