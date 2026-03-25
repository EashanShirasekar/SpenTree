import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getXPForLevel } from '@/lib/store';
import { useGameState } from '@/hooks/useGameState';
import type { DashboardView } from '@/pages/Dashboard';

import {
  TreeEvergreen,
  Receipt,
  PiggyBank,
  ChartBar,
  Medal,
  GearSix,
  SignOut,
  ChatCircleDots,
  CalendarDots,
  UserCircle
} from '@phosphor-icons/react';

const NAV_ITEMS: { id: DashboardView; label: string; icon: React.ElementType }[] = [
  { id: 'forest', label: 'Forest', icon: TreeEvergreen },
  { id: 'expenses', label: 'Expenses', icon: Receipt },
  { id: 'savings', label: 'Savings', icon: PiggyBank },
  { id: 'insights', label: 'Insights', icon: ChartBar },
  { id: 'calendar', label: 'Calendar', icon: CalendarDots },
  { id: 'profile', label: 'Profile', icon: UserCircle },
  { id: 'badges', label: 'Badges', icon: Medal },
];

interface Props {
  activeView: DashboardView;
  setActiveView: (v: DashboardView) => void;
  onChatOpen: () => void;
}

export function DashboardSidebar({ activeView, setActiveView, onChatOpen }: Props) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { level, xp } = useGameState();

  const xpNeeded = getXPForLevel(level);
  const xpPercent = Math.min((xp / xpNeeded) * 100, 100);

  return (
    <aside className="w-60 h-screen flex flex-col bg-card border-r border-border">

      {/* 🔥 PROFILE */}
      <div className="p-3 border-b border-border">

        <div
          onClick={() => setActiveView('profile')}
          className="flex items-center gap-2 cursor-pointer hover:bg-muted p-2 rounded-md transition"
        >
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm">
            🌳
          </div>

          <div className="flex-1">
            <p className="text-xs font-semibold truncate">
              {user?.name || "Player"}
            </p>
            <p className="text-[10px] text-muted-foreground">
              Lv {level}
            </p>
          </div>
        </div>

        {/* XP BAR */}
        <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-accent"
            style={{ width: `${xpPercent}%` }}
          />
        </div>
      </div>

      {/* 📂 NAV */}
      <nav className="flex-1 px-2 py-2 space-y-1">

        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const active = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-2 px-2 py-2 rounded-md text-xs transition ${
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}

      </nav>

      {/* 🤖 AI */}
      <div className="px-2 py-2">
        <button
          onClick={onChatOpen}
          className="w-full flex items-center justify-center gap-1 px-2 py-2 text-xs rounded-md bg-primary/10 hover:bg-primary/20"
        >
          <ChatCircleDots className="w-4 h-4" />
          AI
        </button>
      </div>

      {/* ⚙️ BOTTOM */}
      <div className="px-2 pb-3 space-y-1 border-t border-border pt-2">

        <button
          onClick={() => setActiveView('settings')}
          className="w-full flex items-center gap-2 px-2 py-2 rounded-md text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <GearSix className="w-4 h-4" />
          Settings
        </button>

        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="w-full flex items-center gap-2 px-2 py-2 rounded-md text-xs text-muted-foreground hover:text-destructive hover:bg-muted"
        >
          <SignOut className="w-4 h-4" />
          Logout
        </button>

      </div>

    </aside>
  );
}