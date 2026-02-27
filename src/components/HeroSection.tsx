import { motion } from "framer-motion";
import heroCard from "@/assets/hero-card.png";

const HeroSection = () => {
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
            The Future of Networking
          </div>

          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
            One Tap.
            <br />
            <span className="text-gradient-gold">Infinite</span>
            <br />
            Connections.
          </h1>

          <p className="max-w-md text-lg text-muted-foreground leading-relaxed">
            Ditch the paper cards. Share your contact info, socials, and portfolio with a single tap of your NFC-powered smart card.
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

          <div className="flex items-center gap-6 pt-4">
            <div className="text-center">
              <div className="font-display text-2xl font-bold text-foreground">10K+</div>
              <div className="text-xs text-muted-foreground">Cards Shipped</div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <div className="font-display text-2xl font-bold text-foreground">50K+</div>
              <div className="text-xs text-muted-foreground">Taps Made</div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <div className="font-display text-2xl font-bold text-foreground">4.9★</div>
              <div className="text-xs text-muted-foreground">Rating</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="relative flex items-center justify-center"
        >
          <div className="absolute w-80 h-80 rounded-full bg-primary/10 blur-[80px]" />
          <img
            src={heroCard}
            alt="TapMeOnce NFC Business Card"
            className="relative w-full max-w-lg animate-float"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
