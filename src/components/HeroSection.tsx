import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{ background: "var(--gradient-night)" }} />

        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-foreground"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 50}%`,
            }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}

        <svg className="absolute bottom-0 w-full h-[50%] opacity-30" viewBox="0 0 1440 400">
          <path d="M0,400 L0,200 Q100,100 200,180 Q300,80 400,160 Q500,60 600,150 Q700,80 800,170 Q900,100 1000,160 Q1100,70 1200,150 Q1300,90 1440,130 L1440,400Z" fill="hsl(155 45% 20% / 0.5)" />
        </svg>

        <svg className="absolute bottom-0 w-full h-[40%] opacity-50" viewBox="0 0 1440 300">
          <path d="M0,300 L0,150 Q80,80 160,130 Q240,50 320,110 Q400,40 480,100 Q560,60 640,120 Q720,30 800,90 Q880,50 960,110 Q1040,40 1120,100 Q1200,60 1280,110 Q1360,70 1440,90 L1440,300Z" fill="hsl(150 40% 11% / 0.7)" />
        </svg>

        <svg className="absolute bottom-0 w-full h-[30%]" viewBox="0 0 1440 200">
          <path d="M0,200 L0,120 Q50,80 100,100 Q150,60 200,90 Q250,50 300,80 Q350,40 400,70 Q450,50 500,85 Q550,45 600,75 Q650,55 700,80 Q750,40 800,70 Q850,50 900,80 Q950,45 1000,75 Q1050,55 1100,80 Q1150,60 1200,85 Q1250,50 1300,75 Q1350,60 1440,70 L1440,200Z" fill="hsl(150 30% 4%)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display text-foreground leading-tight mb-6">
            Your Money. <span className="text-primary text-glow">Your Forest.</span>
            <br />
            Your Story.
          </h1>
        </motion.div>

        <motion.p
          className="text-base md:text-lg text-muted-foreground font-body max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          "Your financial habits are no longer numbers — they become a living ecosystem."
        </motion.p>

        {/* BUTTONS */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          {/* 🔥 MAIN BUTTON FIXED */}
          <motion.button
            onClick={() => navigate("/signup")}
            className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-heading font-semibold text-base"
            style={{ boxShadow: "var(--shadow-glow)" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Start Growing 🌱
          </motion.button>

          <motion.button
            className="px-8 py-4 rounded-full border border-border text-foreground font-heading font-semibold text-base hover:bg-muted/50"
          >
            Watch Demo 🎬
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;