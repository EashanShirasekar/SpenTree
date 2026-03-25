import { useState } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import { useGameState } from '@/hooks/useGameState';
import { CATEGORIES } from '@/lib/store';
import type { AppUser } from '@/lib/database.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  user: AppUser;
  refreshKey: number;
  onExpenseLogged: () => void;
}

export function RightPanel({ user, refreshKey, onExpenseLogged }: Props) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [note, setNote] = useState('');
  const [logged, setLogged] = useState(false);
  const [saving, setSaving] = useState(false);

  const { getTodayTotal, createExpense } = useExpenses();
  const { addXP } = useGameState();

  const todaySpent = getTodayTotal();
  const remaining = Math.max(0, user.dailyBudget - todaySpent);
  const spentPercent = user.dailyBudget > 0 ? (todaySpent / user.dailyBudget) * 100 : 0;
  const ringColor = spentPercent > 100 ? 'hsl(var(--destructive))' : spentPercent > 85 ? 'hsl(var(--gold))' : 'hsl(var(--accent))';

  const handleLog = async () => {
    if (!amount || Number(amount) <= 0 || saving) return;
    setSaving(true);
    try {
      await createExpense({ amount: Number(amount), category, note });
      await addXP(5);
      setAmount('');
      setNote('');
      setLogged(true);
      setTimeout(() => setLogged(false), 1500);
      onExpenseLogged();
    } catch (err) {
      console.error('Failed to log expense:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <aside className="w-80 border-l border-border bg-card/50 flex flex-col overflow-y-auto shrink-0">
      {/* Budget ring */}
      <div className="p-6 text-center border-b border-border">
        <h3 className="text-xs font-heading text-accent tracking-widest mb-4 uppercase">Today's Budget</h3>
        <div className="relative w-36 h-36 mx-auto mb-3">
          <svg viewBox="0 0 120 120" className="w-full h-full">
            <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--border))" strokeWidth="5" opacity="0.3" />
            <circle
              cx="60" cy="60" r="52"
              fill="none"
              stroke={ringColor}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={`${Math.min(spentPercent, 100) * 3.27} 327`}
              transform="rotate(-90 60 60)"
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-foreground">₹{todaySpent}</span>
            <span className="text-xs text-muted-foreground">of ₹{user.dailyBudget}</span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${remaining > 0 ? 'bg-accent' : 'bg-destructive'}`} />
          <span className="text-sm text-muted-foreground">₹{remaining} remaining</span>
        </div>
      </div>

      {/* Today's savings */}
      <div className="p-4 border-b border-border">
        <h3 className="text-xs font-heading text-accent tracking-widest mb-2 uppercase flex items-center gap-1.5">
          <span>💰</span> Today's Savings
        </h3>
        <p className="text-xl font-bold text-accent">₹{remaining}</p>
      </div>

      {/* Quick log */}
      <div className="p-4 flex-1">
        <h3 className="text-xs font-heading text-foreground tracking-widest mb-3 uppercase">Quick Log</h3>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Amount (₹)</label>
            <Input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0"
              className="bg-muted border-border text-lg"
              min={1}
            />
          </div>

          {/* Category grid */}
          <div className="grid grid-cols-4 gap-1.5">
            {CATEGORIES.slice(0, 8).map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex flex-col items-center p-2 rounded-lg text-xs transition-all ${
                  category === cat.id
                    ? 'bg-primary text-primary-foreground ring-1 ring-accent'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <span className="text-lg">{cat.icon}</span>
                <span className="mt-0.5 truncate w-full text-center" style={{ fontSize: '0.65rem' }}>{cat.label}</span>
              </button>
            ))}
          </div>

          <Input
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Note (optional)"
            className="bg-muted border-border text-sm"
          />

          <Button
            onClick={handleLog}
            disabled={!amount || saving}
            className="w-full bg-primary text-primary-foreground"
          >
            {saving ? '⏳ Saving...' : logged ? '✅ Logged!' : '🌿 Log Expense'}
          </Button>

          <AnimatePresence>
            {logged && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="pushkara-speech text-xs text-center text-accent"
              >
                "The tree notices. Stay mindful. 🍃"
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </aside>
  );
}
