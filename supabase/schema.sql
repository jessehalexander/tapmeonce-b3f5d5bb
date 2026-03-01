-- ─────────────────────────────────────────────────────────────────
-- TapMeOnce — Supabase Database Schema
-- Run this in your Supabase SQL editor (Dashboard → SQL Editor)
-- ─────────────────────────────────────────────────────────────────

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── Profiles ─────────────────────────────────────────────────────
create table if not exists profiles (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references auth.users(id) on delete cascade not null unique,
  username      text not null unique,
  full_name     text not null,
  email         text not null,
  phone         text,
  country_code  text default '+91',
  avatar_url    text,
  designation   text,
  company       text,
  institution   text,
  is_student    boolean default false,
  bio           text,
  bio_personal  text,
  location      text,
  active_mode   text check (active_mode in ('business', 'personal')) default 'business',
  plan          text check (plan in ('free', 'professional', 'business')) default 'free',
  plan_expires_at timestamptz,
  is_active     boolean default true,
  lead_gen_consent boolean default false,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ─── Links ────────────────────────────────────────────────────────
create table if not exists links (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  platform    text not null,
  label       text,
  url         text not null,
  sort_order  integer default 0,
  mode        text check (mode in ('business', 'personal', 'both')) default 'both',
  is_active   boolean default true,
  created_at  timestamptz default now()
);

-- ─── NFC Cards ────────────────────────────────────────────────────
create table if not exists nfc_cards (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid references auth.users(id) on delete cascade not null,
  card_type    text check (card_type in ('pvc_standard', 'metallic_premium')) default 'pvc_standard',
  status       text check (status in ('active', 'inactive', 'pending')) default 'pending',
  order_id     uuid,
  activated_at timestamptz,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- ─── Orders ───────────────────────────────────────────────────────
create table if not exists orders (
  id                    uuid primary key default uuid_generate_v4(),
  user_id               uuid references auth.users(id) on delete set null,
  plan                  text,
  card_type             text,
  card_price            integer,
  subscription_price    integer,
  total_amount          integer,
  razorpay_order_id     text,
  razorpay_payment_id   text,
  razorpay_signature    text,
  status                text check (status in ('placed','confirmed','in_production','dispatched','delivered')) default 'placed',
  tracking_number       text,
  shipping_address      jsonb,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

-- ─── Analytics Events ─────────────────────────────────────────────
create table if not exists analytics_events (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid references auth.users(id) on delete cascade not null,
  event_type   text not null, -- 'tap', 'link_click', 'vcf_download', 'lead_form_open', 'lead_submitted'
  link_id      uuid references links(id) on delete set null,
  ip_address   text,
  city         text,
  country      text default 'IN',
  device_type  text check (device_type in ('mobile', 'tablet', 'desktop')),
  os           text,
  created_at   timestamptz default now()
);

-- ─── Leads ────────────────────────────────────────────────────────
create table if not exists leads (
  id              uuid primary key default uuid_generate_v4(),
  card_owner_id   uuid references auth.users(id) on delete cascade not null,
  visitor_name    text not null,
  visitor_phone   text,
  visitor_email   text,
  captured_at     timestamptz default now(),
  tap_city        text,
  tap_device      text,
  notes           text
);

-- ─── Team Members ─────────────────────────────────────────────────
create table if not exists team_members (
  id                  uuid primary key default uuid_generate_v4(),
  business_owner_id   uuid references auth.users(id) on delete cascade not null,
  user_id             uuid references auth.users(id) on delete set null,
  name                text not null,
  email               text not null,
  role                text,
  status              text check (status in ('invited', 'active', 'inactive')) default 'invited',
  card_id             uuid references nfc_cards(id) on delete set null,
  invited_at          timestamptz default now(),
  joined_at           timestamptz
);

-- ─── Referrals ────────────────────────────────────────────────────
create table if not exists referrals (
  id                uuid primary key default uuid_generate_v4(),
  referrer_user_id  uuid references auth.users(id) on delete cascade not null,
  referred_email    text not null,
  referred_user_id  uuid references auth.users(id) on delete set null,
  status            text check (status in ('pending','signed_up','paid')) default 'pending',
  created_at        timestamptz default now(),
  converted_at      timestamptz
);

-- Referral uses (for tracking referral code at signup)
create table if not exists referral_uses (
  id         uuid primary key default uuid_generate_v4(),
  code       text not null,
  used_by    uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

-- ─── Storage bucket for avatars ───────────────────────────────────
-- Run in Supabase Dashboard → Storage → Create bucket "avatars" (public)

-- ─── Row Level Security ───────────────────────────────────────────
alter table profiles enable row level security;
alter table links enable row level security;
alter table nfc_cards enable row level security;
alter table orders enable row level security;
alter table analytics_events enable row level security;
alter table leads enable row level security;
alter table team_members enable row level security;
alter table referrals enable row level security;

-- Profiles: public read for profile pages, owner write
create policy "Public profiles are viewable by anyone" on profiles
  for select using (is_active = true);
create policy "Users can update their own profile" on profiles
  for all using (auth.uid() = user_id);

-- Links: public read for active links, owner write
create policy "Public links viewable" on links
  for select using (is_active = true);
create policy "Users can manage own links" on links
  for all using (auth.uid() = user_id);

-- Cards: owner only
create policy "Users can view own cards" on nfc_cards
  for all using (auth.uid() = user_id);

-- Orders: owner only
create policy "Users can view own orders" on orders
  for select using (auth.uid() = user_id);

-- Analytics: owner can view, anyone can insert (for tracking)
create policy "Users can view own analytics" on analytics_events
  for select using (auth.uid() = user_id);
create policy "Anyone can log analytics" on analytics_events
  for insert with check (true);

-- Leads: owner can view, anyone can insert (visitor sharing)
create policy "Card owners view leads" on leads
  for select using (auth.uid() = card_owner_id);
create policy "Anyone can submit leads" on leads
  for insert with check (true);

-- Team: owner can manage
create policy "Business owners can manage team" on team_members
  for all using (auth.uid() = business_owner_id);

-- Referrals: owner can view
create policy "Users can view own referrals" on referrals
  for all using (auth.uid() = referrer_user_id);

-- ─── Indexes ──────────────────────────────────────────────────────
create index if not exists idx_profiles_username on profiles(username);
create index if not exists idx_links_user_id on links(user_id);
create index if not exists idx_analytics_user_id on analytics_events(user_id);
create index if not exists idx_analytics_created_at on analytics_events(created_at);
create index if not exists idx_leads_card_owner on leads(card_owner_id);
create index if not exists idx_orders_user_id on orders(user_id);

-- ─── Functions ────────────────────────────────────────────────────
-- Auto-update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on profiles
  for each row execute function update_updated_at_column();
create trigger set_updated_at before update on nfc_cards
  for each row execute function update_updated_at_column();
create trigger set_updated_at before update on orders
  for each row execute function update_updated_at_column();
