// ─────────────────────────────────────────────
// TapMeOnce — Public Profile Page
// The page that opens when someone taps the NFC card.
// PWA-ready, offline-capable, lead capture, vCard download.
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone, Mail, MapPin, Building2, Download, Share2,
  Linkedin, Instagram, Twitter, Youtube, Globe, ExternalLink,
  ChevronDown, User, Briefcase, X, Loader2, Check, Wifi, WifiOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { supabase, getProfileByUsername, getLinks, logEvent, saveLead } from '@/lib/supabase';
import { downloadVcf } from '@/lib/vcf';
import type { UserProfile, SocialLink } from '@/types';

const PLATFORM_COLORS: Record<string, string> = {
  linkedin: '#0A66C2',
  instagram: 'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)',
  twitter: '#1DA1F2',
  youtube: '#FF0000',
  whatsapp: '#25D366',
  website: '#22C55E',
  github: '#333',
  behance: '#1769FF',
  dribbble: '#EA4C89',
  email: '#EA4335',
  telegram: '#2CA5E0',
  custom: '#6B7280',
};

const PLATFORM_ICONS: Record<string, React.FC<any>> = {
  linkedin: Linkedin,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  whatsapp: ({ className }: any) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  ),
  website: Globe,
  github: ({ className }: any) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
    </svg>
  ),
};

function getPlatformIcon(platform: string) {
  return PLATFORM_ICONS[platform] || ExternalLink;
}

function formatLinkUrl(url: string, platform: string): string {
  if (url.startsWith('http')) return url;
  if (platform === 'whatsapp' && /^\d+$/.test(url)) return `https://wa.me/${url}`;
  if (platform === 'email') return `mailto:${url}`;
  if (platform === 'phone') return `tel:${url}`;
  return `https://${url}`;
}

export default function PublicProfile() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [profileMode, setProfileMode] = useState<'business' | 'personal'>('business');

  // Lead form state
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadConsent, setLeadConsent] = useState(false);
  const [submittingLead, setSubmittingLead] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!username) return;
    loadProfile();
  }, [username]);

  const loadProfile = async () => {
    try {
      const { data: profileData, error } = await getProfileByUsername(username!);
      if (error || !profileData) {
        // Try offline cache
        const cached = localStorage.getItem(`tmo_profile_${username}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          setProfile(parsed.profile);
          setLinks(parsed.links);
          setProfileMode(parsed.profile.active_mode || 'business');
          setLoading(false);
          return;
        }
        setNotFound(true);
        setLoading(false);
        return;
      }

      if (!profileData.is_active) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const { data: linksData } = await getLinks(profileData.user_id);
      const filteredLinks = (linksData || []).filter((l: any) =>
        l.is_active && (l.mode === 'both' || l.mode === profileData.active_mode)
      );

      setProfile(profileData as UserProfile);
      setLinks(filteredLinks as any);
      setProfileMode((profileData.active_mode || 'business') as any);

      // Cache for offline
      localStorage.setItem(`tmo_profile_${username}`, JSON.stringify({
        profile: profileData,
        links: filteredLinks,
        cachedAt: Date.now(),
      }));

      // Log tap event
      await logEvent({ user_id: profileData.user_id, event_type: 'tap' });
    } catch (err) {
      const cached = localStorage.getItem(`tmo_profile_${username}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        setProfile(parsed.profile);
        setLinks(parsed.links);
        setProfileMode(parsed.profile.active_mode || 'business');
      } else {
        setNotFound(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLinkClick = async (link: SocialLink) => {
    if (profile) {
      await logEvent({ user_id: profile.user_id, event_type: 'link_click', link_id: link.id });
    }
    window.open(formatLinkUrl(link.url, link.platform), '_blank', 'noopener,noreferrer');
  };

  const handleVcfDownload = async () => {
    if (!profile) return;
    downloadVcf(profile, links);
    await logEvent({ user_id: profile.user_id, event_type: 'vcf_download' });
    toast.success('Contact saved!');
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: `${profile?.full_name} — TapMeOnce`, url });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Profile link copied!');
    }
  };

  const handleLeadSubmit = async () => {
    if (!leadName.trim()) { toast.error('Please enter your name'); return; }
    if (!leadConsent) { toast.error('Please agree to share your details'); return; }
    setSubmittingLead(true);
    try {
      await saveLead({
        card_owner_id: profile!.user_id,
        visitor_name: leadName,
        visitor_phone: leadPhone,
        visitor_email: leadEmail,
      });
      setLeadSubmitted(true);
      toast.success('Details shared successfully!');
    } catch {
      toast.error('Could not share details. Please try again.');
    } finally {
      setSubmittingLead(false);
    }
  };

  const hasPro = profile?.plan === 'professional' || profile?.plan === 'business';
  const displayLinks = hasPro
    ? links.filter(l => l.mode === 'both' || l.mode === profileMode)
    : links;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="h-8 w-8 text-primary" />
        </motion.div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-center p-4">
        <div>
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="font-display text-2xl font-bold mb-2">Profile not found</h1>
          <p className="text-muted-foreground mb-6">This profile doesn't exist or has been deactivated.</p>
          <a href="/" className="text-primary hover:underline text-sm">Get your own TapMeOnce card →</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Offline indicator */}
      {!isOnline && (
        <div className="flex items-center justify-center gap-2 py-1.5 bg-amber-500/20 text-amber-300 text-xs">
          <WifiOff className="h-3 w-3" /> Viewing cached profile (offline)
        </div>
      )}

      <div className="max-w-md mx-auto px-4 pb-16 pt-8">
        {/* ─── Profile Header ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          {/* Avatar */}
          <div className="relative inline-block mb-4">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name}
                className="w-24 h-24 rounded-full object-cover border-2 border-primary/30 shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-gold flex items-center justify-center text-3xl font-bold text-primary-foreground shadow-lg">
                {profile?.full_name?.[0]?.toUpperCase()}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-background" />
          </div>

          {/* Name & title */}
          <h1 className="font-display text-2xl font-bold text-foreground">{profile?.full_name}</h1>
          {profile?.designation && (
            <p className="text-primary font-medium mt-0.5">{profile.designation}</p>
          )}
          {profile?.company && (
            <p className="text-muted-foreground text-sm mt-0.5 flex items-center justify-center gap-1">
              <Building2 className="h-3 w-3" /> {profile.company}
            </p>
          )}
          {profile?.location && (
            <p className="text-muted-foreground text-sm mt-0.5 flex items-center justify-center gap-1">
              <MapPin className="h-3 w-3" /> {profile.location}
            </p>
          )}

          {/* Bio */}
          {profile?.bio && (
            <p className="text-muted-foreground text-sm mt-3 leading-relaxed max-w-sm mx-auto">
              {profileMode === 'personal' && profile?.bio_personal
                ? profile.bio_personal
                : profile?.bio}
            </p>
          )}

          {/* Personal / Business mode toggle (Pro+) */}
          {hasPro && profile?.bio_personal && (
            <div className="mt-3 inline-flex rounded-full bg-secondary border border-border p-1 gap-1">
              <button
                onClick={() => setProfileMode('business')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${profileMode === 'business' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Briefcase className="h-3 w-3" /> Business
              </button>
              <button
                onClick={() => setProfileMode('personal')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${profileMode === 'personal' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <User className="h-3 w-3" /> Personal
              </button>
            </div>
          )}
        </motion.div>

        {/* ─── Action buttons ─── */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button
            onClick={handleVcfDownload}
            className="bg-gradient-gold text-primary-foreground hover:opacity-90 gap-2"
          >
            <Download className="h-4 w-4" /> Save Contact
          </Button>
          <Button
            variant="outline"
            onClick={handleShare}
            className="gap-2 border-border"
          >
            <Share2 className="h-4 w-4" /> Share Profile
          </Button>
        </div>

        {/* ─── Links ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-3 mb-8"
        >
          {displayLinks.map((link, i) => {
            const Icon = getPlatformIcon(link.platform);
            const color = PLATFORM_COLORS[link.platform] || '#6B7280';
            const isGradient = color.startsWith('linear-gradient');
            return (
              <motion.button
                key={link.id || i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                onClick={() => handleLinkClick(link)}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-card/60 border border-border hover:border-primary/40 hover:bg-card/80 transition-all text-left group"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: isGradient ? color : `${color}22` }}
                >
                  <Icon className="h-5 w-5" style={{ color: isGradient ? '#fff' : color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground capitalize">
                    {link.label || link.platform}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </motion.button>
            );
          })}

          {displayLinks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <p>No links added yet.</p>
            </div>
          )}
        </motion.div>

        {/* ─── Lead capture (Pro+ only) ─── */}
        {hasPro && profile?.lead_gen_consent && !leadSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <AnimatePresence>
              {!showLeadForm ? (
                <motion.button
                  key="cta"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowLeadForm(true)}
                  className="w-full p-4 rounded-xl border border-primary/30 bg-primary/5 text-center hover:bg-primary/10 transition-all group"
                >
                  <p className="text-sm font-medium text-primary">Want me to follow up with you?</p>
                  <p className="text-xs text-muted-foreground mt-0.5 group-hover:text-muted-foreground/80">
                    Share your details → <ChevronDown className="inline h-3 w-3" />
                  </p>
                </motion.button>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-4 rounded-xl border border-border bg-card/60"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold">Leave your details</p>
                    <button onClick={() => setShowLeadForm(false)} className="text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <Input value={leadName} onChange={e => setLeadName(e.target.value)} placeholder="Your name *" className="text-sm" />
                    <Input value={leadPhone} onChange={e => setLeadPhone(e.target.value)} placeholder="Phone (optional)" type="tel" className="text-sm" />
                    <Input value={leadEmail} onChange={e => setLeadEmail(e.target.value)} placeholder="Email (optional)" type="email" className="text-sm" />
                    <div className="flex items-start gap-2">
                      <Checkbox id="lc" checked={leadConsent} onCheckedChange={v => setLeadConsent(!!v)} className="mt-0.5" />
                      <label htmlFor="lc" className="text-xs text-muted-foreground cursor-pointer">
                        I agree to share my details with {profile?.full_name} for follow-up.
                      </label>
                    </div>
                    <Button
                      onClick={handleLeadSubmit}
                      disabled={submittingLead || !leadConsent || !leadName.trim()}
                      className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90 text-sm"
                    >
                      {submittingLead ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send details'}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {leadSubmitted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-center"
          >
            <Check className="h-6 w-6 text-green-400 mx-auto mb-1" />
            <p className="text-sm font-medium text-green-400">Details shared!</p>
            <p className="text-xs text-muted-foreground mt-0.5">{profile?.full_name} will be in touch.</p>
          </motion.div>
        )}

        {/* ─── Footer branding (Free plan only) ─── */}
        {profile?.plan === 'free' && (
          <div className="text-center pt-4 border-t border-border">
            <a href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Powered by <span className="font-semibold text-gradient-gold">TapMeOnce</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
