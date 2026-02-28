import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import logo from "@/assets/TapMeOnce-Logo.png";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="container flex h-16 items-center justify-between gap-2">
        <Link to="/" className="flex items-center shrink-0">
          <img src={logo} alt="TapMeOnce" className="h-16 sm:h-20 md:h-28" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a href="#pricing" className="inline-flex h-9 sm:h-10 items-center justify-center rounded-lg bg-gradient-gold px-4 sm:px-6 text-xs sm:text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 whitespace-nowrap">
            Get Your Card
          </a>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
