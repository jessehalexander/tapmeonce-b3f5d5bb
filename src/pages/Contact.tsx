// ─────────────────────────────────────────────
// TapMeOnce — Talk to Sales / Contact Page
// WhatsApp direct link + contact form → hello@tapmeonce.com
// ─────────────────────────────────────────────

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, Mail, Send, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import logo from '@/assets/TapMeOnce-Logo.png';

const WHATSAPP_NUMBER = '919962734024'; // +91-9962734024
const SALES_EMAIL = 'hello@tapmeonce.com';

export default function Contact() {
  const { user, profile } = useAuth();

  const [name, setName] = useState(profile?.full_name || '');
  const [email, setEmail] = useState(profile?.email || user?.email || '');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Hi TapMeOnce! I'd like to learn more about your plans.${name ? `\n\nMy name is ${name}.` : ''}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    if (!email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setLoading(true);
    // Use mailto: to open the user's email client pre-filled for hello@tapmeonce.com
    const subject = encodeURIComponent(`TapMeOnce Inquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );
    window.location.href = `mailto:${SALES_EMAIL}?subject=${subject}&body=${body}`;
    // Show success state after a short delay
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-20 bg-background/80 backdrop-blur">
        <div className="container h-14 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <img src={logo} alt="TapMeOnce" className="h-9 ml-auto" />
        </div>
      </header>

      <div className="flex-1 container max-w-2xl py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <span className="text-sm font-medium text-primary tracking-wider uppercase">Talk to Sales</span>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight">
            Let's <span className="text-gradient-gold">Connect</span>
          </h1>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            Questions about plans, bulk orders, or custom integrations? We're here to help.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {/* WhatsApp CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-6 flex flex-col items-center text-center gap-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-green-500/15 flex items-center justify-center">
              <MessageCircle className="h-7 w-7 text-green-400" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold mb-1">Chat on WhatsApp</h2>
              <p className="text-sm text-muted-foreground">Get an instant reply. We typically respond in under 30 minutes.</p>
            </div>
            <Button
              onClick={handleWhatsApp}
              className="w-full bg-green-600 hover:bg-green-500 text-white gap-2 font-semibold"
            >
              <MessageCircle className="h-4 w-4" /> Start WhatsApp Chat
            </Button>
            <p className="text-xs text-muted-foreground">+91-9962734024 · Mon–Sat, 9am–7pm IST</p>
          </motion.div>

          {/* Email / Contact form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold">Send a Message</h2>
                <p className="text-sm text-muted-foreground">We'll reply within 24 hours</p>
              </div>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
                <p className="font-semibold text-foreground">Your email app is open!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  We've pre-filled everything. Just hit Send in your email app.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-xs text-primary hover:underline"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                {!user && (
                  <div>
                    <Label className="text-xs">Your name</Label>
                    <Input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Ravi Kumar"
                      className="mt-1 text-sm"
                      autoFocus
                    />
                  </div>
                )}
                {!user && (
                  <div>
                    <Label className="text-xs">Email address</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="mt-1 text-sm"
                    />
                  </div>
                )}
                {user && (
                  <div className="px-3 py-2 rounded-lg bg-secondary/40 text-sm text-muted-foreground">
                    Sending as <span className="font-medium text-foreground">{profile?.full_name || user.email}</span>
                  </div>
                )}
                <div>
                  <Label className="text-xs">Message</Label>
                  <Textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="I'm interested in the Business plan for my team of 10…"
                    rows={4}
                    className="mt-1 text-sm resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90 gap-2 font-semibold"
                >
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Opening email…</>
                  ) : (
                    <><Send className="h-4 w-4" /> Send Message</>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Opens your email app pre-filled to {SALES_EMAIL}
                </p>
              </form>
            )}
          </motion.div>
        </div>

        {/* FAQ teaser */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10 text-center"
        >
          <p className="text-muted-foreground text-sm">
            Looking for pricing details?{' '}
            <Link to="/plans" className="text-primary hover:underline font-medium">
              View our full plan comparison →
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
