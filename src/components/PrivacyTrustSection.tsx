// ─────────────────────────────────────────────
// TapMeOnce — Privacy & Trust Section
// Addresses AI data concerns for the Indian market.
// Positioned just before Pricing on the homepage.
// ─────────────────────────────────────────────

import { motion } from "framer-motion";
import { Lock, ShieldCheck, EyeOff, UserCheck } from "lucide-react";

const pillars = [
  {
    icon: Lock,
    title: "Your data stays yours",
    body: "We never sell your profile data or your visitors' contact information to third parties. Your leads are yours — not ours to monetise.",
  },
  {
    icon: EyeOff,
    title: "AI only sees what you share",
    body: "The AI Bio Generator processes only what you type into the form. We don't scan your emails, contacts, or background activity to train any model.",
  },
  {
    icon: UserCheck,
    title: "Visitors choose to share",
    body: "Lead capture is 100% voluntary. Your profile loads fully and instantly on every tap — no pop-ups, no forced forms. Visitors share their details only when they want to.",
  },
  {
    icon: ShieldCheck,
    title: "Built for Indian professionals",
    body: "TapMeOnce is designed and operated in India. We follow Indian data privacy standards and store your data on Indian infrastructure.",
  },
];

const PrivacyTrustSection = () => (
  <section className="py-24 relative">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <span className="text-sm font-medium text-primary tracking-wider uppercase">Privacy & Trust</span>
        <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold tracking-tight">
          AI-Powered.{" "}
          <span className="text-gradient-gold">Privacy-First.</span>
        </h2>
        <p className="mt-4 max-w-xl mx-auto text-muted-foreground leading-relaxed">
          We know trust is earned, not assumed — especially with an AI company. Here is exactly how TapMeOnce handles your data.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
        {pillars.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass-card rounded-xl p-6 flex flex-col gap-4"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <p.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-foreground mb-1.5">{p.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{p.body}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Reassurance strip */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-10 text-center"
      >
        <p className="text-xs text-muted-foreground">
          Questions about your data?{" "}
          <a
            href="https://wa.me/919962734024?text=Hi%20TapMeOnce%2C%20I%20have%20a%20question%20about%20data%20privacy."
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
          >
            Talk to us on WhatsApp →
          </a>
        </p>
      </motion.div>
    </div>
  </section>
);

export default PrivacyTrustSection;
