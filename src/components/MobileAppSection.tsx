import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const MobileAppSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="mobile-app" className="py-24 md:py-32 px-4 relative" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Phone mockups */}
          <motion.div
            className="flex justify-center gap-6"
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            {/* Phone 1 */}
            <div className="w-40 md:w-48 h-72 md:h-80 rounded-3xl border-2 border-border bg-forest-deep p-2 relative overflow-hidden">
              <div className="w-full h-full rounded-2xl overflow-hidden bg-background/5 relative">
                {/* Status bar */}
                <div className="h-6 flex items-center justify-center">
                  <div className="w-12 h-1 rounded-full bg-foreground/30" />
                </div>
                {/* Mini tree */}
                <div className="flex justify-center mt-4">
                  <motion.svg viewBox="0 0 60 80" width={60} height={80}>
                    <rect x="26" y="50" width="8" height="20" rx="2" fill="hsl(30 30% 20%)" />
                    <motion.ellipse
                      cx="30" cy="35" rx="22" ry="28"
                      fill="hsl(135 58% 35%)"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  </motion.svg>
                </div>
                {/* Budget ring */}
                <div className="flex justify-center mt-2">
                  <svg viewBox="0 0 40 40" width={40} height={40}>
                    <circle cx="20" cy="20" r="16" fill="none" stroke="hsl(150 15% 16%)" strokeWidth="3" />
                    <motion.circle
                      cx="20" cy="20" r="16" fill="none" stroke="hsl(135 58% 35%)" strokeWidth="3"
                      strokeDasharray="100"
                      strokeDashoffset="35"
                      strokeLinecap="round"
                      transform="rotate(-90 20 20)"
                      animate={{ strokeDashoffset: [100, 35] }}
                      transition={{ duration: 2, delay: 0.5 }}
                    />
                  </svg>
                </div>
                <p className="text-center text-[8px] text-muted-foreground font-body mt-1">₹650 / ₹1000</p>
              </div>
            </div>

            {/* Phone 2 (offset) */}
            <div className="w-40 md:w-48 h-72 md:h-80 rounded-3xl border-2 border-border bg-forest-deep p-2 relative overflow-hidden mt-8">
              <div className="w-full h-full rounded-2xl overflow-hidden bg-background/5 relative">
                <div className="h-6 flex items-center justify-center">
                  <div className="w-12 h-1 rounded-full bg-foreground/30" />
                </div>
                {/* Chat preview */}
                <div className="p-3 space-y-2">
                  <div className="glass-card p-2 rounded-lg">
                    <p className="text-[7px] text-foreground font-speech italic">"Your tree grows strong today..."</p>
                  </div>
                  <div className="glass-card p-2 rounded-lg ml-4">
                    <p className="text-[7px] text-muted-foreground font-body">How am I doing?</p>
                  </div>
                  <div className="glass-card p-2 rounded-lg">
                    <p className="text-[7px] text-foreground font-speech italic">"6 days of wisdom. The crystal tree nears."</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-sm font-heading text-primary tracking-widest uppercase mb-4 block">
              Mobile App
            </span>
            <h2 className="text-3xl md:text-4xl font-display text-foreground mb-6">
              Your Forest in Your <span className="text-primary text-glow">Pocket</span>
            </h2>
            <ul className="space-y-4 mb-8">
              {[
                "Offline expense tracking — no internet needed",
                "Automatic SMS transaction detection",
                "Pushkara notifications throughout your day",
                "Home screen widget showing today's tree",
              ].map((item, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-3 text-muted-foreground font-body text-sm"
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <span className="text-primary mt-0.5">🌿</span>
                  {item}
                </motion.li>
              ))}
            </ul>
            <motion.button
              className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-heading font-semibold text-sm"
              style={{ boxShadow: "var(--shadow-glow)" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              Download APK 📱
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MobileAppSection;
