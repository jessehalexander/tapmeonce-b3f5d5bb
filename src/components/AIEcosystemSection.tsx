// ─────────────────────────────────────────────
// TapMeOnce — AI Ecosystem Section
// Shows three core AI-powered moments:
//   1. Bio Generator (input → tone → bio)
//   2. Lead Capture (tap → WhatsApp ping)
//   3. Smart Analytics (city-level dashboard)
// ─────────────────────────────────────────────

import { motion } from "framer-motion";
import { Sparkles, MessageSquare, BarChart3, CheckCircle2 } from "lucide-react";

const goldAccent = "#d4a843";
const goldLight  = "#e8c66a";

// ── 1. Bio Generator Card ──────────────────────
const BioCard = () => (
  <div
    className="rounded-2xl p-5 flex flex-col gap-4"
    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
  >
    {/* Input row */}
    <div className="space-y-2">
      <p className="text-[10px] text-white/40 uppercase tracking-widest">Your Input</p>
      <div
        className="rounded-xl px-3 py-2.5 text-xs text-white/70"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        Senior Architect · 9 yrs · buildings &amp; sustainability
      </div>
    </div>

    {/* Tone pills */}
    <div className="flex gap-2">
      {["Formal", "Friendly", "Bold"].map((tone, i) => (
        <span
          key={tone}
          className="rounded-full px-3 py-1 text-[10px] font-semibold"
          style={
            i === 1
              ? { background: `${goldAccent}30`, color: goldLight, border: `1px solid ${goldAccent}50` }
              : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }
          }
        >
          {tone}
        </span>
      ))}
    </div>

    {/* Generated bio */}
    <div
      className="rounded-xl p-3"
      style={{ background: `${goldAccent}12`, border: `1px solid ${goldAccent}30` }}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <Sparkles size={10} color={goldLight} />
        <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: goldLight }}>
          AI Generated
        </span>
      </div>
      <p className="text-xs text-white/80 leading-relaxed">
        "Senior Architect with 9 years designing spaces where sustainability meets scale. I believe every structure should outlast its era — and tell a story worth inhabiting."
      </p>
    </div>
  </div>
);

// ── 2. Lead Capture + WhatsApp Card ───────────
const LeadCard = () => (
  <div
    className="rounded-2xl p-5 flex flex-col gap-4"
    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
  >
    <p className="text-[10px] text-white/40 uppercase tracking-widest">Lead Captured</p>

    {/* Lead row */}
    <div
      className="flex items-center gap-3 rounded-xl px-3 py-3"
      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-white"
        style={{ background: `${goldAccent}30` }}
      >
        P
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-white">Priya Sharma</p>
        <p className="text-[10px] text-white/50">+91 98765 43210 · Mumbai</p>
      </div>
      <CheckCircle2 size={14} color={goldLight} />
    </div>

    {/* WhatsApp ping */}
    <div
      className="rounded-xl p-3"
      style={{ background: "#25D36612", border: "1px solid #25D36630" }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <div className="w-5 h-5 rounded-full bg-[#25D366] flex items-center justify-center">
          <MessageSquare size={10} color="white" />
        </div>
        <span className="text-[9px] font-bold text-[#25D366] uppercase tracking-widest">WhatsApp Alert</span>
        <span className="ml-auto text-[9px] text-white/30">just now</span>
      </div>
      <p className="text-xs text-white/70 leading-relaxed">
        🔔 New lead from Mumbai: <span className="text-white font-medium">Priya Sharma</span> — +91 98765 43210
      </p>
    </div>
  </div>
);

// ── 3. Analytics Card ─────────────────────────
const AnalyticsCard = () => {
  const bars = [
    { city: "Mumbai", taps: 38, pct: 100 },
    { city: "Delhi",  taps: 27, pct: 71  },
    { city: "Pune",   taps: 19, pct: 50  },
    { city: "Bengaluru", taps: 14, pct: 37 },
  ];

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-white/40 uppercase tracking-widest">Taps by City · Last 7 days</p>
        <span className="text-[10px] font-bold" style={{ color: goldLight }}>98 total</span>
      </div>

      <div className="space-y-2.5">
        {bars.map((b) => (
          <div key={b.city} className="space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-white/60">{b.city}</span>
              <span className="text-white/50">{b.taps}</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${goldAccent}, ${goldLight})` }}
                initial={{ width: 0 }}
                whileInView={{ width: `${b.pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1">
        {[
          { label: "Link Clicks", value: "41" },
          { label: "Contacts Saved", value: "23" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl px-3 py-2 text-center"
            style={{ background: `${goldAccent}12`, border: `1px solid ${goldAccent}20` }}
          >
            <p className="text-sm font-bold" style={{ color: goldLight }}>{s.value}</p>
            <p className="text-[9px] text-white/50 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Main Section ──────────────────────────────
const panels = [
  {
    icon: Sparkles,
    label: "AI",
    title: "AI Writes Your Bio",
    subtitle: "You fill in 3 fields. AI delivers a bio that sounds like you, only sharper — in under 10 seconds.",
    card: <BioCard />,
  },
  {
    icon: MessageSquare,
    label: "Pro",
    title: "Leads Come to You",
    subtitle: "Visitors voluntarily share their contact info. You get a WhatsApp notification the moment they do.",
    card: <LeadCard />,
  },
  {
    icon: BarChart3,
    label: "Pro",
    title: "Know Every Tap",
    subtitle: "City-level analytics, device types, link clicks — weekly WhatsApp reports so you never miss impact.",
    card: <AnalyticsCard />,
  },
];

const AIEcosystemSection = () => (
  <section className="py-24 relative overflow-hidden" style={{ background: "hsl(220 20% 3%)" }}>
    {/* Ambient glow */}
    <div
      className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full blur-[120px]"
      style={{ background: `${goldAccent}08` }}
    />

    <div className="container relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <span className="text-sm font-medium text-primary tracking-wider uppercase">AI Ecosystem</span>
        <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold tracking-tight text-white">
          The Intelligence{" "}
          <span className="text-gradient-gold">Behind the Card</span>
        </h2>
        <p className="mt-4 max-w-lg mx-auto text-white/50 text-base leading-relaxed">
          Your NFC card is the gateway. Behind it is a suite of AI tools that work while you network.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 items-stretch">
        {panels.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            className="flex flex-col gap-5 h-full"
          >
            {/* Header */}
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${goldAccent}20` }}
              >
                <p.icon size={18} color={goldLight} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display text-base font-bold text-white">{p.title}</h3>
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-widest"
                    style={{ background: `${goldAccent}25`, color: goldLight, border: `1px solid ${goldAccent}40` }}
                  >
                    {p.label}
                  </span>
                </div>
                <p className="text-xs text-white/50 leading-relaxed">{p.subtitle}</p>
              </div>
            </div>

            {/* Card — flex-1 so all three columns reach the same bottom edge */}
            <div className="flex-1 flex flex-col [&>div]:flex-1">
              {p.card}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default AIEcosystemSection;
