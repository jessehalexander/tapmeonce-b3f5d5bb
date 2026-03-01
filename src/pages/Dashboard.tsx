// ─────────────────────────────────────────────
// TapMeOnce — User Dashboard
// Profile, analytics, card control, team, referrals
// ─────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, User, Link2, BarChart2, CreditCard, Users,
  Gift, Settings, LogOut, Bell, ExternalLink, Plus, Trash2,
  Eye, EyeOff, Check, Loader2, ChevronRight, Zap, Copy,
  ToggleLeft, ToggleRight, Sparkles, ArrowUpRight, Download,
  QrCode, Share2, Upload, Building2, GraduationCap, X, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  supabase, getLinks, upsertLink, deleteLink,
  getLeads, getReferrals, createReferral, setCardStatus,
  getCard, getOrders, uploadAvatar, updateProfile
} from '@/lib/supabase';
import { PLANS } from '@/lib/plans';
import type { SocialLink, Lead, NfcCard, Order } from '@/types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

type Tab = 'overview' | 'profile' | 'links' | 'analytics' | 'leads' | 'team' | 'card' | 'billing' | 'referral';

const TAB_ITEMS: { id: Tab; label: string; icon: any; planRequired?: 'professional' | 'business' }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'links', label: 'Links', icon: Link2 },
  { id: 'analytics', label: 'Analytics', icon: BarChart2, planRequired: 'professional' },
  { id: 'leads', label: 'Leads', icon: Users, planRequired: 'professional' },
  { id: 'team', label: 'Team', icon: Users, planRequired: 'business' },
  { id: 'card', label: 'My Card', icon: CreditCard },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'referral', label: 'Referrals', icon: Gift },
];

