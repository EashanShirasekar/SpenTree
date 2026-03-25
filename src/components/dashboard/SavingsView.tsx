import { useState, useMemo } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import { useGoals } from '@/hooks/useGoals';
import { useGameState } from '@/hooks/useGameState';
import type { AppUser } from '@/lib/database.types';
import { motion } from 'framer-motion';

export function SavingsView({ user }: { user: AppUser }) {
  const { expenses } = useExpenses();
  const { goals, createGoal, loading: goalsLoading } = useGoals();
  const { lockerAmount, updateState } = useGameState();

  const [manualSave, setManualSave] = useState("");

  // 📊 AUTO SAVE (LEFTOVER)
  const autoSaved = useMemo(() => {
    const dayMap: Record<string, number> = {};
    expenses.forEach(e => {
      dayMap[e.date] = (dayMap[e.date] || 0) + Number(e.amount);
    });

    let total = 0;
    Object.values(dayMap).forEach(spent => {
      total += Math.max(0, user.dailyBudget - spent);
    });

    return total;
  }, [expenses, user.dailyBudget]);

  // Sync auto-saved to Supabase locker
  const currentLocker = Math.max(autoSaved, lockerAmount);

  // ➕ MANUAL SAVE
  const handleManualSave = async () => {
    if (!manualSave) return;
    const amount = Number(manualSave);
    try {
      await updateState({ locker_amount: currentLocker + amount });
      setManualSave("");
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  // ➕ ADD GOAL
  const addGoalHandler = async () => {
    const name = prompt("Goal name?");
    const target = Number(prompt("Target amount?"));

    if (!name || !target) return;

    try {
      await createGoal(name, target);
    } catch (err) {
      console.error('Add goal failed:', err);
    }
  };

  // Distribute locker to goals
  const goalsWithSavings = goals.map(g => ({
    ...g,
    computedSaved: goals.length > 0 ? currentLocker / goals.length : 0,
  }));

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-8">

      {/* 🔐 LOCKER */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-br from-black to-green-900 border border-border">

        <p className="text-xs text-muted-foreground mb-2">Savings Locker</p>

        <h2 className="text-3xl font-bold text-green-400">₹{currentLocker}</h2>

        {/* PROGRESS BAR */}
        <div className="mt-4 h-2 bg-black/40 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-green-500"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(currentLocker / 10000 * 100, 100)}%` }}
          />
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          Auto saved from your daily budget 💡
        </p>
      </div>

      {/* 💰 MANUAL SAVE */}
      <div className="flex gap-3">
        <input
          placeholder="Add savings ₹"
          value={manualSave}
          onChange={e => setManualSave(e.target.value)}
          className="flex-1 px-3 py-2 bg-muted rounded-lg"
        />
        <button
          onClick={handleManualSave}
          className="px-4 bg-primary text-white rounded-lg"
        >
          Save
        </button>
      </div>

      {/* 🎯 GOALS */}
      {goalsLoading ? (
        <p className="text-muted-foreground text-sm animate-pulse">Loading goals...</p>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2">

          {goalsWithSavings.map(goal => {
            const percent = Math.min((goal.computedSaved / Number(goal.target_amount)) * 100, 100);

            return (
              <div
                key={goal.id}
                className="min-w-[220px] p-4 rounded-xl bg-gradient-to-br from-green-800/30 to-black border border-border"
              >
                <p className="text-sm font-semibold text-white">{goal.name}</p>

                <p className="text-xs text-muted-foreground mt-1">
                  ₹{goal.computedSaved.toFixed(0)} / ₹{goal.target_amount}
                </p>

                <div className="mt-3 h-2 bg-black/40 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-green-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                  />
                </div>

                <p className="text-xs mt-2 text-green-400">
                  {percent.toFixed(0)}%
                </p>

                {percent === 100 && (
                  <p className="text-xs text-green-300 mt-1">Completed 🎉</p>
                )}
              </div>
            );
          })}

        </div>
      )}

      {/* ➕ ADD GOAL BUTTON */}
      <button
        onClick={addGoalHandler}
        className="w-full py-3 rounded-xl bg-primary text-white"
      >
        + Add Goal
      </button>

      {/* 🌿 QUOTE */}
      <div className="glass-card p-6 text-center">
        <p className="text-muted-foreground text-sm">
          "Your savings are protected. Your future is secured." 🔐
        </p>
      </div>

    </div>
  );
}
