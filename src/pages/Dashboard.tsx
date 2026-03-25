import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useExpenses } from '@/hooks/useExpenses';

import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { ForestCanvas } from '@/components/dashboard/ForestCanvas';
import { RightPanel } from '@/components/dashboard/RightPanel';
import { PushkaraChatModal } from '@/components/dashboard/PushkaraChatModal';

import { ExpensesView } from '@/components/dashboard/ExpensesView';
import { SavingsView } from '@/components/dashboard/SavingsView';
import { InsightsView } from '@/components/dashboard/InsightsView';
import { BadgesView } from '@/components/dashboard/BadgesView';
import { SettingsView } from '@/components/dashboard/SettingsView';
import { ProfileView } from '@/components/dashboard/ProfileView';

import DailyCalendarTracker from "@/components/dashboard/DailyCalendarTracker";


// ✅ TYPE
export type DashboardView =
  | 'forest'
  | 'expenses'
  | 'savings'
  | 'insights'
  | 'calendar'
  | 'profile'
  | 'badges'
  | 'settings';

export default function Dashboard() {
  const { user, isOnboarded, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { getTodayTotal, refreshExpenses } = useExpenses();

  const [activeView, setActiveView] = useState<DashboardView>('forest');
  const [chatOpen, setChatOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // 🔐 AUTH CHECK
  useEffect(() => {
    if (authLoading) return;
    if (!user) navigate('/login');
    else if (!isOnboarded) navigate('/onboarding');
  }, [user, isOnboarded, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground animate-pulse">Loading your forest...</p>
      </div>
    );
  }

  if (!user || !isOnboarded) return null;

  const onExpenseLogged = () => {
    setRefreshKey(prev => prev + 1);
    refreshExpenses();
  };

  const todaySpent = getTodayTotal();

  // 🔥 VIEW SWITCH
  const renderView = () => {
    switch (activeView) {

      case 'forest':
        return (
          <div className="flex flex-1 h-full overflow-hidden">
            <div className="flex-1 h-full">
              <ForestCanvas key={refreshKey} user={user} />
            </div>
            <RightPanel
              user={user}
              refreshKey={refreshKey}
              onExpenseLogged={onExpenseLogged}
            />
          </div>
        );

      case 'expenses':
        return (
          <div className="flex-1 h-full overflow-auto">
            <ExpensesView />
          </div>
        );

      case 'savings':
        return (
          <div className="flex-1 h-full overflow-auto">
            <SavingsView user={user} />
          </div>
        );

      case 'insights':
        return (
          <div className="flex-1 h-full overflow-auto">
            <InsightsView user={user} />
          </div>
        );

      case 'calendar':
        return (
          <div className="flex-1 h-full overflow-auto">
            <DailyCalendarTracker />
          </div>
        );

      // ✅ FIXED (YOU WERE MISSING THIS)
      case 'profile':
        return (
          <div className="flex-1 h-full overflow-auto">
            <ProfileView user={user} />
          </div>
        );

      case 'badges':
        return (
          <div className="flex-1 h-full overflow-auto">
            <BadgesView />
          </div>
        );

      case 'settings':
        return (
          <div className="flex-1 h-full overflow-auto">
            <SettingsView />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex bg-background overflow-hidden">

      {/* SIDEBAR */}
      <DashboardSidebar
        activeView={activeView}
        setActiveView={setActiveView}
        onChatOpen={() => setChatOpen(true)}
      />

      {/* MAIN */}
      <main className="flex-1 flex flex-col h-full">

        {/* TOP BAR */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card/50 shrink-0">

          <h2 className="font-display text-lg text-foreground uppercase tracking-wider">
            {user.forestName}
          </h2>

          {/* TODAY SPENDING */}
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-accent" />

            <span className="text-muted-foreground">
              ₹{todaySpent} / ₹{user.dailyBudget}
            </span>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-hidden">
          {renderView()}
        </div>

      </main>

      {/* 🤖 CHAT */}
      <PushkaraChatModal
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        user={user}
        todayTotal={todaySpent}
      />

    </div>
  );
}