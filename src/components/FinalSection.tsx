import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const FinalSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const navigate = useNavigate();

  return (
    <section className="py-24 md:py-40 px-4 relative overflow-hidden" ref={ref}>
      
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute bottom-0 w-full h-[60%] opacity-20" viewBox="0 0 1440 400">
          <path d="M0,400 L0,100 Q100,30 200,80 Q300,10 400,70 Q500,20 600,60 Q700,30 800,80 Q900,10 1000,60 Q1100,30 1200,70 Q1300,20 1440,50 L1440,400Z" fill="hsl(135 58% 35%)" />
        </svg>

        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="firefly"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${30 + Math.random() * 60}%`,
              animationDelay: `${Math.random() * 6}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-5xl font-display text-foreground mb-6 leading-tight">
            It's Not About <span className="text-destructive">Restricting</span>.
            <br />
            It's About <span className="text-primary text-glow">Growing</span>.
          </h2>

          <p className="text-muted-foreground font-body max-w-xl mx-auto mb-10 leading-relaxed">
            Spentree isn't a spending cage — it's a garden. Build awareness, nurture habits,
            and watch your financial future bloom into something magnificent.
          </p>

          {/* 🔥 BUTTON FIXED */}
          <motion.button
            onClick={() => navigate("/signup")}
            className="px-10 py-5 rounded-full bg-primary text-primary-foreground font-heading font-bold text-lg tracking-wide"
            style={{ boxShadow: "0 0 60px hsl(170 100% 45% / 0.3)" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Start Your Forest 🌲
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalSection;