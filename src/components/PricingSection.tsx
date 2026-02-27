import { motion } from "framer-motion";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$29",
    description: "Perfect for individuals",
    features: ["1 NFC Smart Card", "Custom Profile Page", "Unlimited Taps", "Basic Analytics", "Email Support"],
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$49",
    description: "For the serious networker",
    features: ["2 NFC Smart Cards", "Premium Profile Page", "Unlimited Taps", "Advanced Analytics", "Priority Support", "Custom Branding"],
    highlighted: true,
  },
  {
    name: "Team",
    price: "$99",
    description: "For growing businesses",
    features: ["5 NFC Smart Cards", "Team Dashboard", "Unlimited Taps", "Full Analytics Suite", "Dedicated Support", "Custom Branding", "CRM Integration"],
    highlighted: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary tracking-wider uppercase">Pricing</span>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold tracking-tight">
            Choose Your <span className="text-gradient-gold">Plan</span>
          </h2>
          <p className="mt-4 max-w-lg mx-auto text-muted-foreground">
            No subscriptions. One-time purchase, lifetime use.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className={`rounded-xl p-8 flex flex-col ${
                plan.highlighted
                  ? "glass-card border-primary/40 glow-gold relative"
                  : "glass-card"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-gold px-4 py-1 text-xs font-semibold text-primary-foreground">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-display text-lg font-semibold text-foreground">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="font-display text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-sm text-muted-foreground ml-1">one-time</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-secondary-foreground">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#"
                className={`inline-flex h-11 items-center justify-center rounded-lg px-6 text-sm font-semibold transition-all ${
                  plan.highlighted
                    ? "bg-gradient-gold text-primary-foreground hover:opacity-90"
                    : "border border-border text-foreground hover:bg-secondary"
                }`}
              >
                Get Started
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
