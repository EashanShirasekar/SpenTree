import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, PaperPlaneRight } from '@phosphor-icons/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getLevelName } from '@/lib/store';
import type { AppUser } from '@/lib/database.types';

interface Props {
  open: boolean;
  onClose: () => void;
  user: AppUser;
  todayTotal?: number;
  streak?: number;
  level?: number;
}

interface Message {
  id: string;
  role: 'user' | 'pushkara';
  content: string;
}

function getPushkaraResponse(input: string, user: AppUser, ctx: { todayTotal: number; streak: number; level: number }): string {
  const lower = input.toLowerCase();
  const spent = ctx.todayTotal;
  const budget = user.dailyBudget;
  const pct = budget > 0 ? (spent / budget) * 100 : 0;
  const remaining = Math.max(0, budget - spent);
  const streak = ctx.streak;
  const level = ctx.level;

  // Context-aware responses
  if (lower.includes('how am i') || lower.includes('status') || lower.includes('doing')) {
    if (pct <= 50) return `You walk the path of discipline today, ${user.name}. Only ₹${spent} spent of ₹${budget}. The forest breathes easy. 🌿`;
    if (pct <= 85) return `You've spent ₹${spent} of ₹${budget}. The tree stands, but its leaves tremble. Be mindful with the remaining ₹${remaining}. 🍂`;
    if (pct <= 100) return `₹${spent} of ₹${budget} — the storm clouds gather, ${user.name}. ₹${remaining} is all that stands between your tree and the fire. Tread carefully. ⚡`;
    return `The tree burns tonight. ₹${spent} exceeds your ₹${budget} budget. But destruction births rebirth. Tomorrow, we rebuild. 🔥`;
  }

  if (lower.includes('budget') || lower.includes('left') || lower.includes('remaining')) {
    return `Your daily path allows ₹${budget}. You have walked ₹${spent} so far. ₹${remaining} remains in the light. Spend like rain — purposeful, not wasteful. 💧`;
  }

  if (lower.includes('streak')) {
    if (streak >= 7) return `${streak} suns of discipline! The crystal trees sing your name, ${user.name}. The forest elders nod with approval. 💎`;
    if (streak >= 3) return `${streak} days of wisdom. Fireflies have appeared in your grove. Keep walking this path. ✨`;
    return `Your streak is ${streak}. Every journey begins with a single step — or a single saved rupee. 🌱`;
  }

  if (lower.includes('level') || lower.includes('xp')) {
    return `You are Level ${level}: ${getLevelName(level)}. Every expense logged, every budget honored, brings you closer to the ancient guardians. Keep growing. 🌲`;
  }

  if (lower.includes('tip') || lower.includes('advice') || lower.includes('help')) {
    const tips = [
      `Track every rupee, no matter how small. Small drops fill rivers — and budgets. 🍃`,
      `The "lonely hour" is 9 PM to midnight. Most forests burn then. Be watchful. 🌙`,
      `Cook one more meal at home this week. Your tree will thank you with an extra leaf. 🍳`,
      `Before buying, ask: "Will this grow my forest or feed the fire?" The answer reveals much. 🔮`,
      `Set your budget ₹100 lower than you think. The constraint breeds creativity — and savings. 💡`,
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  }

  if (lower.includes('story') || lower.includes('fable') || lower.includes('tale')) {
    const stories = [
      `Once, a young squirrel saved one acorn every day. The other animals laughed. But when winter came, only the squirrel stood warm beside a mighty oak — grown from patience and one acorn at a time. 🐿️`,
      `There was a river that flowed too fast. It carved canyons but had no depth. The lake nearby barely moved — but it held entire ecosystems within its stillness. Be the lake, not the river. 🌊`,
      `A firefly once asked the moon, "How do you shine so bright?" The moon replied, "I don't. I simply reflect what the sun gives me and save it for the dark hours." 🌙`,
    ];
    return stories[Math.floor(Math.random() * stories.length)];
  }

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return `Greetings, ${user.name}. The leaves rustle with your presence. How may I guide you today? 🌿`;
  }

  if (lower.includes('thank')) {
    return `The forest bows to you, ${user.name}. I am but a spirit of bark and light — your discipline is the true magic. 🙏`;
  }

  // Default responses
  const defaults = [
    `Every rupee tells a story. Shall I read yours today, ${user.name}? Ask me about your budget, streak, or simply say "tell me a story." 🌿`,
    `The ancient trees whisper: awareness is the first step to wisdom. You're already here. That matters. 🍃`,
    `I sense curiosity in you, ${user.name}. Ask me "how am I doing?" or "give me a tip" — or simply share your thoughts. The forest listens. 🌲`,
  ];
  return defaults[Math.floor(Math.random() * defaults.length)];
}

export function PushkaraChatModal({ open, onClose, user, todayTotal = 0, streak = 0, level = 1 }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'pushkara', content: `Welcome to my grove, ${user.name}. I am Pushkara, spirit of the forest. Ask me anything — about your spending, your progress, or the wisdom of the trees. 🌿` },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const response = getPushkaraResponse(userMsg.content, user, { todayTotal, streak, level });
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'pushkara', content: response }]);
      setTyping(false);
    }, 800 + Math.random() * 1200);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-lg h-[70vh] flex flex-col glass-card-glow overflow-hidden mx-4"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-forest-canopy flex items-center justify-center text-xl animate-breathe">
                  🌳
                </div>
                <div>
                  <h3 className="font-display text-foreground text-sm">Pushkara</h3>
                  <p className="text-xs text-accent">Ancient Forest Spirit</p>
                </div>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                      : 'bg-muted text-foreground rounded-bl-sm pushkara-speech'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0s' }} />
                    <span className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0.15s' }} />
                    <span className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0.3s' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border flex gap-2">
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Ask Pushkara anything..."
                className="bg-muted border-border"
              />
              <Button onClick={send} size="icon" className="bg-primary text-primary-foreground shrink-0">
                <PaperPlaneRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