export default function Dashboard() {
  const { user, profile, refreshProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [card, setCard] = useState<NfcCard | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const plan = PLANS[profile?.plan || 'free'];
  const isPro = profile?.plan === 'professional' || profile?.plan === 'business';
  const isBusiness = profile?.plan === 'business';

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    const [linksRes, leadsRes, cardRes, ordersRes, referralsRes] = await Promise.all([
      getLinks(user.id),
      getLeads(user.id),
      getCard(user.id),
      getOrders(user.id),
      getReferrals(user.id),
    ]);
    setLinks(linksRes.data || []);
    setLeads(leadsRes.data || []);
    setCard(cardRes.data);
    setOrders(ordersRes.data || []);
    setReferrals(referralsRes.data || []);

    // Mock analytics data — replace with real Supabase query
    setAnalyticsData(generateMockAnalytics());
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const visibleTabs = TAB_ITEMS.filter(t => {
    if (t.planRequired === 'business') return isBusiness;
    if (t.planRequired === 'professional') return isPro;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* ─── Sidebar ─── */}
      <aside className="hidden md:flex flex-col w-56 border-r border-border shrink-0 sticky top-0 h-screen">
        <div className="p-4 border-b border-border">
          <Link to="/" className="text-sm font-bold text-gradient-gold">TapMeOnce</Link>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {visibleTabs.map(item => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all',
                tab === item.id
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* ─── Main content ─── */}
      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
          <div className="flex items-center justify-between px-4 h-14">
            <div className="flex items-center gap-3">
              <Link to="/" className="md:hidden text-sm font-bold text-gradient-gold">TapMeOnce</Link>
              <h2 className="text-sm font-semibold capitalize">{tab}</h2>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={cn(
                'text-xs',
                plan.id === 'business' ? 'border-amber-500/50 text-amber-400' :
                plan.id === 'professional' ? 'border-primary/50 text-primary' :
                'border-border text-muted-foreground'
              )}>
                {plan.name}
              </Badge>
              <a
                href={`/p/${profile?.username}`}
                target="_blank"
                className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
              >
                View profile <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
          {/* Mobile tab strip */}
          <div className="md:hidden flex overflow-x-auto gap-1 px-3 pb-2 no-scrollbar">
            {visibleTabs.map(item => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap shrink-0',
                  tab === item.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                )}
              >
                <item.icon className="h-3 w-3" /> {item.label}
              </button>
            ))}
          </div>
        </header>

        <div className="p-4 md:p-6 max-w-3xl">
          {tab === 'overview' && <TabOverview profile={profile} links={links} leads={leads} card={card} orders={orders} setTab={setTab} />}
          {tab === 'profile' && <TabProfile profile={profile} refreshProfile={refreshProfile} userId={user?.id} />}
          {tab === 'links' && <TabLinks userId={user?.id} links={links} setLinks={setLinks} />}
          {tab === 'analytics' && <TabAnalytics analyticsData={analyticsData} leads={leads} />}
          {tab === 'leads' && <TabLeads leads={leads} />}
          {tab === 'team' && <TabTeam userId={user?.id} />}
          {tab === 'card' && <TabCard card={card} setCard={setCard} profile={profile} />}
          {tab === 'billing' && <TabBilling profile={profile} orders={orders} />}
          {tab === 'referral' && <TabReferral userId={user?.id} referrals={referrals} setReferrals={setReferrals} username={profile?.username} />}
        </div>
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────
// Tab: Overview
// ─────────────────────────────────────────────
function TabOverview({ profile, links, leads, card, orders, setTab }: any) {
  const profileUrl = `${window.location.origin}/p/${profile?.username}`;
  const latestOrder = orders?.[0];
  const plan = PLANS[profile?.plan || 'free'];
  const isPro = profile?.plan !== 'free';

  return (
    <div className="space-y-5">
      {/* Welcome */}
      <div>
        <h1 className="font-display text-2xl font-bold">
          Hey, {profile?.full_name?.split(' ')[0]} 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Here's what's happening with your TapMeOnce card.</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total taps', value: '—', icon: Zap },
          { label: 'Links saved', value: links.length, icon: Link2 },
          { label: 'Leads captured', value: leads.length, icon: Users },
          { label: 'Card status', value: card?.status || 'pending', icon: CreditCard },
        ].map(stat => (
          <div key={stat.label} className="glass-card rounded-xl p-4">
            <stat.icon className="h-4 w-4 text-primary mb-2" />
            <p className="font-display text-xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Profile link */}
      <div className="glass-card rounded-xl p-4">
        <p className="text-xs text-muted-foreground mb-1.5">Your profile link</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 text-sm text-primary bg-primary/5 px-3 py-1.5 rounded-lg truncate">{profileUrl}</code>
          <button
            onClick={() => { navigator.clipboard.writeText(profileUrl); toast.success('Copied!'); }}
            className="p-1.5 rounded-md hover:bg-secondary"
          >
            <Copy className="h-4 w-4 text-muted-foreground" />
          </button>
          <a href={profileUrl} target="_blank" className="p-1.5 rounded-md hover:bg-secondary">
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </a>
        </div>
      </div>

      {/* Order tracking */}
      {latestOrder && (
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-sm">Order #{latestOrder.id?.slice(-8)}</p>
            <Badge variant="outline" className="text-xs capitalize">{latestOrder.status?.replace('_', ' ')}</Badge>
          </div>
          <OrderProgress status={latestOrder.status} />
        </div>
      )}

      {/* Upgrade nudge for free users */}
      {profile?.plan === 'free' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl p-4 bg-gradient-to-r from-primary/10 to-amber-700/5 border border-primary/30"
        >
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">Upgrade to Professional</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Unlock AI bio, smart analytics, lead capture, and remove TapMeOnce branding. ₹299/month.
              </p>
              <Link to="/setup?plan=professional" className="mt-2 inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline">
                Upgrade now <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick links to sections */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Edit Profile', tab: 'profile', icon: User },
          { label: 'Manage Links', tab: 'links', icon: Link2 },
          { label: isPro ? 'View Analytics' : 'Upgrade for Analytics', tab: isPro ? 'analytics' : 'billing', icon: BarChart2 },
          { label: 'Card Settings', tab: 'card', icon: CreditCard },
        ].map(item => (
          <button
            key={item.label}
            onClick={() => setTab(item.tab)}
            className="glass-card rounded-xl p-4 text-left hover:border-primary/40 transition-all group"
          >
            <item.icon className="h-4 w-4 text-primary mb-2" />
            <p className="text-sm font-medium group-hover:text-primary transition-colors">{item.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Tab: Profile Editor
// ─────────────────────────────────────────────
function TabProfile({ profile, refreshProfile, userId }: any) {
  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    designation: profile?.designation || '',
    company: profile?.company || '',
    institution: profile?.institution || '',
    bio: profile?.bio || '',
    bio_personal: profile?.bio_personal || '',
    location: profile?.location || '',
    is_student: profile?.is_student || false,
    active_mode: profile?.active_mode || 'business',
  });
  const [saving, setSaving] = useState(false);
  const [generatingBio, setGeneratingBio] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile?.avatar_url || null);
  const fileRef = useRef<HTMLInputElement>(null);
  const isPro = profile?.plan !== 'free';
  const N8N_WEBHOOK = 'https://airtribe.app.n8n.cloud/webhook/tapmeonce-profile';

  const save = async () => {
    setSaving(true);
    await updateProfile(userId, form);
    await refreshProfile();
    toast.success('Profile updated!');
    setSaving(false);
  };

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
    const publicUrl = await uploadAvatar(userId, file);
    if (publicUrl) {
      await updateProfile(userId, { avatar_url: publicUrl });
      await refreshProfile();
      toast.success('Photo updated!');
    }
  };

  const generateBio = async (type: 'business' | 'personal') => {
    setGeneratingBio(true);
    try {
      const res = await fetch(N8N_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.full_name,
          designation: form.designation,
          company: form.is_student ? form.institution : form.company,
          isStudent: form.is_student,
          location: form.location,
          type,
        }),
      });
      const data = await res.json();
      if (type === 'business') {
        setForm(f => ({ ...f, bio: data.bio || data.result || f.bio }));
      } else {
        setForm(f => ({ ...f, bio_personal: data.bio || data.result || f.bio_personal }));
      }
      toast.success(`${type === 'business' ? 'Professional' : 'Personal'} bio generated!`);
    } catch {
      toast.error('AI generation failed. Try again.');
    } finally {
      setGeneratingBio(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold">Edit Profile</h2>
        <p className="text-sm text-muted-foreground mt-1">Changes are reflected instantly on your profile page.</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div
          onClick={() => fileRef.current?.click()}
          className="w-16 h-16 rounded-full overflow-hidden border-2 border-dashed border-border cursor-pointer hover:border-primary/60 transition-colors bg-secondary/40 flex items-center justify-center"
        >
          {avatarPreview ? (
            <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <Upload className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium">Profile photo</p>
          <button onClick={() => fileRef.current?.click()} className="text-xs text-primary hover:underline">Change photo</button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
      </div>

      {/* Form fields */}
      <div className="grid gap-4">
        <div>
          <Label>Full name</Label>
          <Input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} className="mt-1.5" />
        </div>
        <div>
          <Label>Designation / Title</Label>
          <Input value={form.designation} onChange={e => setForm(f => ({ ...f, designation: e.target.value }))} placeholder="Product Manager, CA, Sales Lead…" className="mt-1.5" />
        </div>

        {/* Student toggle */}
        <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-secondary/40">
          <div className="flex items-center gap-2 text-sm">
            {form.is_student ? <GraduationCap className="h-4 w-4 text-primary" /> : <Building2 className="h-4 w-4 text-primary" />}
            <span>{form.is_student ? 'Student' : 'Working Professional'}</span>
          </div>
          <Switch checked={form.is_student} onCheckedChange={v => setForm(f => ({ ...f, is_student: v }))} />
        </div>

        <div>
          <Label>{form.is_student ? 'Institution' : 'Company'}</Label>
          <Input
            value={form.is_student ? form.institution : form.company}
            onChange={e => setForm(f => form.is_student ? { ...f, institution: e.target.value } : { ...f, company: e.target.value })}
            placeholder={form.is_student ? 'IIT Bombay…' : 'Google, My Startup…'}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label>Location</Label>
          <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Mumbai, India" className="mt-1.5" />
        </div>

        {/* Professional bio */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label>Professional bio</Label>
            {isPro && (
              <Button variant="outline" size="sm" onClick={() => generateBio('business')} disabled={generatingBio} className="h-6 text-xs gap-1 border-primary/40 text-primary hover:bg-primary/10 px-2">
                {generatingBio ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />} AI Generate
              </Button>
            )}
          </div>
          <Textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={3} className="resize-none" placeholder="Professional bio shown to visitors…" />
        </div>

        {/* Personal bio (Pro+) */}
        {isPro && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label>Personal bio <Badge variant="outline" className="ml-1 text-xs">Pro</Badge></Label>
              <Button variant="outline" size="sm" onClick={() => generateBio('personal')} disabled={generatingBio} className="h-6 text-xs gap-1 border-primary/40 text-primary hover:bg-primary/10 px-2">
                {generatingBio ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />} AI Generate
              </Button>
            </div>
            <Textarea value={form.bio_personal} onChange={e => setForm(f => ({ ...f, bio_personal: e.target.value }))} rows={3} className="resize-none" placeholder="Personal bio for when you switch to personal mode…" />
          </div>
        )}

        {/* Active mode (Pro+) */}
        {isPro && (
          <div>
            <Label>Active profile mode <Badge variant="outline" className="ml-1 text-xs">Pro</Badge></Label>
            <p className="text-xs text-muted-foreground mt-1 mb-2">Controls which version visitors see when they tap your card.</p>
            <div className="flex gap-2">
              {(['business', 'personal'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setForm(f => ({ ...f, active_mode: mode }))}
                  className={cn(
                    'flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-all',
                    form.active_mode === mode ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/40'
                  )}
                >
                  {mode === 'business' ? '💼 Business' : '👤 Personal'}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <Button onClick={save} disabled={saving} className="bg-gradient-gold text-primary-foreground hover:opacity-90 gap-2">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        Save Changes
      </Button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Tab: Links Manager
// ─────────────────────────────────────────────
function TabLinks({ userId, links, setLinks }: any) {
  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const PLATFORMS = [
    'linkedin', 'instagram', 'twitter', 'youtube', 'whatsapp',
    'website', 'github', 'behance', 'dribbble', 'email', 'telegram', 'custom'
  ];

  const addLink = async () => {
    if (!newPlatform || !newUrl.trim()) { toast.error('Fill in platform and URL'); return; }
    setSaving(true);
    const link = {
      user_id: userId,
      platform: newPlatform,
      label: newPlatform,
      url: newUrl.trim(),
      sort_order: links.length,
      mode: 'both',
      is_active: true,
    };
    const { data } = await upsertLink(link);
    const { data: fresh } = await (await import('@/lib/supabase')).getLinks(userId);
    setLinks(fresh || []);
    setNewPlatform('');
    setNewUrl('');
    toast.success('Link added!');
    setSaving(false);
  };

  const toggleLink = async (link: SocialLink) => {
    await upsertLink({ ...link, is_active: !link.is_active });
    setLinks((prev: SocialLink[]) => prev.map(l => l.id === link.id ? { ...l, is_active: !l.is_active } : l));
  };

  const removeLink = async (id: string) => {
    await deleteLink(id);
    setLinks((prev: SocialLink[]) => prev.filter(l => l.id !== id));
    toast.success('Link removed');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold">Manage Links</h2>
        <p className="text-sm text-muted-foreground mt-1">Add, remove or reorder your profile links.</p>
      </div>

      {/* Add new link */}
      <div className="glass-card rounded-xl p-4 space-y-3">
        <p className="text-sm font-medium">Add a new link</p>
        <div className="flex gap-2">
          <select
            value={newPlatform}
            onChange={e => setNewPlatform(e.target.value)}
            className="w-36 rounded-md border border-input bg-background px-2 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Platform</option>
            {PLATFORMS.map(p => <option key={p} value={p} className="capitalize">{p}</option>)}
          </select>
          <Input
            value={newUrl}
            onChange={e => setNewUrl(e.target.value)}
            placeholder="https://..."
            className="flex-1 text-sm"
            onKeyDown={e => e.key === 'Enter' && addLink()}
          />
          <Button onClick={addLink} disabled={saving} size="sm" className="bg-gradient-gold text-primary-foreground shrink-0">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Existing links */}
      <div className="space-y-2">
        {links.map((link: SocialLink) => (
          <div key={link.id} className={cn('flex items-center gap-3 p-3 rounded-lg border transition-all', link.is_active ? 'border-border bg-card/40' : 'border-border/50 bg-card/20 opacity-60')}>
            <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center text-xs font-medium text-muted-foreground uppercase shrink-0">
              {link.platform?.slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium capitalize">{link.label || link.platform}</p>
              <p className="text-xs text-muted-foreground truncate">{link.url}</p>
            </div>
            <Switch checked={link.is_active} onCheckedChange={() => toggleLink(link)} />
            <button onClick={() => removeLink(link.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {links.length === 0 && (
          <div className="text-center py-8 text-sm text-muted-foreground">No links yet. Add some above!</div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Tab: Analytics
// ─────────────────────────────────────────────
function TabAnalytics({ analyticsData, leads }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold">Smart Analytics</h2>
        <p className="text-sm text-muted-foreground mt-1">Track how your card is performing.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Taps', value: analyticsData.reduce((a: number, d: any) => a + (d.taps || 0), 0) },
          { label: 'This Week', value: analyticsData.slice(-7).reduce((a: number, d: any) => a + (d.taps || 0), 0) },
          { label: 'Leads', value: leads.length },
        ].map(s => (
          <div key={s.label} className="glass-card rounded-xl p-4 text-center">
            <p className="font-display text-2xl font-bold text-primary">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Taps chart */}
      <div className="glass-card rounded-xl p-4">
        <p className="text-sm font-medium mb-3">Taps over time (last 30 days)</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={analyticsData}>
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="taps" fill="hsl(40 80% 55%)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Link clicks */}
      <div className="glass-card rounded-xl p-4">
        <p className="text-sm font-medium mb-3">Top link clicks</p>
        <div className="space-y-2">
          {['WhatsApp', 'LinkedIn', 'Website'].map((link, i) => (
            <div key={link} className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-20">{link}</span>
              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${[70, 40, 25][i]}%` }} />
              </div>
              <span className="text-xs text-muted-foreground w-8 text-right">{[70, 40, 25][i]}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Tab: Leads
// ─────────────────────────────────────────────
function TabLeads({ leads }: any) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-bold">Leads</h2>
        <p className="text-sm text-muted-foreground mt-1">{leads.length} leads captured from your card taps.</p>
      </div>
      <div className="space-y-2">
        {leads.map((lead: Lead) => (
          <div key={lead.id} className="glass-card rounded-xl p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
              {lead.visitor_name[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{lead.visitor_name}</p>
              {lead.visitor_phone && <p className="text-xs text-muted-foreground">{lead.visitor_phone}</p>}
              {lead.visitor_email && <p className="text-xs text-muted-foreground">{lead.visitor_email}</p>}
              <p className="text-xs text-muted-foreground mt-1">
                {lead.tap_city && `📍 ${lead.tap_city} · `}
                {new Date(lead.captured_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
        {leads.length === 0 && (
          <div className="text-center py-10 text-muted-foreground text-sm">
            <p>No leads yet.</p>
            <p className="text-xs mt-1">When someone fills the lead form on your profile, they'll appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Tab: Team (Business plan)
// ─────────────────────────────────────────────
function TabTeam({ userId }: any) {
  const [members, setMembers] = useState<any[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviting, setInviting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    const { data } = await (await import('@/lib/supabase')).getTeamMembers(userId);
    setMembers(data || []);
    setLoading(false);
  };

  const inviteMember = async () => {
    if (!inviteEmail || !inviteName) { toast.error('Enter name and email'); return; }
    setInviting(true);
    await (await import('@/lib/supabase')).inviteTeamMember({
      business_owner_id: userId,
      name: inviteName,
      email: inviteEmail,
      status: 'invited',
      invited_at: new Date().toISOString(),
    });
    // Trigger n8n webhook to notify admin and create card
    try {
      await fetch('https://airtribe.app.n8n.cloud/webhook/tapmeonce-team-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: inviteName, email: inviteEmail, ownerId: userId }),
      });
    } catch {}
    await loadTeam();
    setInviteEmail('');
    setInviteName('');
    toast.success('Invitation sent!');
    setInviting(false);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-bold">Team Members</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your team's NFC cards. Additional members: +₹200/mo each.</p>
      </div>
      <div className="glass-card rounded-xl p-4 space-y-3">
        <p className="text-sm font-medium">Invite a team member</p>
        <Input value={inviteName} onChange={e => setInviteName(e.target.value)} placeholder="Full name" className="text-sm" />
        <Input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="Email address" type="email" className="text-sm" />
        <Button onClick={inviteMember} disabled={inviting} className="bg-gradient-gold text-primary-foreground hover:opacity-90 gap-2 text-sm">
          {inviting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Send Invite
        </Button>
      </div>
      <div className="space-y-2">
        {members.map(m => (
          <div key={m.id} className="glass-card rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
              {m.name[0]}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{m.name}</p>
              <p className="text-xs text-muted-foreground">{m.email}</p>
            </div>
            <Badge variant="outline" className={cn('text-xs', m.status === 'active' ? 'text-green-400 border-green-500/30' : 'text-muted-foreground')}>
              {m.status}
            </Badge>
          </div>
        ))}
        {!loading && members.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-6">No team members yet. Invite your first one!</p>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Tab: Card Settings
// ─────────────────────────────────────────────
function TabCard({ card, setCard, profile }: any) {
  const [toggling, setToggling] = useState(false);

  const toggleCard = async () => {
    if (!card) return;
    setToggling(true);
    const newStatus = card.status === 'active' ? 'inactive' : 'active';
    await setCardStatus(card.id, newStatus);
    setCard({ ...card, status: newStatus });
    toast.success(`Card ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
    setToggling(false);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-bold">My Card</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your physical NFC card.</p>
      </div>

      {card ? (
        <>
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-semibold">NFC Card</p>
                <p className="text-xs text-muted-foreground capitalize mt-0.5">
                  {card.card_type?.replace('_', ' ')} · {card.status}
                </p>
              </div>
              <div className={cn(
                'w-3 h-3 rounded-full',
                card.status === 'active' ? 'bg-green-500' :
                card.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
              )} />
            </div>
            <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-secondary/40">
              <div>
                <p className="text-sm font-medium">Card {card.status === 'active' ? 'active' : 'inactive'}</p>
                <p className="text-xs text-muted-foreground">
                  {card.status === 'active'
                    ? 'Your card is active. Taps will show your profile.'
                    : 'Card deactivated. Taps will show a deactivated message.'}
                </p>
              </div>
              <Switch
                checked={card.status === 'active'}
                onCheckedChange={toggleCard}
                disabled={toggling || card.status === 'pending'}
              />
            </div>
            {card.status === 'pending' && (
              <p className="text-xs text-amber-400 mt-2 flex items-center gap-1">
                <Info className="h-3 w-3" /> Card is being produced. You can activate it once it's delivered.
              </p>
            )}
          </div>

          {/* Profile URL */}
          <div className="glass-card rounded-xl p-4">
            <p className="text-sm font-medium mb-2">Your profile link</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-secondary/40 px-3 py-2 rounded-lg truncate">
                tapmeonce.com/p/{profile?.username}
              </code>
              <button onClick={() => {
                navigator.clipboard.writeText(`https://tapmeonce.com/p/${profile?.username}`);
                toast.success('Copied!');
              }} className="p-1.5 rounded-md hover:bg-secondary">
                <Copy className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            {profile?.plan === 'professional' && (
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <Zap className="h-3 w-3 text-primary" />
                Your subdomain: <span className="text-primary">{profile?.username}.tapmeonce.com</span>
              </p>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-10 text-muted-foreground text-sm">
          <p>No card found.</p>
          <p className="text-xs mt-1">Order your card to get started.</p>
          <Link to="/setup" className="mt-3 inline-flex items-center text-primary text-xs hover:underline gap-1">
            Order a card <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Tab: Billing
// ─────────────────────────────────────────────
function TabBilling({ profile, orders }: any) {
  const plan = PLANS[profile?.plan || 'free'];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-bold">Billing</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your subscription and payment.</p>
      </div>

      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-semibold">{plan.name} Plan</p>
            <p className="text-sm text-muted-foreground">
              {plan.price === 0 ? 'Free with card purchase' : `₹${plan.price}/month`}
            </p>
          </div>
          <Badge variant="outline" className="border-primary/40 text-primary">{plan.name}</Badge>
        </div>
        {profile?.plan_expires_at && (
          <p className="text-xs text-muted-foreground">
            Next renewal: {new Date(profile.plan_expires_at).toLocaleDateString('en-IN')}
          </p>
        )}
        {profile?.plan !== 'free' && (
          <Button variant="outline" size="sm" className="mt-3 text-xs text-destructive border-destructive/40 hover:bg-destructive/10">
            Cancel subscription
          </Button>
        )}
      </div>

      {/* Upgrade CTA */}
      {profile?.plan !== 'business' && (
        <div className="rounded-xl p-4 border border-amber-500/30 bg-amber-500/5">
          <p className="text-sm font-semibold">
            {profile?.plan === 'free' ? 'Upgrade to Professional' : 'Upgrade to Business'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {profile?.plan === 'free'
              ? 'Get AI bio, analytics, leads, and custom subdomain for ₹299/month'
              : 'Cover your whole team at ₹200/user/month with custom domain'}
          </p>
          <Link
            to={`/setup?plan=${profile?.plan === 'free' ? 'professional' : 'business'}`}
            className="mt-2 inline-flex items-center gap-1 text-xs text-amber-400 font-medium hover:underline"
          >
            Upgrade now <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      )}

      {/* Order history */}
      {orders.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">Order history</p>
          <div className="space-y-2">
            {orders.map((order: Order) => (
              <div key={order.id} className="glass-card rounded-xl p-3 flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium">Order #{order.id.slice(-8)}</p>
                  <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString('en-IN')}</p>
                </div>
                <span className="text-sm font-bold">₹{order.total_amount}</span>
                <Badge variant="outline" className="text-xs capitalize">{order.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Tab: Referrals
// ─────────────────────────────────────────────
function TabReferral({ userId, referrals, setReferrals, username }: any) {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const referralLink = `https://tapmeonce.com/setup?ref=${username}`;
  const paidReferrals = referrals.filter((r: any) => r.status === 'paid').length;
  const NEEDED = 3;

  const sendReferral = async () => {
    if (!email) { toast.error('Enter an email'); return; }
    setSending(true);
    await createReferral(userId, email);
    const { data } = await getReferrals(userId);
    setReferrals(data || []);
    setEmail('');
    toast.success('Referral sent!');
    setSending(false);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-bold">Referral Program</h2>
        <p className="text-sm text-muted-foreground mt-1">Refer 3 friends who sign up — get 1 year free!</p>
      </div>

      {/* Progress */}
      <div className="glass-card rounded-xl p-5 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          {Array.from({ length: NEEDED }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center border-2 text-sm font-bold',
                i < paidReferrals
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'border-border text-muted-foreground'
              )}
            >
              {i < paidReferrals ? <Check className="h-5 w-5" /> : i + 1}
            </div>
          ))}
        </div>
        <p className="text-sm font-medium">
          {paidReferrals >= NEEDED
            ? "🎉 You've earned 1 year free!"
            : `${paidReferrals}/${NEEDED} paying referrals`}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {NEEDED - paidReferrals > 0 ? `${NEEDED - paidReferrals} more to go!` : 'Contact us to claim your reward.'}
        </p>
      </div>

      {/* Referral link */}
      <div className="glass-card rounded-xl p-4">
        <p className="text-sm font-medium mb-2">Your referral link</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 text-xs bg-secondary/40 px-3 py-2 rounded-lg truncate">{referralLink}</code>
          <button onClick={() => { navigator.clipboard.writeText(referralLink); toast.success('Copied!'); }} className="p-1.5 rounded-md hover:bg-secondary">
            <Copy className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Invite by email */}
      <div className="glass-card rounded-xl p-4 space-y-3">
        <p className="text-sm font-medium">Invite by email</p>
        <div className="flex gap-2">
          <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="friend@example.com" type="email" className="text-sm" />
          <Button onClick={sendReferral} disabled={sending} size="sm" className="bg-gradient-gold text-primary-foreground shrink-0">
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Invite'}
          </Button>
        </div>
      </div>

      {/* Referral list */}
      {referrals.length > 0 && (
        <div className="space-y-2">
          {referrals.map((r: any) => (
            <div key={r.id} className="glass-card rounded-xl p-3 flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm">{r.referred_email}</p>
                <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</p>
              </div>
              <Badge variant="outline" className={cn('text-xs',
                r.status === 'paid' ? 'text-green-400 border-green-500/30' :
                r.status === 'signed_up' ? 'text-primary border-primary/30' :
                'text-muted-foreground'
              )}>
                {r.status}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Order Progress Indicator
// ─────────────────────────────────────────────
function OrderProgress({ status }: { status: string }) {
  const steps = ['placed', 'confirmed', 'in_production', 'dispatched', 'delivered'];
  const current = steps.indexOf(status);
  return (
    <div className="flex items-center gap-1">
      {steps.map((step, i) => {
        const done = i <= current;
        const active = i === current;
        return (
          <div key={step} className="flex items-center gap-1 flex-1">
            <div className={cn(
              'w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0',
              done ? 'bg-primary text-primary-foreground' :
              'bg-secondary text-muted-foreground'
            )}>
              {done ? <Check className="h-3 w-3" /> : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className={cn('flex-1 h-0.5 rounded-full', done ? 'bg-primary' : 'bg-border')} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Mock analytics data ──────────────────────
function generateMockAnalytics() {
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    data.push({
      date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      taps: Math.floor(Math.random() * 12),
    });
  }
  return data;
}
