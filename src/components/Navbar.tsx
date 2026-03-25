import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const navLinks = ["Home", "About", "Features", "How It Works", "Mobile App"];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id.toLowerCase().replace(/ /g, "-"));
    el?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-card border-b border-border/50" : "bg-transparent"
      }`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2 group"
        >
          <motion.span
            className="text-xl"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            🌱
          </motion.span>
          <span className="font-display text-xl text-foreground tracking-wider">
            Spen<span className="text-primary">tree</span>
          </span>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link}
              onClick={() => scrollTo(link)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-body"
            >
              {link}
            </button>
          ))}

          {/* Get Started Button */}
          <motion.button
            onClick={() => navigate("/signup")}
            className="px-5 py-2 rounded-full bg-primary text-primary-foreground font-heading text-sm font-semibold animate-pulse-glow"
            style={{ boxShadow: "var(--shadow-glow)" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Get Started
          </motion.button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-foreground p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <div className="space-y-1.5">
            <motion.div
              className="w-6 h-0.5 bg-foreground"
              animate={mobileOpen ? { rotate: 45, y: 8 } : {}}
            />
            <motion.div
              className="w-6 h-0.5 bg-foreground"
              animate={mobileOpen ? { opacity: 0 } : {}}
            />
            <motion.div
              className="w-6 h-0.5 bg-foreground"
              animate={mobileOpen ? { rotate: -45, y: -8 } : {}}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          className="md:hidden glass-card mx-4 mb-4 rounded-2xl p-6 space-y-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {navLinks.map((link) => (
            <button
              key={link}
              onClick={() => scrollTo(link)}
              className="block w-full text-left text-foreground font-body py-2"
            >
              {link}
            </button>
          ))}

          {/* Mobile Get Started */}
          <button
            onClick={() => {
              navigate("/signup");
              setMobileOpen(false);
            }}
            className="w-full px-5 py-3 rounded-full bg-primary text-primary-foreground font-heading text-sm font-semibold"
          >
            Get Started
          </button>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;