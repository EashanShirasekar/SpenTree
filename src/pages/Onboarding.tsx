import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import type { TreeSpecies } from '@/lib/database.types';

const TREES = [
  { id: 'oak' as const, name: 'Oak', emoji: '🌳', desc: 'Strong and resilient' },
  { id: 'banyan' as const, name: 'Banyan', emoji: '🌲', desc: 'Ancient and wise' },
  { id: 'peepal' as const, name: 'Peepal', emoji: '🍃', desc: 'Sacred and mindful' },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [budget, setBudget] = useState('');
  const [forestName, setForestName] = useState('');
  const [species, setSpecies] = useState<TreeSpecies>('banyan');
  const [loading, setLoading] = useState(false);
  const { user, completeOnboarding } = useAuth();
  const navigate = useNavigate();

  const handleFinish = async () => {
    setLoading(true);
    try {
      await completeOnboarding(forestName, Number(budget), species);
      navigate('/dashboard');
    } catch (err) {
      console.error('Onboarding error:', err);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    // Step 0: Set budget
    <motion.div key="budget" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6 text-center">
      <div className="text-6xl mb-4">💰</div>
      <h2 className="text-2xl font-display text-foreground">Set Your Daily Budget</h2>
      <p className="pushkara-speech text-muted-foreground">"How much can you spend wisely each day, dear one?"</p>
      <div className="flex items-center gap-2 max-w-xs mx-auto">
        <span className="text-2xl text-accent">₹</span>
        <Input
          type="number"
          value={budget}
          onChange={e => setBudget(e.target.value)}
          placeholder="1000"
          className="bg-muted border-border text-2xl text-center h-14"
          min={1}
        />
      </div>
      <Button onClick={() => budget && setStep(1)} disabled={!budget} className="bg-primary text-primary-foreground px-8">
        Next →
      </Button>
    </motion.div>,

    // Step 1: Name forest
    <motion.div key="forest" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6 text-center">
      <div className="text-6xl mb-4">🌲</div>
      <h2 className="text-2xl font-display text-foreground">Name Your Forest</h2>
      <p className="pushkara-speech text-muted-foreground">"Every great forest needs a name. What shall yours be?"</p>
      <Input
        value={forestName}
        onChange={e => setForestName(e.target.value)}
        placeholder={`${user?.name ?? 'My'}'s Grove`}
        className="bg-muted border-border text-center max-w-xs mx-auto"
      />
      <Button onClick={() => setStep(2)} disabled={!forestName} className="bg-primary text-primary-foreground px-8">
        Next →
      </Button>
    </motion.div>,

    // Step 2: Choose tree
    <motion.div key="tree" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6 text-center">
      <h2 className="text-2xl font-display text-foreground">Choose Your First Tree</h2>
      <p className="pushkara-speech text-muted-foreground">"Pick the spirit that will begin your journey."</p>
      <div className="flex gap-4 justify-center">
        {TREES.map(t => (
          <button
            key={t.id}
            onClick={() => setSpecies(t.id)}
            className={`glass-card p-6 flex flex-col items-center gap-2 transition-all cursor-pointer ${
              species === t.id ? 'ring-2 ring-accent shadow-[var(--shadow-glow)]' : 'hover:ring-1 hover:ring-border'
            }`}
          >
            <span className="text-5xl">{t.emoji}</span>
            <span className="font-display text-foreground">{t.name}</span>
            <span className="text-xs text-muted-foreground">{t.desc}</span>
          </button>
        ))}
      </div>
      <Button
        onClick={handleFinish}
        disabled={loading}
        className="bg-primary text-primary-foreground px-8"
      >
        {loading ? 'Planting...' : '🌱 Plant Your Seed'}
      </Button>
    </motion.div>,
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-20" style={{ background: 'var(--gradient-night)' }} />

      {/* Progress dots */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {[0, 1, 2].map(i => (
          <div key={i} className={`w-3 h-3 rounded-full transition-colors ${i <= step ? 'bg-accent' : 'bg-muted'}`} />
        ))}
      </div>

      <div className="w-full max-w-lg z-10 px-4">
        <AnimatePresence mode="wait">{steps[step]}</AnimatePresence>
      </div>
    </div>
  );
}
