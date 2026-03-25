import { useState } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import { useGameState } from '@/hooks/useGameState';
import { CATEGORIES } from '@/lib/store';
import { TrashSimple } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

export function ExpensesView() {
  const { expenses, removeExpense, loading } = useExpenses();
  const { xp, level } = useGameState();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await removeExpense(id);
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const getCategoryInfo = (catId: string) =>
    CATEGORIES.find(c => c.id === catId) || { icon: '🌀', label: catId };

  // 🔥 TOTALS
  const categoryTotals: Record<string, number> = {};
  expenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.amount);
  });

  const totalAmount = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const categories = Object.keys(categoryTotals);

  const today = new Date().toISOString().split('T')[0];
  const todayAmount = expenses
    .filter(e => e.date === today)
    .reduce((s, e) => s + Number(e.amount), 0);

  // 🌱 MOOD
  let mood = "happy";
  if (todayAmount > 500) mood = "sad";
  if (todayAmount > 800) mood = "cry";

  // 🎨 COLORS
  const COLORS = ["#22c55e","#3b82f6","#f59e0b","#ef4444","#a855f7","#06b6d4"];

  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  const segments = categories.map((cat, i) => {
    const value = categoryTotals[cat];
    const percent = totalAmount > 0 ? value / totalAmount : 0;

    const dash = percent * circumference;

    const seg = {
      color: COLORS[i % COLORS.length],
      dash,
      offset,
      label: getCategoryInfo(cat).label,
      value
    };

    offset += dash;
    return seg;
  });

  // 🌿 REAL PLANT COMPONENT
  const PlantAvatar = () => (
    <motion.div
      className="fixed top-24 right-6 z-50"
      animate={
        mood === "happy"
          ? { y: [0, -6, 0] }
          : mood === "sad"
          ? { rotate: [0, -3, 3, 0] }
          : { x: [0, -4, 4, -4, 4, 0] }
      }
      transition={{ repeat: Infinity, duration: 2 }}
    >
      <svg width="110" height="130" viewBox="0 0 200 220">

        {/* POT */}
        <rect x="50" y="120" width="100" height="70" rx="12" fill="#E07A3F" />
        <rect x="50" y="110" width="100" height="20" rx="10" fill="#D46A35" />

        {/* SOIL */}
        <ellipse cx="100" cy="115" rx="45" ry="10" fill="#6B3E2E" />

        {/* LEAVES */}
        <ellipse cx="100" cy="70" rx="25" ry="40" fill="#4CAF50" />
        <ellipse cx="60" cy="80" rx="20" ry="35" fill="#66BB6A" />
        <ellipse cx="140" cy="80" rx="20" ry="35" fill="#66BB6A" />

        {/* EYES */}
        <circle cx="80" cy="140" r="8" fill="#2E2E2E" />
        <circle cx="120" cy="140" r="8" fill="#2E2E2E" />

        {/* FACE */}
        {mood === "happy" && (
          <path d="M80 155 Q100 170 120 155" stroke="#2E2E2E" strokeWidth="3" fill="none"/>
        )}

        {mood === "sad" && (
          <path d="M80 165 Q100 150 120 165" stroke="#2E2E2E" strokeWidth="3" fill="none"/>
        )}

        {mood === "cry" && (
          <>
            <path d="M80 165 Q100 150 120 165" stroke="#2E2E2E" strokeWidth="3" fill="none"/>

            {/* TEARS */}
            <motion.circle
              cx="75"
              cy="150"
              r="3"
              fill="#4FC3F7"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
            />
            <motion.circle
              cx="125"
              cy="150"
              r="3"
              fill="#4FC3F7"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1, delay: 0.3 }}
            />
          </>
        )}
      </svg>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Loading expenses...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-5 text-sm relative">

      {/* 🌿 PLANT TOP RIGHT */}
      <PlantAvatar />

      {/* HEADER */}
      <h2 className="font-display text-xl">Expense Dashboard</h2>

      {/* CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass-card p-3">
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="text-lg font-bold">₹{totalAmount}</p>
        </div>

        <div className="glass-card p-3">
          <p className="text-xs text-muted-foreground">Today</p>
          <p className="text-lg font-bold text-primary">₹{todayAmount}</p>
        </div>

        <div className="glass-card p-3">
          <p className="text-xs text-muted-foreground">Level</p>
          <p className="text-lg font-bold text-green-400">Lv.{level}</p>
        </div>

        <div className="glass-card p-3">
          <p className="text-xs text-muted-foreground">XP</p>
          <p className="text-lg font-bold">{xp}</p>
        </div>
      </div>

      {/* DONUT CHART */}
      <div className="glass-card p-4 flex flex-col items-center">

        <svg width="140" height="140" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} stroke="hsl(0 0% 20%)" strokeWidth="12" fill="none" />

          {segments.map((seg, i) => (
            <motion.circle
              key={i}
              cx="60"
              cy="60"
              r={radius}
              stroke={seg.color}
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${seg.dash} ${circumference}`}
              strokeDashoffset={-seg.offset}
              strokeLinecap="round"
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray: `${seg.dash} ${circumference}` }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
            />
          ))}
        </svg>

        <div className="mt-3 w-full text-xs space-y-1">
          {segments.map((seg, i) => (
            <div key={i} className="flex justify-between">
              <span>{seg.label}</span>
              <span className="text-primary">₹{seg.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="glass-card p-3">
        <div className="max-h-[300px] overflow-y-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2">Category</th>
                <th>Amount</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {expenses.map(e => {
                const cat = getCategoryInfo(e.category);

                return (
                  <tr key={e.id} className="border-b border-border">
                    <td className="py-2 flex items-center gap-2">
                      <span>{cat.icon}</span>
                      {cat.label}
                    </td>

                    <td className="text-center">₹{e.amount}</td>
                    <td className="text-center text-muted-foreground">{e.date}</td>

                    <td className="text-right">
                      <button
                        onClick={() => handleDelete(e.id)}
                        disabled={deletingId === e.id}
                      >
                        <TrashSimple className={`w-4 h-4 hover:text-red-500 ${deletingId === e.id ? 'opacity-50' : ''}`} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}