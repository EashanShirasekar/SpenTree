import { useState } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import { motion, AnimatePresence } from 'framer-motion';

interface ExpenseDisplay {
  amount: number;
  category: string;
  date: string;
  time?: string;
}

const HOUR_LABELS = [
  "12:00","1:00","2:00","3:00","4:00","5:00","6:00","7:00",
  "8:00","9:00","10:00","11:00","12:00","1:00","2:00","3:00",
  "4:00","5:00","6:00","7:00","8:00","9:00","10:00","11:00",
];

export default function DailyCalendarTracker() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [selectedHour, setSelectedHour] = useState<number | null>(null);

  const { expenses, loading } = useExpenses();

  // Convert Supabase expenses to display format with time
  const displayExpenses: ExpenseDisplay[] = expenses.map(e => ({
    amount: Number(e.amount),
    category: e.category,
    date: e.date,
    time: e.created_at ? new Date(e.created_at).toTimeString().slice(0, 5) : '00:00',
  }));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthStr = `${year}-${String(month + 1).padStart(2, "0")}`;

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getDayExpenses = (day: number) =>
    displayExpenses.filter(e =>
      e.date.startsWith(`${monthStr}-${String(day).padStart(2, "0")}`)
    );

  const getHourExpenses = (hour: number) =>
    getDayExpenses(selectedDay).filter(e => {
      const hr = parseInt((e.time || "00:00").split(":")[0]);
      return hr === hour;
    });

  const changeMonth = (dir: number) => {
    const newDate = new Date(year, month + dir, 1);
    setCurrentDate(newDate);
    setSelectedDay(1);
  };

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Loading tracker...</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col overflow-hidden text-foreground text-sm">

      {/* HEADER */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-border">
        <h2 className="text-lg font-display">Tracker 📅</h2>

        <div className="flex items-center gap-1 text-xs">
          <button onClick={() => changeMonth(-1)} className="px-2 py-1 bg-muted rounded">←</button>
          <span>
            {currentDate.toLocaleString("default", { month: "short" })} {year}
          </span>
          <button onClick={() => changeMonth(1)} className="px-2 py-1 bg-muted rounded">→</button>
        </div>
      </div>

      {/* DAYS */}
      <div className="px-4 py-2 border-b border-border overflow-x-auto scrollbar-thin">
        <div className="flex gap-1">
          {days.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-2 py-1 rounded text-xs ${
                selectedDay === day
                  ? "bg-primary text-black"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 overflow-y-auto px-4 py-2 scrollbar-green">

        {/* SMALL GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {hours.map(hour => {
            const data = getHourExpenses(hour);
            const total = data.reduce((s, e) => s + e.amount, 0);

            return (
              <motion.div
                key={hour}
                onClick={() => setSelectedHour(hour)}
                className="p-2 rounded-lg bg-card border border-border cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between text-[11px] mb-1">
                  <span>{HOUR_LABELS[hour]}</span>
                  <span className="text-primary">₹{total}</span>
                </div>

                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${Math.min(total / 5, 100)}%` }}
                  />
                </div>

                <div className="text-[10px] mt-1 text-muted-foreground">
                  {data.length}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* POPUP */}
      <AnimatePresence>
        {selectedHour !== null && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            onClick={() => setSelectedHour(null)}
          >
            <motion.div
              onClick={e => e.stopPropagation()}
              className="bg-card p-4 rounded-lg w-[300px] max-h-[350px] overflow-auto"
            >
              <h3 className="mb-2 text-sm">
                {HOUR_LABELS[selectedHour]}
              </h3>

              {getHourExpenses(selectedHour).length === 0 ? (
                <p className="text-xs">No data</p>
              ) : (
                getHourExpenses(selectedHour).map((e, i) => (
                  <div key={i} className="border-b py-1 text-xs flex justify-between">
                    <span>{e.category}</span>
                    <span>₹{e.amount}</span>
                  </div>
                ))
              )}

              <button
                onClick={() => setSelectedHour(null)}
                className="mt-3 px-3 py-1 bg-primary text-black rounded w-full text-xs"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}