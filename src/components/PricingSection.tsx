// ─────────────────────────────────────────────
// TapMeOnce — Pricing Section (Homepage)
// Updated with correct Indian pricing
// ─────────────────────────────────────────────

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PLAN_LIST } from "@/lib/plans";

export default function PricingSection() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <section id="pricing" className="py-24 relative">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-primary tracking-wider uppercase">Pricing</span>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold tracking-tight">
            Choose Your <span className="text-gradient-gold">Plan</span>
          </h2>
          <p className="mt-3 max-w-lg mx-auto text-muted-foreground">
            Start free with every card. Upgrade when you're ready to grow.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center gap-3 justify-center mt-6">
            <span className={cn("text-sm", billing === "monthly" ? "text-foreground" : "text-muted-foreground")}>
              Monthly
            </span>
            <Switch
              checked={billing === "yearly"}
              onCheckedChange={(v) => setBilling(v ? "yearly" : "monthly")}
            />
            <span className={cn("text-sm flex items-center gap-1.5", billing === "yearly" ? "text-foreground" : "text-muted-foreground")}>
              Yearly{" "}
              <Badge variant="outline" className="text-xs text-green-400 border-green-500/30">
                Save ~17%
              </Badge>
            </span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PLAN_LIST.map((plan, i) => {
            const price = billing === "yearly" && plan.price > 0
              ? Math.round(plan.yearlyPrice / 12)
              : plan.price;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className={cn(
                  "relative rounded-2xl p-7 flex flex-col",
                  plan.highlighted
                    ? "glass-card border-primary/40 glow-gold"
                    : "glass-card"
                )}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-gold px-4 py-1 text-xs font-bold text-primary-foreground whitespace-nowrap">
                    Most Popular
                  </div>
                )}

                <div className="mb-5">
                  <h3 className="font-display text-xl font-bold">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{plan.tagline}</p>
                </div>

                <div className="mb-5 space-y-3">
                  {/* Subscription cost */}
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Subscription</p>
                    {plan.price === 0 ? (
                      <>
                        <span className="font-display text-4xl font-bold">Free</span>
                        <p className="text-xs text-muted-foreground mt-0.5">included with card</p>
                      </>
                    ) : (
                      <>
                        <div className="flex items-baseline gap-1">
                          <span className="font-display text-4xl font-bold">₹{price}</span>
                          <span className="text-sm text-muted-foreground">/mo</span>
                        </div>
                        {plan.id === 'business' && (
                          <p className="text-xs text-amber-400 mt-0.5">for 5 users · +₹200/mo per extra user</p>
                        )}
                        {billing === "yearly" && (
                          <p className="text-xs text-green-400 mt-0.5">Billed ₹{plan.yearlyPrice}/year</p>
                        )}
                      </>
                    )}
                  </div>
                  {/* Card cost */}
                  <div className="pt-2 border-t border-border/50">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">NFC Card (one-time)</p>
                    <p className="text-xs text-muted-foreground">{plan.cardPriceNote}</p>
                  </div>
                </div>

                <ul className="space-y-2.5 mb-7 flex-1">
                  {plan.features.slice(0, 7).map((feature) => (
                    <li key={feature.label} className="flex items-start gap-2.5 text-sm min-w-0">
                      {feature.included ? (
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground/30 shrink-0 mt-0.5" />
                      )}
                      <span className={cn("leading-snug min-w-0", feature.included ? "text-secondary-foreground" : "text-muted-foreground/50")}>
                        {feature.label}
                        {feature.note && <span className="text-xs text-muted-foreground block mt-0.5">{feature.note}</span>}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={`/setup?plan=${plan.id}&billing=${billing}`}
                  className={cn(
                    "inline-flex h-11 items-center justify-center rounded-xl px-6 text-sm font-semibold transition-all gap-2",
                    plan.highlighted
                      ? "bg-gradient-gold text-primary-foreground hover:opacity-90"
                      : "border border-border text-foreground hover:bg-secondary"
                  )}
                >
                  {plan.price === 0 ? "Get Started Free" : `Start ${plan.name}`}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* View full comparison */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <Link
            to="/plans"
            className="text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
          >
            Explore full feature comparison →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
