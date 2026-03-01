// ─────────────────────────────────────────────
// TapMeOnce — Supabase Client
// Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env
// ─────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) as string;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    '[TapMeOnce] Missing Supabase env vars. ' +
    'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// ─── Auth helpers ─────────────────────────────

export async function signUp(email: string, password: string, metadata?: object) {
  return supabase.auth.signUp({ email, password, options: { data: metadata } });
}

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function resetPassword(email: string) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
}

// ─── Profile helpers ──────────────────────────

export async function getProfile(userId: string) {
  return supabase.from('profiles').select('*').eq('user_id', userId).single();
}

export async function getProfileByUsername(username: string) {
  return supabase.from('profiles').select('*').eq('username', username).single();
}

export async function updateProfile(userId: string, updates: object) {
  return supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('user_id', userId);
}

export async function checkUsernameAvailable(username: string): Promise<boolean> {
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single();
  return !data;
}

// ─── Links helpers ────────────────────────────

export async function getLinks(userId: string) {
  return supabase
    .from('links')
    .select('*')
    .eq('user_id', userId)
    .order('sort_order');
}

export async function upsertLink(link: object) {
  return supabase.from('links').upsert(link);
}

export async function deleteLink(linkId: string) {
  return supabase.from('links').delete().eq('id', linkId);
}

// ─── Analytics helpers ────────────────────────

export async function logEvent(event: {
  user_id: string;
  event_type: string;
  link_id?: string;
}) {
  const userAgent = navigator.userAgent;
  const isMobile = /Mobile|Android|iPhone/i.test(userAgent);
  const isTablet = /Tablet|iPad/i.test(userAgent);

  return supabase.from('analytics_events').insert({
    ...event,
    device_type: isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop',
    created_at: new Date().toISOString(),
  });
}

// ─── Leads helpers ────────────────────────────

export async function saveLead(lead: {
  card_owner_id: string;
  visitor_name: string;
  visitor_phone?: string;
  visitor_email?: string;
  tap_city?: string;
}) {
  return supabase.from('leads').insert({
    ...lead,
    captured_at: new Date().toISOString(),
  });
}

export async function getLeads(userId: string) {
  return supabase
    .from('leads')
    .select('*')
    .eq('card_owner_id', userId)
    .order('captured_at', { ascending: false });
}

// ─── Team helpers (Business plan) ────────────

export async function getTeamMembers(ownerId: string) {
  return supabase
    .from('team_members')
    .select('*')
    .eq('business_owner_id', ownerId)
    .order('created_at');
}

export async function inviteTeamMember(member: object) {
  return supabase.from('team_members').insert(member);
}

// ─── Referral helpers ─────────────────────────

export async function getReferrals(userId: string) {
  return supabase
    .from('referrals')
    .select('*')
    .eq('referrer_user_id', userId)
    .order('created_at', { ascending: false });
}

export async function createReferral(referrerId: string, email: string) {
  return supabase.from('referrals').insert({
    referrer_user_id: referrerId,
    referred_email: email,
    status: 'pending',
    created_at: new Date().toISOString(),
  });
}

// ─── Card helpers ─────────────────────────────

export async function getCard(userId: string) {
  return supabase.from('nfc_cards').select('*').eq('user_id', userId).single();
}

export async function setCardStatus(cardId: string, status: 'active' | 'inactive') {
  return supabase
    .from('nfc_cards')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', cardId);
}

// ─── Orders helpers ───────────────────────────

export async function getOrders(userId: string) {
  return supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
}

export async function getOrder(orderId: string) {
  return supabase.from('orders').select('*').eq('id', orderId).single();
}

// ─── Storage helpers ──────────────────────────

export async function uploadAvatar(userId: string, file: File): Promise<string | null> {
  const ext = file.name.split('.').pop();
  const path = `avatars/${userId}.${ext}`;
  const { error } = await supabase.storage.from('avatars').upload(path, file, {
    upsert: true,
    contentType: file.type,
  });
  if (error) return null;
  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return data.publicUrl;
}
