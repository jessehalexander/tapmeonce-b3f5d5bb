import { motion } from "framer-motion";
import { Smartphone, Zap, BarChart3, Shield, Sparkles, Users, Layers, BellRing } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Sharing",
    description: "One tap opens your full digital profile on any iPhone or Android — no app needed on the receiver's end. Ever.",
  },
  {
    icon: Sparkles,
    title: "AI Bio Generator",
    description: "Tell us your role, skills, and experience. Pick a tone — formal, friendly, or bold. AI writes a crisp 2–3 line bio that sounds exactly like you, only sharper.",
    badge: "AI",
  },
  {
    icon: Users,
    title: "Lead Capture",
    description: "Visitors choose to share their contact info from your profile. You get an instant WhatsApp ping with their name, phone, and city. No awkward follow-up. No forgotten cards.",
    badge: "Pro",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description: "See every tap, city, device type, and link click. Know exactly when and where your card is making an impact — with weekly WhatsApp reports sent straight to you.",
    badge: "Pro",
  },
  {
    icon: Layers,
    title: "Dual Profile Modes",
    description: "Same card, two identities. Switch between Business Mode and Personal Mode from your dashboard. You control which face the world sees — without reprinting anything.",
    badge: "Pro",
  },
  {
    icon: Shield,
    title: "Always Up to Date",
    description: "Changed jobs? New number? Your card updates everywhere, instantly. No reprint. No redistribution. The card people already have always shows the latest you.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary tracking-wider uppercase">Features</span>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold tracking-tight">
            Why <span className="text-gradient-gold">TapMeOnce</span>?
          </h2>
          <p className="mt-4 max-w-lg mx-auto text-muted-foreground">
            Everything you need to make unforgettable first impressions.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="glass-card rounded-xl p-6 group hover:border-primary/30 transition-all duration-300"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors shrink-0">
                  <feature.icon className="h-6 w-6" />
                </div>
                {(feature as any).badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 tracking-widest uppercase">
                    {(feature as any).badge}
                  </span>
                )}
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
