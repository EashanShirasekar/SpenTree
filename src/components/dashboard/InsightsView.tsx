import { useMemo } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import { CATEGORIES } from '@/lib/store';
import type { AppUser } from '@/lib/database.types';
import { motion } from 'framer-motion';

export function InsightsView({ user }: { user: AppUser }) {
  const { expenses, loading } = useExpenses();

  const insights = useMemo(() => {
    const catTotals: Record<string, number> = {};
    const dailyTotals: Record<string, number> = {};

    expenses.forEach(e => {
      catTotals[e.category] = (catTotals[e.category] || 0) + Number(e.amount);
      dailyTotals[e.date] = (dailyTotals[e.date] || 0) + Number(e.amount);
    });

    const totalSpent = Object.values(catTotals).reduce((s, v) => s + v, 0);
    const sorted = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);

    const today = new Date().toISOString().split("T")[0];
    const todaySpent = dailyTotals[today] || 0;

    // 🧠 TOP CATEGORY
    const topCategory = sorted[0];

    // 📊 WEEK DATA
    const weekDays = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    const weekTotals: Record<string, number> = {};

    expenses.forEach(e => {
      const d = new Date(e.created_at).toLocaleDateString('en-US', { weekday: 'short' });
      weekTotals[d] = (weekTotals[d] || 0) + Number(e.amount);
    });

    const week = weekDays.map(d => ({
      day: d,
      value: weekTotals[d] || 0
    }));

    const maxWeek = Math.max(...week.map(w => w.value), 1);

    // 🎯 BUDGET STATUS
    let status = "Safe";
    if (todaySpent > user.dailyBudget * 0.7) status = "Warning";
    if (todaySpent > user.dailyBudget) status = "Over";

    // 📈 TREND (last 2 days)
    const days = Object.keys(dailyTotals).sort();
    const last = dailyTotals[days[days.length - 1]] || 0;
    const prev = dailyTotals[days[days.length - 2]] || 0;

    let trend = "Stable";
    if (last > prev) trend = "Increasing";
    if (last < prev) trend = "Decreasing";

    return {
      totalSpent,
      sorted,
      topCategory,
      todaySpent,
      week,
      maxWeek,
      status,
      trend
    };
  }, [expenses, user.dailyBudget]);

  const COLORS = ["#22c55e","#3b82f6","#f59e0b","#ef4444","#a855f7","#06b6d4"];
  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  const segments = insights.sorted.map(([cat, val], i) => {
    const percent = insights.totalSpent > 0 ? val / insights.totalSpent : 0;
    const dash = percent * circumference;

    const seg = {
      color: COLORS[i % COLORS.length],
      dash,
      offset,
      label: CATEGORIES.find(c => c.id === cat)?.label || cat,
      value: val
    };

    offset += dash;
    return seg;
  });

  if (loading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Loading insights...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">

      <h2 className="font-display text-xl">Insights</h2>

      {/* 🔥 TOP CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground">Today</p>
          <p className="text-lg font-bold">₹{insights.todaySpent}</p>
        </div>

        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground">Top Category</p>
          <p className="text-lg font-bold">
            {insights.topCategory ? insights.topCategory[0] : "-"}
          </p>
        </div>

        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground">Trend</p>
          <p className={`text-lg font-bold ${
            insights.trend === "Increasing" ? "text-red-400" :
            insights.trend === "Decreasing" ? "text-green-400" : ""
          }`}>
            {insights.trend}
          </p>
        </div>

        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground">Budget</p>
          <p className={`text-lg font-bold ${
            insights.status === "Safe" ? "text-green-400" :
            insights.status === "Warning" ? "text-yellow-400" : "text-red-500"
          }`}>
            {insights.status}
          </p>
        </div>
      </div>

      {/* 🍩 DONUT */}
      <div className="grid md:grid-cols-2 gap-6">

        <div className="glass-card p-6 flex flex-col items-center">
          <p className="text-xs mb-4 text-muted-foreground">Category Breakdown</p>

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
              />
            ))}
          </svg>
        </div>

        {/* 📊 WEEK */}
        <div className="glass-card p-6">
          <p className="text-xs mb-4 text-muted-foreground">Weekly Trend</p>

          <div className="flex items-end justify-between h-40">
            {insights.week.map((w, i) => {
              const height = (w.value / insights.maxWeek) * 100;

              return (
                <div key={i} className="flex flex-col items-center h-full justify-end">
                  <motion.div
                    className="w-6 bg-primary rounded"
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                  />
                  <span className="text-xs mt-2 text-muted-foreground">{w.day}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 🧠 SMART TIP */}
      <div className="glass-card p-6">
        <p className="text-sm text-muted-foreground">
          {insights.status === "Over"
            ? "You exceeded your budget. Try reducing non-essential spending."
            : insights.trend === "Increasing"
            ? "Your spending is rising. Monitor your habits."
            : "Great control! Keep maintaining your spending discipline."}
        </p>
      </div>

    </div>
  );
}