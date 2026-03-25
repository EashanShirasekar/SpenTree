import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const DailyTreeDemo = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [spending, setSpending] = useState(40);

  const getTreeState = () => {
    if (spending <= 20) return { label: "Seedling 🌱", color: "hsl(135 58% 50%)", scale: 0.4, health: "Thriving" };
    if (spending <= 50) return { label: "Sapling 🌿", color: "hsl(135 58% 40%)", scale: 0.6, health: "Growing" };
    if (spending <= 85) return { label: "Healthy 🌲", color: "hsl(135 58% 35%)", scale: 0.85, health: "Strong" };
    if (spending <= 100) return { label: "Stressed 🍂", color: "hsl(43 90% 50%)", scale: 0.75, health: "Weakening" };
    return { label: "Burnt 🔥", color: "hsl(25 85% 47%)", scale: 0.5, health: "Dying" };
  };

  const tree = getTreeState();

  return (
    <section className="py-24 md:py-32 px-4 relative" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="text-sm font-heading text-primary tracking-widest uppercase mb-4 block">
            Interactive Demo
          </span>
          <h2 className="text-3xl md:text-5xl font-display text-foreground mb-4">
            See Your Tree <span className="text-primary text-glow">React</span>
          </h2>
          <p className="text-muted-foreground font-body">Drag the slider to simulate your daily spending</p>
        </motion.div>

        <motion.div
          className="glass-card-glow p-8 md:p-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Tree visualization */}
          <div className="flex justify-center mb-8">
            <motion.div
              className="relative"
              animate={{ scale: tree.scale }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <svg viewBox="0 0 120 160" width={160} height={200}>
                {/* Trunk */}
                <rect x="52" y="90" width="16" height="50" rx="3" fill="hsl(30 30% 20%)" />
                {/* Canopy */}
                <motion.ellipse
                  cx="60" cy="65" rx="40" ry="50"
                  fill={tree.color}
                  animate={{ fill: tree.color }}
                  transition={{ duration: 0.5 }}
                />
                {/* Canopy highlight */}
                <ellipse cx="55" cy="55" rx="20" ry="25" fill="hsl(135 58% 45%)" opacity="0.3" />
                {/* Falling leaves when stressed */}
                {spending > 85 && Array.from({ length: 4 }).map((_, i) => (
                  <motion.circle
                    key={i}
                    cx={40 + i * 15}
                    cy={50}
                    r="3"
                    fill={spending > 100 ? "hsl(25 85% 47%)" : "hsl(43 90% 50%)"}
                    animate={{ cy: [50, 150], opacity: [1, 0], cx: [40 + i * 15, 35 + i * 18] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                  />
                ))}
                {/* Fire particles when burnt */}
                {spending > 100 && Array.from({ length: 6 }).map((_, i) => (
                  <motion.circle
                    key={`fire-${i}`}
                    cx={35 + i * 10}
                    cy={70}
                    r="2"
                    fill="hsl(15 90% 55%)"
                    animate={{ cy: [70, 30], opacity: [1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                  />
                ))}
              </svg>
            </motion.div>
          </div>

          {/* Info */}
          <div className="text-center mb-8">
            <p className="text-2xl font-heading text-foreground font-bold mb-1">{spending}% spent</p>
            <p className="text-sm font-body" style={{ color: tree.color }}>
              {tree.label} — {tree.health}
            </p>
          </div>

          {/* Slider */}
          <div className="max-w-md mx-auto">
            <input
              type="range"
              min={0}
              max={120}
              value={spending}
              onChange={(e) => setSpending(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, hsl(135 58% 35%) 0%, hsl(43 90% 61%) 70%, hsl(25 85% 47%) 100%)`,
              }}
            />
            <div className="flex justify-between text-xs text-muted-foreground font-body mt-2">
              <span>0%</span>
              <span>Budget</span>
              <span>120%+</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DailyTreeDemo;
