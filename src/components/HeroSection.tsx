import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MapPin, BellRing, Layers } from "lucide-react";
import nfcCard from "@/assets/nfc-card.png";

/* ── Realistic app icon with label ── */
const AppIcon = ({ bg, label, children }: { bg: string; label: string; children: React.ReactNode }) => (
  <div className="flex flex-col items-center gap-[3px]">
    <div className="w-[40px] h-[40px] rounded-[10px] flex items-center justify-center shadow-sm" style={{ background: bg }}>
      {children}
    </div>
    <span className="text-[7px] text-black/50 leading-none truncate w-[44px] text-center">{label}</span>
  </div>
);

/* ── Contact fields for profile ── */
const contactFields = [
  { icon: <><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></>, label: "hello@tapmeonce.com" },
  { icon: <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.11 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></>, label: "+1 (555) 234-5678" },
  { icon: <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>, label: "tapmeonce.com" },
  { icon: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></>, label: "San Francisco, CA" },
];

const Svg = ({ children, ...props }: any) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>{children}</svg>
);

const HeroSection = () => {
  const [phase, setPhase] = useState<"idle" | "tapping" | "ripple" | "notif" | "profile">("idle");

  const triggerTap = useCallback(() => {
    if (phase !== "idle") return;
    setPhase("tapping");
    setTimeout(() => setPhase("ripple"), 600);
    setTimeout(() => setPhase("notif"), 1100);
    setTimeout(() => setPhase("profile"), 2400);
    setTimeout(() => setPhase("idle"), 7000);
  }, [phase]);

  const handleManualTap = () => {
    if (phase === "idle") triggerTap();
  };

  const tapped = phase === "profile";
  const showNotif = phase === "notif" || phase === "profile";

  // Gold accent color
  const goldAccent = "#d4a843";
  const goldAccentLight = "#e8c66a";
  const goldGlow = "rgba(212,168,67,";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] animate-pulse-glow" />
      </div>

      <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center py-20">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-subtle px-4 py-1.5 text-sm text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            AI-Powered NFC · Now Launching in India
          </div>

          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
            One Tap.
            <br />
            <span className="text-gradient-gold">Infinite</span>
            <br />
            Connections.
          </h1>

          <p className="max-w-md text-lg text-muted-foreground leading-relaxed">
            Most business cards get forgotten by morning. TapMeOnce doesn't. One tap on any phone opens a stunning AI-built profile — no app, no friction, no lost connections. While you focus on the conversation, it quietly captures every lead and tracks exactly how far your network is reaching.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#pricing"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-gradient-gold px-8 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 glow-gold"
            >
              Order Now
            </a>
            <a
              href="#how-it-works"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-border px-8 text-sm font-medium text-foreground transition-all hover:bg-secondary"
            >
              See How It Works
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {[
              { Icon: Sparkles,  label: "AI Bio Generator" },
              { Icon: MapPin,    label: "City-Level Analytics" },
              { Icon: BellRing,  label: "WhatsApp Lead Alerts" },
              { Icon: Layers,    label: "Dual Profile Modes" },
            ].map(({ Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground"
              >
                <Icon size={11} className="text-primary" />
                {label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Right — Phone + NFC Card Animation */}
        <div className="relative flex justify-center lg:justify-center lg:pl-12 min-h-[580px] overflow-visible">
          {/* Glow */}
          <motion.div
            className="absolute w-[320px] h-[480px] rounded-[40px] top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2"
            animate={{
              background: tapped
                ? `radial-gradient(circle, ${goldGlow}0.15) 0%, transparent 70%)`
                : `radial-gradient(circle, ${goldGlow}0.04) 0%, transparent 70%)`,
              scale: tapped ? 1.1 : 1,
            }}
            transition={{ duration: 0.8 }}
            style={{ filter: "blur(60px)" }}
          />

          <div className="relative z-10 flex flex-col items-center">
            {/* ── Phone ── */}
            <motion.div
              className="relative w-[240px] lg:w-[260px] rounded-[44px] p-[9px]"
              style={{
                aspectRatio: "9/19.5",
                background: "linear-gradient(145deg, #2a2a3e, #1a1a2e)",
                boxShadow: "0 30px 80px -15px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.12), 0 0 0 1px rgba(255,255,255,0.08), 0 0 40px rgba(212,168,67,0.08)",
              }}
              animate={{ y: tapped ? -6 : 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <div
                className="rounded-[35px] overflow-hidden h-full flex flex-col relative"
                style={{ background: tapped ? "#0a0a1a" : "#f5f5f7" }}
              >
                {/* Status bar */}
                <div className="flex items-center justify-between px-6 pt-3 pb-1 relative z-30">
                  <span className="text-[10px] font-semibold" style={{ color: "rgba(0,0,0,0.7)" }}>9:41</span>
                  <div className="h-[22px] w-24 rounded-full" style={{ background: "#1a1a2e" }} />
                  <div className="flex items-center gap-1">
                    <svg width="12" height="10" viewBox="0 0 20 14" fill="none">
                      <rect x="0" y="10" width="3" height="4" rx="0.5" fill="black" fillOpacity="0.5"/>
                      <rect x="5" y="7" width="3" height="7" rx="0.5" fill="black" fillOpacity="0.5"/>
                      <rect x="10" y="4" width="3" height="10" rx="0.5" fill="black" fillOpacity="0.5"/>
                      <rect x="15" y="0" width="3" height="14" rx="0.5" fill="black" fillOpacity="0.5"/>
                    </svg>
                    <svg width="18" height="10" viewBox="0 0 28 14" fill="none">
                      <rect x="0.5" y="0.5" width="23" height="13" rx="2" stroke="black" strokeOpacity="0.3"/>
                      <rect x="2" y="2" width="15" height="10" rx="1" fill="black" fillOpacity="0.5"/>
                      <rect x="25" y="4" width="2.5" height="6" rx="1" fill="black" fillOpacity="0.25"/>
                    </svg>
                  </div>
                </div>

                {/* ── NOTIFICATION (dark iOS NFC style — gold themed) ── */}
                <AnimatePresence>
                  {showNotif && !tapped && (
                    <motion.div
                      className="absolute top-[38px] left-2.5 right-2.5 z-30 rounded-2xl p-3"
                      style={{
                        background: "rgba(30, 30, 40, 0.92)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                      }}
                      initial={{ y: -60, opacity: 0, scale: 0.9 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      exit={{ y: -40, opacity: 0, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${goldGlow}0.25)` }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={goldAccentLight} strokeWidth="2.2" strokeLinecap="round">
                            <path d="M6 8.32a7.43 7.43 0 0 1 0 7.36" />
                            <path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58" />
                            <path d="M12.91 4.1a16.07 16.07 0 0 1 0 15.8" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold text-white leading-tight">Website NFC Tag</p>
                          <p className="text-[10px] text-white/50 leading-tight mt-0.5">Open tapmeonce.com via…</p>
                        </div>
                        <span className="text-[9px] text-white/40 shrink-0">now</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Screen content */}
                <div className="flex-1 relative overflow-hidden">
                  <AnimatePresence mode="wait">
                    {/* ── HOMESCREEN (white) ── */}
                    {!tapped && (
                      <motion.div
                        key="homescreen"
                        className="absolute inset-0 px-3 pt-3 pb-2 flex flex-col"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="grid grid-cols-4 gap-x-2 gap-y-3 mb-auto">
                          <AppIcon bg="#5856D6" label="Contacts">
                            <Svg><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></Svg>
                          </AppIcon>
                          <AppIcon bg="#007AFF" label="Safari">
                            <Svg><circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/></Svg>
                          </AppIcon>
                          <AppIcon bg="#007AFF" label="Mail">
                            <Svg><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></Svg>
                          </AppIcon>
                          <AppIcon bg="#FF2D55" label="Music">
                            <Svg><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></Svg>
                          </AppIcon>

                          <AppIcon bg="linear-gradient(135deg, #FF9500, #FF2D55)" label="Photos">
                            <Svg><path d="M12 3c-1.2 0-2.4.6-3 1.7A3.6 3.6 0 0 0 4.6 9c-1 .6-1.7 1.8-1.7 3s.7 2.4 1.7 3c-.3 1.2 0 2.5 1 3.4.8.8 2.1 1.2 3.3 1 .6 1 1.8 1.6 3 1.6s2.4-.6 3-1.7c1.2.3 2.5 0 3.4-1 .8-.8 1.2-2 1-3.3 1-.6 1.6-1.8 1.6-3s-.6-2.4-1.7-3c.3-1.2 0-2.5-1-3.4a3.7 3.7 0 0 0-3.3-1C14.4 3.6 13.2 3 12 3z"/></Svg>
                          </AppIcon>
                          <AppIcon bg="#5AC8FA" label="Camera">
                            <Svg><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></Svg>
                          </AppIcon>
                          <AppIcon bg="#30D158" label="Maps">
                            <Svg><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></Svg>
                          </AppIcon>
                          <AppIcon bg="#FF3B30" label="Calendar">
                            <Svg><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></Svg>
                          </AppIcon>

                          <AppIcon bg="#FFCC02" label="Notes">
                            <Svg><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></Svg>
                          </AppIcon>
                          <AppIcon bg="#1C1C1E" label="Clock">
                            <Svg><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Svg>
                          </AppIcon>
                          <AppIcon bg="linear-gradient(135deg, #5AC8FA, #007AFF)" label="Weather">
                            <Svg><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></Svg>
                          </AppIcon>
                          <AppIcon bg="#8E8E93" label="Settings">
                            <Svg><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></Svg>
                          </AppIcon>

                          <AppIcon bg="#5856D6" label="Files">
                            <Svg><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></Svg>
                          </AppIcon>
                          <AppIcon bg="#1C1C1E" label="Wallet">
                            <Svg><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></Svg>
                          </AppIcon>
                          <AppIcon bg="#30D158" label="Messages">
                            <Svg><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></Svg>
                          </AppIcon>
                          <AppIcon bg="#30D158" label="Phone">
                            <Svg><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></Svg>
                          </AppIcon>
                        </div>

                        {/* Page dots */}
                        <div className="flex justify-center gap-1 my-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-black/40" />
                          <div className="w-1.5 h-1.5 rounded-full bg-black/15" />
                          <div className="w-1.5 h-1.5 rounded-full bg-black/15" />
                        </div>

                        {/* Dock */}
                        <div className="rounded-2xl p-1.5 flex justify-around" style={{ background: "rgba(0,0,0,0.04)", backdropFilter: "blur(20px)" }}>
                          {[
                            { bg: "#30D158", d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3" },
                            { bg: "#007AFF", d: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" },
                            { bg: "#30D158", d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" },
                            { bg: "#FF2D55", d: "M9 18V5l12-2v13" },
                          ].map((item, i) => (
                            <div key={i} className="w-10 h-10 rounded-[12px] flex items-center justify-center" style={{ background: item.bg }}>
                              <Svg><path d={item.d} /></Svg>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* ── PROFILE SCREEN (dark theme — gold accented) ── */}
                <AnimatePresence>
                  {tapped && (
                    <motion.div
                      key="profile"
                      className="absolute inset-0 z-40 flex flex-col items-center pt-8 pb-3 px-4"
                      style={{ background: "linear-gradient(180deg, #0a0a12 0%, #12110a 50%, #0a0a12 100%)" }}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      {/* Avatar */}
                      <motion.div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-2"
                        style={{ background: `${goldGlow}0.25)` }}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={goldAccentLight} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      </motion.div>

                      <motion.h3
                        className="font-display font-bold text-[13px] text-white"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        Alex Sterling
                      </motion.h3>
                      <motion.p
                        className="text-[8px] font-medium tracking-[0.2em] mt-0.5 mb-3"
                        style={{ color: goldAccent }}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        SENIOR ARCHITECT
                      </motion.p>

                      {/* Contact fields — dark glassmorphism */}
                      <div className="w-full space-y-1.5">
                        {contactFields.map((f, i) => (
                          <motion.div
                            key={i}
                            className="flex items-center gap-2 rounded-xl px-3 py-2"
                            style={{
                              background: "rgba(255,255,255,0.05)",
                              border: "1px solid rgba(255,255,255,0.08)",
                            }}
                            initial={{ x: 24, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.35, delay: 0.3 + i * 0.1 }}
                          >
                            <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${goldGlow}0.2)` }}>
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={goldAccentLight} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{f.icon}</svg>
                            </div>
                            <span className="text-[10px] font-medium text-white/80">{f.label}</span>
                          </motion.div>
                        ))}
                      </div>

                      {/* Save Contact */}
                      <motion.div
                        className="w-full py-2.5 rounded-full text-center text-white text-[11px] font-bold tracking-wide mt-auto"
                        style={{
                          background: `linear-gradient(135deg, ${goldAccent}, ${goldAccentLight})`,
                          boxShadow: `0 4px 20px ${goldGlow}0.4)`,
                        }}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                      >
                        Save Contact
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* ── NFC Card — uses uploaded card image ── */}
            <AnimatePresence>
              {!tapped && (
                <motion.div
                  onClick={handleManualTap}
                  className="-mt-16 md:-mt-20 lg:absolute lg:mt-0 lg:-bottom-2 lg:-right-24 rounded-xl cursor-pointer select-none overflow-hidden"
                  style={{
                    width: 240,
                    height: 150,
                    boxShadow: `0 20px 60px -10px rgba(0,0,0,0.5), 0 0 30px ${goldGlow}0.1)`,
                  }}
                  initial={{ opacity: 1, rotate: 4, x: 0, y: 0, scale: 1 }}
                  animate={
                    phase === "tapping" || phase === "ripple"
                      ? { rotate: -8, x: -60, y: -80, scale: 0.92, opacity: 1 }
                      : { rotate: 4, x: 0, y: 0, scale: 1, opacity: 1 }
                  }
                  exit={{ opacity: 0, scale: 0.85, y: 20 }}
                  whileHover={phase === "idle" ? { scale: 1.04, rotate: 0 } : {}}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {/* Ripple */}
                  <AnimatePresence>
                    {phase === "ripple" && (
                      <motion.div
                        className="absolute inset-0 rounded-xl"
                        style={{ background: `${goldGlow}0.15)` }}
                        initial={{ opacity: 0.8, scale: 0.8 }}
                        animate={{ opacity: 0, scale: 1.3 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Shimmer */}
                  <motion.div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }}
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
                  />

                  {/* Card image */}
                  <img
                    src={nfcCard}
                    alt="TapMeOnce NFC Card"
                    className="absolute inset-0 w-full h-full object-cover rounded-xl"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* CLICK TO TAP */}
            <AnimatePresence>
              {phase === "idle" && (
                <motion.div
                  className="mt-6 md:mt-3 lg:absolute lg:mt-0 lg:-bottom-14 lg:right-4"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="bg-background/90 backdrop-blur-sm rounded-lg px-5 py-2.5 border border-border/30 shadow-md">
                    <span className="text-base font-display font-bold tracking-[0.18em] uppercase text-muted-foreground">
                      CLICK TO TAP
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
