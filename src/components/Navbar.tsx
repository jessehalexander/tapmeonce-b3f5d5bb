// ─────────────────────────────────────────────
// TapMeOnce — Navbar
// Login visible for all users, admin shortcut
// ─────────────────────────────────────────────

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap, LogIn, LayoutDashboard, Shield, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import logo from "@/assets/TapMeOnce-Logo.png";

const NAV_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Plans", href: "/plans" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center shrink-0">
          <img src={logo} alt="TapMeOnce" className="h-10" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary/60"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-amber-400 hover:text-amber-300">
                    <Shield className="h-3.5 w-3.5" /> Admin
                  </Button>
                </Link>
              )}
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="gap-1.5 text-sm">
                  <LayoutDashboard className="h-4 w-4" />
                  {profile?.full_name?.split(" ")[0] || "Dashboard"}
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="text-sm text-muted-foreground border-border hover:text-foreground"
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="gap-1.5 text-sm">
                  <LogIn className="h-4 w-4" /> Sign In
                </Button>
              </Link>
              <Link to="/setup">
                <Button size="sm" className="bg-gradient-gold text-primary-foreground hover:opacity-90 gap-1.5 text-sm font-semibold">
                  <Zap className="h-4 w-4" /> Get Your Card
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background overflow-hidden"
          >
            <div className="container py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary/60"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 border-t border-border space-y-2">
                {user ? (
                  <>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setMobileOpen(false)}>
                        <Button variant="outline" className="w-full gap-2 text-amber-400 border-amber-500/30">
                          <Shield className="h-4 w-4" /> Admin Panel
                        </Button>
                      </Link>
                    )}
                    <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" className="w-full gap-2">
                        <LayoutDashboard className="h-4 w-4" /> My Dashboard
                      </Button>
                    </Link>
                    <Button variant="ghost" className="w-full" onClick={() => { handleSignOut(); setMobileOpen(false); }}>
                      Sign out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" className="w-full gap-2">
                        <LogIn className="h-4 w-4" /> Sign In
                      </Button>
                    </Link>
                    <Link to="/setup" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full bg-gradient-gold text-primary-foreground gap-2 font-semibold">
                        <Zap className="h-4 w-4" /> Get Your Card
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
