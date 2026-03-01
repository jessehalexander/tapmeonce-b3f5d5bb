// ─────────────────────────────────────────────
// TapMeOnce — Login / Forgot Password page
// ─────────────────────────────────────────────

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { signIn, resetPassword } from '@/lib/supabase';
import { cn } from '@/lib/utils';

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill in all fields'); return; }
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      toast.error(error.message === 'Invalid login credentials'
        ? 'Incorrect email or password'
        : error.message
      );
    } else {
      toast.success('Welcome back!');
      navigate('/dashboard');
    }
    setLoading(false);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error('Enter your email address'); return; }
    setLoading(true);
    const { error } = await resetPassword(email);
    if (error) {
      toast.error(error.message);
    } else {
      setResetSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container h-14 flex items-center justify-between">
          <Link to="/" className="text-sm font-semibold text-gradient-gold">TapMeOnce</Link>
          <span className="text-xs text-muted-foreground">
            No account? <Link to="/setup" className="text-primary hover:underline">Get your card</Link>
          </span>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-3">
              <span className="text-2xl">⚡</span>
            </div>
            <h1 className="font-display text-2xl font-bold">
              {mode === 'forgot' ? 'Reset password' : 'Welcome back'}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {mode === 'forgot'
                ? "We'll send a reset link to your email"
                : 'Sign in to your TapMeOnce account'}
            </p>
          </div>

          {/* Login Form */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1.5"
                  autoFocus
                  autoComplete="email"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <Label>Password</Label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90 font-semibold"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
              </Button>
            </form>
          )}

          {/* Forgot password form */}
          {mode === 'forgot' && !resetSent && (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <Label>Email address</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1.5"
                  autoFocus
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send reset link'}
              </Button>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mx-auto"
              >
                <ArrowLeft className="h-3 w-3" /> Back to login
              </button>
            </form>
          )}

          {resetSent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center p-4 rounded-xl bg-green-500/10 border border-green-500/30"
            >
              <p className="text-sm font-medium text-green-400">Reset link sent!</p>
              <p className="text-xs text-muted-foreground mt-1">Check your inbox at {email}</p>
              <button
                onClick={() => { setMode('login'); setResetSent(false); }}
                className="mt-3 text-xs text-primary hover:underline"
              >
                Back to login
              </button>
            </motion.div>
          )}

          {/* Sign up CTA */}
          {mode === 'login' && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account?{' '}
              <Link to="/setup" className="text-primary hover:underline font-medium">
                Get your NFC card →
              </Link>
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
