import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Order Your Card",
    description: "Choose your design and personalize your NFC smart card.",
  },
  {
    number: "02",
    title: "Set Up Your Profile",
    description: "Add your links, contact info, and social profiles to your custom page.",
  },
  {
    number: "03",
    title: "Tap & Connect",
    description: "Hold your card to any smartphone. Your profile opens instantly — no app needed.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary tracking-wider uppercase">How It Works</span>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold tracking-tight">
            Three Simple <span className="text-gradient-gold">Steps</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative text-center"
            >
              <div className="font-display text-6xl font-bold text-gradient-gold opacity-30 mb-4">
                {step.number}
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>

              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 -right-4 w-8 h-px bg-border" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
