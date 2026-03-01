// ─────────────────────────────────────────────
// TapMeOnce — Plans Comparison Page
// Full feature comparison table + pricing cards
// ─────────────────────────────────────────────

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, X, ArrowLeft, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PLAN_LIST, PLANS } from '@/lib/plans';

const ALL_FEATURES = [
  { category: 'Profile', features: [
    { label: 'Digital Profile Page', free: true, pro: true, biz: true },
    { label: 'Unlimited Social Links', free: true, pro: true, biz: true },
    { label: 'WhatsApp Direct Link', free: true, pro: true, biz: true },
    { label: 'QR Code', free: true, pro: true, biz: true },
    { label: 'Real-Time Profile Editing', free: true, pro: true, biz: true },
    { label: 'vCard / Contact Save', free: true, pro: true, biz: true },
    { label: 'Remove TapMeOnce Branding', free: false, pro: true, biz: true },
    { label: 'Personal & Business Profiles', free: false, pro: true, biz: true },
  ]},
  { category: 'AI Features', features: [
    { label: 'AI Bio Generator', free: false, pro: true, biz: true, note: '3 tones: formal, friendly, bold' },
    { label: 'AI Profile Suggestions', free: false, pro: true, biz: true },
  ]},
  { category: 'Analytics', features: [
    { label: 'Basic Tap Counter', free: true, pro: true, biz: true },
    { label: 'Smart Analytics Dashboard', free: false, pro: true, biz: true, note: 'Taps, clicks, city, device' },
    { label: 'Full Team Analytics', free: false, pro: false, biz: true },
    { label: 'Link Click Tracking', free: false, pro: true, biz: true },
  ]},
  { category: 'Leads', features: [
    { label: 'Lead Capture Form', free: false, pro: true, biz: true },
    { label: 'WhatsApp Lead Alerts', free: false, pro: true, biz: true },
    { label: 'Centralized Team Leads', free: false, pro: false, biz: true },
    { label: 'Lead Export', free: false, pro: true, biz: true },
  ]},
  { category: 'Branding & Domain', features: [
    { label: 'Custom Subdomain', free: false, pro: true, biz: true, note: 'yourname.tapmeonce.com' },
    { label: 'Custom Domain', free: false, pro: false, biz: true, note: 'company.com/team/name' },
  ]},
  { category: 'Team', features: [
    { label: 'Single User', free: true, pro: true, biz: false },
    { label: 'Team Dashboard', free: false, pro: false, biz: true },
    { label: 'Min 5 Team Members', free: false, pro: false, biz: true },
    { label: 'Add Members Anytime', free: false, pro: false, biz: true, note: '+₹200/mo per user' },
    { label: 'Single Admin Billing', free: false, pro: false, biz: true },
  ]},
  { category: 'Card', features: [
    { label: 'Card Activate / Deactivate', free: true, pro: true, biz: true },
    { label: 'Order Tracking', free: true, pro: true, biz: true },
    { label: 'PVC Standard Card', free: true, pro: true, biz: true, note: '₹499 one-time' },
    { label: 'Metal Premium Card', free: true, pro: true, biz: true, note: '₹1,499 one-time' },
  ]},
  { category: 'Support', features: [
    { label: 'Email Support', free: true, pro: true, biz: true },
    { label: 'Priority Support', free: false, pro: false, biz: true },
    { label: 'WhatsApp Support', free: false, pro: false, biz: true },
  ]},
];

