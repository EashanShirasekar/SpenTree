import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  { num: "01", icon: "🌱", title: "Set Your Budget", desc: "Define your daily spending limit. A seed is planted." },
  { num: "02", icon: "💸", title: "Log Expenses", desc: "Track spending manually or let SMS detection handle it." },
  { num: "03", icon: "🌿", title: "Watch Your Tree React", desc: "Your tree grows, sways, or wilts based on your choices." },
  { num: "04", icon: "🌲", title: "Grow Your Forest", desc: "Days of discipline build a lush, evolving landscape." },
  { num: "05", icon: "🏆", title: "Earn & Evolve", desc: "Unlock biomes, badges, and Pushkara's rarest forms." },
];

const HowItWorks = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="how-it-works" className="py-24 md:py-32 px-4 relative" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="text-sm font-heading text-primary tracking-widest uppercase mb-4 block">
            How It Works
          </span>
          <h2 className="text-3xl md:text-5xl font-display text-foreground">
            From Seed to <span className="text-primary text-glow">Forest</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Vertical line connector */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border/50 md:-translate-x-px" />

          <div className="space-y-12">
            {steps.map((s, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={i}
                  className={`relative flex items-start gap-6 md:gap-12 ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
                >
                  {/* Content card */}
                  <div className={`flex-1 ${isLeft ? "md:text-right" : "md:text-left"} pl-16 md:pl-0`}>
                    <div className="glass-card p-6 inline-block">
                      <span className="text-2xl mb-2 block">{s.icon}</span>
                      <h3 className="text-lg font-heading text-foreground font-semibold mb-2">{s.title}</h3>
                      <p className="text-sm text-muted-foreground font-body">{s.desc}</p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-2 w-5 h-5 rounded-full bg-primary border-4 border-background z-10"
                    style={{ boxShadow: "var(--shadow-glow)" }}
                  />

                  {/* Spacer for the other side */}
                  <div className="hidden md:block flex-1" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
