import { motion } from "framer-motion";
import { Smartphone, Zap, Globe, Shield } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Sharing",
    description: "One tap transfers your full digital profile — no app needed on the receiver's end.",
  },
  {
    icon: Globe,
    title: "Custom Landing Page",
    description: "Each card links to a fully customizable profile with your links, socials, and bio.",
  },
  {
    icon: Smartphone,
    title: "Works Everywhere",
    description: "Compatible with all modern iPhones and Android devices. No app required.",
  },
  {
    icon: Shield,
    title: "Always Up to Date",
    description: "Update your info anytime. Your card never goes out of date — unlike paper.",
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
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="glass-card rounded-xl p-6 group hover:border-primary/30 transition-all duration-300"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6" />
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