export default function Plans() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 z-20 bg-background/80 backdrop-blur">
        <div className="container h-14 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <span className="text-sm font-semibold text-gradient-gold ml-auto">TapMeOnce</span>
        </div>
      </header>

      <div className="container max-w-5xl py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <span className="text-sm font-medium text-primary tracking-wider uppercase">Pricing</span>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold tracking-tight">
            Find Your <span className="text-gradient-gold">Perfect Plan</span>
          </h1>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
            From a simple digital card to a full team networking platform.
            Start free, upgrade when you're ready.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center gap-3 justify-center mt-6">
            <span className={cn('text-sm', billing === 'monthly' ? 'text-foreground' : 'text-muted-foreground')}>Monthly</span>
            <Switch checked={billing === 'yearly'} onCheckedChange={v => setBilling(v ? 'yearly' : 'monthly')} />
            <span className={cn('text-sm flex items-center gap-1.5', billing === 'yearly' ? 'text-foreground' : 'text-muted-foreground')}>
              Yearly <Badge variant="outline" className="text-xs text-green-400 border-green-500/30">Save ~17%</Badge>
            </span>
          </div>
        </motion.div>

        {/* ─── Pricing cards ─── */}
        <div className="grid md:grid-cols-3 gap-5 mb-16">
          {PLAN_LIST.map((plan, i) => {
            const price = billing === 'yearly' && plan.price > 0 ? Math.round(plan.yearlyPrice / 12) : plan.price;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  'relative rounded-2xl p-6 flex flex-col',
                  plan.highlighted ? 'glass-card border-primary/40 glow-gold' : 'glass-card'
                )}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-gold text-primary-foreground text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                    Most Popular
                  </div>
                )}

                <div className="mb-5">
                  <h3 className="font-display text-xl font-bold">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{plan.tagline}</p>
                </div>

                <div className="mb-5">
                  {plan.price === 0 ? (
                    <span className="font-display text-4xl font-bold">Free</span>
                  ) : (
                    <>
                      <span className="font-display text-4xl font-bold">₹{price}</span>
                      <span className="text-sm text-muted-foreground">/mo</span>
                      {billing === 'yearly' && (
                        <p className="text-xs text-green-400 mt-0.5">Billed ₹{plan.yearlyPrice}/year</p>
                      )}
                    </>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">{plan.cardPriceNote}</p>
                </div>

                <Link
                  to={`/setup?plan=${plan.id}&billing=${billing}`}
                  className={cn(
                    'inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold transition-all mb-5 mt-auto',
                    plan.highlighted
                      ? 'bg-gradient-gold text-primary-foreground hover:opacity-90'
                      : 'border border-border text-foreground hover:bg-secondary'
                  )}
                >
                  {plan.price === 0 ? 'Get Started Free' : `Start ${plan.name}`}
                </Link>

                <ul className="space-y-2.5">
                  {plan.features.slice(0, 8).map(f => (
                    <li key={f.label} className="flex items-start gap-2.5 text-sm">
                      {f.included
                        ? <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        : <X className="h-4 w-4 text-muted-foreground/40 shrink-0 mt-0.5" />}
                      <span className={f.included ? 'text-foreground' : 'text-muted-foreground/60'}>
                        {f.label}
                        {f.note && <span className="text-xs text-muted-foreground ml-1">({f.note})</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* ─── Full feature comparison table ─── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <h2 className="font-display text-2xl font-bold text-center mb-8">
            Full <span className="text-gradient-gold">Feature Comparison</span>
          </h2>

          {/* Table header */}
          <div className="rounded-xl overflow-hidden border border-border">
            <div className="grid grid-cols-4 gap-0 sticky top-14 z-10 bg-background border-b border-border">
              <div className="px-4 py-3 text-sm text-muted-foreground">Feature</div>
              {['Free', 'Professional', 'Business'].map(p => (
                <div key={p} className={cn('px-4 py-3 text-center text-sm font-semibold', p === 'Professional' ? 'text-primary' : '')}>
                  {p}
                </div>
              ))}
            </div>

            {ALL_FEATURES.map(group => (
              <div key={group.category}>
                <div className="grid grid-cols-4 px-4 py-2 bg-secondary/30 border-y border-border">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider col-span-4">
                    {group.category}
                  </span>
                </div>
                {group.features.map(f => (
                  <div key={f.label} className="grid grid-cols-4 border-b border-border/50 hover:bg-secondary/20 transition-colors">
                    <div className="px-4 py-3 text-sm text-foreground">
                      {f.label}
                      {f.note && <span className="text-xs text-muted-foreground block">{f.note}</span>}
                    </div>
                    {[f.free, f.pro, f.biz].map((val, i) => (
                      <div key={i} className="px-4 py-3 flex justify-center items-center">
                        {val
                          ? <Check className="h-4 w-4 text-primary" />
                          : <X className="h-4 w-4 text-muted-foreground/30" />}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Any questions? We're happy to help.</p>
          <Link to="/setup">
            <Button className="bg-gradient-gold text-primary-foreground hover:opacity-90 gap-2">
              <Zap className="h-4 w-4" /> Get Your Card Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
