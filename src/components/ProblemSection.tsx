import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const problems = [
  {
    icon: "📊",
    title: "Tracking Feels Boring",
    desc: "Traditional apps rely on numbers and charts that fail to keep you engaged daily.",
  },
  {
    icon: "😵",
    title: "No Real Motivation",
    desc: "There’s no emotional connection or reward system to help you stay consistent.",
  },
  {
    icon: "🔄",
    title: "Habits Break Easily",
    desc: "Without feedback or consequences, users quickly stop tracking expenses.",
  },
];

const ProblemSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 md:py-32 px-4 relative" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          <span className="text-sm text-primary uppercase mb-4 block">
            The Problem
          </span>

          <h2 className="text-3xl md:text-5xl font-display text-foreground mb-6">
            Why Managing Money Feels <span className="text-destructive">Hard</span>
          </h2>

          <p className="text-muted-foreground max-w-xl mx-auto">
            Managing expenses is boring, repetitive, and easy to ignore —
            which leads to poor financial habits over time.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((p, i) => (
            <motion.div
              key={i}
              className="glass-card p-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.2 }}
            >
              <span className="text-4xl mb-4 block">{p.icon}</span>
              <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;