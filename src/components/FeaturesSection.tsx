import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const features = [
  {
    icon: "🌲",
    title: "Living Forest Ecosystem",
    desc: "Your spending decisions directly shape a living forest that grows or weakens over time.",
  },
  {
    icon: "🌱",
    title: "Daily Tree System",
    desc: "Each day becomes a tree — healthy when you save, damaged when you overspend.",
  },
  {
    icon: "📊",
    title: "Visual Spending Awareness",
    desc: "Understand your habits through immersive visuals instead of boring numbers.",
  },
  {
    icon: "🌿",
    title: "Behavior-Based Growth",
    desc: "Consistent discipline transforms into a stronger and richer ecosystem.",
  },
  {
    icon: "🧠",
    title: "Emotional Spending Insights",
    desc: "Discover patterns behind your spending behavior and improve decisions.",
  },
  {
    icon: "🏆",
    title: "Motivation & Progress",
    desc: "Track your growth with achievements, milestones, and visual rewards.",
  },
];

const FeaturesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" className="py-24 md:py-32 px-4 relative" ref={ref}>
      <div className="max-w-6xl mx-auto">
        
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="text-sm font-heading text-primary tracking-widest uppercase mb-4 block">
            Features
          </span>

          <h2 className="text-3xl md:text-5xl font-display text-foreground mb-4">
            Your Financial Life as a{" "}
            <span className="text-primary text-glow">Living Forest</span>
          </h2>

          <p className="text-muted-foreground font-body max-w-2xl mx-auto">
            Spentree transforms everyday spending into a visual and emotional journey —
            helping you build awareness, discipline, and long-term growth.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="glass-card-glow p-6 group cursor-default transition-all duration-300"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              whileHover={{ y: -8 }}
            >
              {/* Icon */}
              <motion.span
                className="text-3xl block mb-4"
                whileHover={{ scale: 1.2, rotate: 8 }}
              >
                {f.icon}
              </motion.span>

              {/* Title */}
              <h3 className="text-base font-heading text-foreground font-semibold mb-2">
                {f.title}
              </h3>

              {/* Desc */}
              <p className="text-sm text-muted-foreground font-body leading-relaxed">
                {f.desc}
              </p>

              {/* Glow line (NEW 🔥) */}
              <div className="mt-4 h-0.5 w-0 group-hover:w-full bg-primary transition-all duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;