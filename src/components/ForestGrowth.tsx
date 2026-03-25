import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ForestGrowth = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const trees = Array.from({ length: 21 }, (_, i) => ({
    health: Math.random() > 0.2 ? "healthy" : Math.random() > 0.5 ? "stressed" : "burnt",
    delay: i * 0.08,
    x: (i % 7) * 14 + 5 + (Math.random() * 4 - 2),
    size: 0.6 + Math.random() * 0.5,
  }));

  const getColor = (h: string) => {
    if (h === "healthy") return "hsl(135 58% 35%)";
    if (h === "stressed") return "hsl(43 90% 50%)";
    return "hsl(25 85% 47%)";
  };

  return (
    <section className="py-24 md:py-32 px-4 relative" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="text-sm font-heading text-primary tracking-widest uppercase mb-4 block">
            Long-Term Growth
          </span>
          <h2 className="text-3xl md:text-5xl font-display text-foreground mb-4">
            Every Day Adds a <span className="text-primary text-glow">Tree</span>
          </h2>
          <p className="text-muted-foreground font-body max-w-lg mx-auto">
            Watch your financial discipline transform into a lush forest. Each tree is a day of your journey.
          </p>
        </motion.div>

        {/* Forest visualization */}
        <motion.div
          className="glass-card p-8 relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Ground */}
          <div className="h-4 bg-forest-canopy rounded-full opacity-40 mt-auto" />

          {/* Trees grid */}
          <svg viewBox="0 0 100 50" className="w-full h-48 md:h-64 -mb-4">
            {trees.map((t, i) => (
              <motion.g
                key={i}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={inView ? { scaleY: 1, opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: t.delay }}
                style={{ transformOrigin: `${t.x + 3}px 48px` }}
              >
                {/* Trunk */}
                <rect
                  x={t.x + 2}
                  y={40}
                  width={2 * t.size}
                  height={8}
                  rx="0.5"
                  fill="hsl(30 30% 20%)"
                />
                {/* Canopy */}
                <ellipse
                  cx={t.x + 3}
                  cy={36}
                  rx={5 * t.size}
                  ry={7 * t.size}
                  fill={getColor(t.health)}
                  opacity="0.85"
                />
              </motion.g>
            ))}
            {/* Ground line */}
            <rect x="0" y="47" width="100" height="3" rx="1" fill="hsl(150 40% 11%)" />
          </svg>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { value: "21", label: "Days Tracked" },
              { value: "18", label: "Healthy Trees" },
              { value: "₹4,200", label: "Total Saved" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.8 + i * 0.15 }}
              >
                <p className="text-2xl md:text-3xl font-heading text-foreground font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground font-body mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ForestGrowth;
