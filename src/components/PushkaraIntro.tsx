import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PushkaraAvatar from "./PushkaraAvatar";

const dialogueLines = [
  "Welcome, friend...",
  "Did you also worry about your future? About what tomorrow holds for you?",
  "I have watched forests rise and fall with every rupee spent wisely... and foolishly.",
  "I have seen dreams wither like leaves in drought... and I have seen them bloom into something magnificent.",
  "Don't worry. I am Pushkara. And together... we will grow something beautiful.",
];

const quotes = [
  { text: "Dream is not that which you see while sleeping, it is something that does not let you sleep.", author: "APJ Abdul Kalam" },
  { text: "A person should not be too honest. Straight trees are cut first and honest people are screwed first.", author: "Chanakya" },
  { text: "Do not save what is left after spending, but spend what is left after saving.", author: "Warren Buffett" },
  { text: "I don't believe in taking right decisions. I take decisions and then make them right.", author: "Ratan Tata" },
  { text: "Earth provides enough to satisfy every man's needs, but not every man's greed.", author: "Mahatma Gandhi" },
  { text: "Wealth is the ornament of the home, and character is the ornament of the person.", author: "Thiruvalluvar" },
];

interface Props {
  onComplete: () => void;
}

type Phase = "dark" | "seed" | "rise" | "dialogue" | "quotes" | "logo";

const PushkaraIntro = ({ onComplete }: Props) => {
  const [phase, setPhase] = useState<Phase>("dark");
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Phase transitions
  useEffect(() => {
    if (phase === "dark") {
      const t = setTimeout(() => setPhase("seed"), 2000);
      return () => clearTimeout(t);
    }
    if (phase === "seed") {
      const t = setTimeout(() => setPhase("rise"), 2000);
      return () => clearTimeout(t);
    }
    if (phase === "rise") {
      const t = setTimeout(() => setPhase("dialogue"), 1500);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // Typewriter effect for dialogue
  useEffect(() => {
    if (phase !== "dialogue") return;
    const line = dialogueLines[dialogueIndex];
    setIsTyping(true);
    setDisplayText("");
    let i = 0;
    const interval = setInterval(() => {
      if (i < line.length) {
        setDisplayText(line.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [phase, dialogueIndex]);

  // Auto-advance dialogue
  useEffect(() => {
    if (phase !== "dialogue" || isTyping) return;
    const t = setTimeout(() => {
      if (dialogueIndex < dialogueLines.length - 1) {
        setDialogueIndex((i) => i + 1);
      } else {
        setPhase("quotes");
      }
    }, 2000);
    return () => clearTimeout(t);
  }, [phase, isTyping, dialogueIndex]);

  // Quote cycling
  useEffect(() => {
    if (phase !== "quotes") return;
    if (quoteIndex >= 3) {
      const t = setTimeout(() => setPhase("logo"), 1000);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setQuoteIndex((i) => i + 1), 4000);
    return () => clearTimeout(t);
  }, [phase, quoteIndex]);

  const handleSkip = useCallback(() => onComplete(), [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-background overflow-hidden">
      {/* Skip button */}
      <motion.button
        className="absolute top-6 right-6 z-50 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-body"
        onClick={handleSkip}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        Skip →
      </motion.button>

      {/* Ambient particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="firefly"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${5 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* PHASE: Dark */}
        {phase === "dark" && (
          <motion.div
            key="dark"
            className="flex items-center justify-center h-full"
            exit={{ opacity: 0 }}
          />
        )}

        {/* PHASE: Seed falling */}
        {phase === "seed" && (
          <motion.div key="seed" className="flex items-center justify-center h-full" exit={{ opacity: 0 }}>
            <motion.div
              className="w-4 h-4 rounded-full bg-primary"
              style={{ boxShadow: "0 0 20px hsl(135 58% 35%), 0 0 40px hsl(170 100% 45% / 0.5)" }}
              initial={{ y: -200, opacity: 0 }}
              animate={{ y: 100, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeIn" }}
            />
          </motion.div>
        )}

        {/* PHASE: Pushkara rises */}
        {phase === "rise" && (
          <motion.div key="rise" className="flex items-center justify-center h-full" exit={{ opacity: 0, transition: { duration: 0.5 } }}>
            <motion.div
              initial={{ y: 100, opacity: 0, scale: 0.5 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <PushkaraAvatar size="xl" />
            </motion.div>
            {/* Soil particles */}
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-forest-canopy"
                initial={{ y: 200, x: (i - 6) * 20, opacity: 1 }}
                animate={{ y: -50 - Math.random() * 100, opacity: 0 }}
                transition={{ duration: 1, delay: 0.3 + i * 0.05, ease: "easeOut" }}
              />
            ))}
          </motion.div>
        )}

        {/* PHASE: Dialogue */}
        {phase === "dialogue" && (
          <motion.div
            key="dialogue"
            className="flex flex-col items-center justify-center h-full gap-8 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PushkaraAvatar size="lg" />
            <div className="max-w-lg text-center min-h-[80px]">
              <p className="pushkara-speech text-lg md:text-xl text-foreground leading-relaxed">
                "{displayText}
                {isTyping && <span className="inline-block w-0.5 h-5 bg-bio-glow ml-1 align-middle" style={{ animation: "typewriter-cursor 0.8s infinite" }} />}
                "
              </p>
            </div>
          </motion.div>
        )}

        {/* PHASE: Quotes */}
        {phase === "quotes" && (
          <motion.div
            key="quotes"
            className="flex flex-col items-center justify-center h-full px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={quoteIndex}
                className="glass-card-glow p-8 md:p-12 max-w-2xl text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
              >
                <p className="pushkara-speech text-lg md:text-xl text-foreground leading-relaxed mb-6">
                  "{quotes[quoteIndex]?.text}"
                </p>
                <p className="text-sm text-gold font-heading tracking-wider uppercase">
                  — {quotes[quoteIndex]?.author}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {/* PHASE: Logo reveal */}
        {phase === "logo" && (
          <motion.div
            key="logo"
            className="flex flex-col items-center justify-center h-full gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Logo animation: sapling growing into text */}
            <motion.div className="flex flex-col items-center gap-4">
              <motion.div
                className="w-1 bg-primary rounded-full"
                initial={{ height: 0 }}
                animate={{ height: 60 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <span className="text-3xl">🌱</span>
                <h1 className="text-5xl md:text-7xl font-display text-foreground tracking-wider">
                  Spen<span className="text-primary text-glow">tree</span>
                </h1>
              </motion.div>
            </motion.div>

            <motion.button
              className="mt-8 px-8 py-4 rounded-full bg-primary text-primary-foreground font-heading font-semibold text-lg tracking-wide animate-pulse-glow"
              style={{ boxShadow: "var(--shadow-glow)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              onClick={onComplete}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              Explore Spentree 🌱
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PushkaraIntro;
