import { useMemo } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import { useGameState } from '@/hooks/useGameState';

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earned: boolean;
}

const RARITY_COLORS = {
  common: 'border-muted-foreground/40',
  rare: 'border-ash',
  epic: 'border-night-purple ring-1 ring-night-purple/30',
  legendary: 'border-gold ring-1 ring-gold/30 shadow-[var(--shadow-gold)]',
};

export function BadgesView() {
  const { expenses } = useExpenses();
  const { streak, level, badges: earnedBadges } = useGameState();

  const earnedBadgeIds = new Set(earnedBadges.map(b => b.badge_id));

  const badges = useMemo<Badge[]>(() => {
    const totalExpenses = expenses.length;

    return [
      { id: 'first-seed', name: 'First Seed', icon: '🌱', description: 'Logged your first expense', rarity: 'common', earned: totalExpenses >= 1 || earnedBadgeIds.has('first-seed') },
      { id: 'sprout', name: 'Tiny Sprout', icon: '🌿', description: 'Logged 10 expenses', rarity: 'common', earned: totalExpenses >= 10 || earnedBadgeIds.has('sprout') },
      { id: 'grove', name: 'Growing Grove', icon: '🌲', description: 'Logged 50 expenses', rarity: 'rare', earned: totalExpenses >= 50 || earnedBadgeIds.has('grove') },
      { id: 'crystal', name: 'Crystal Guardian', icon: '💎', description: '7-day streak', rarity: 'epic', earned: streak >= 7 || earnedBadgeIds.has('crystal') },
      { id: 'fire-survivor', name: 'Survived the Storm', icon: '🔥', description: 'Overspent but recovered', rarity: 'rare', earned: earnedBadgeIds.has('fire-survivor') },
      { id: 'midnight', name: 'Midnight Monk', icon: '🌙', description: 'Logged all expenses before midnight for 7 days', rarity: 'epic', earned: earnedBadgeIds.has('midnight') },
      { id: 'blossom', name: 'The Blossom', icon: '🌸', description: 'First cherry blossom tree grown', rarity: 'epic', earned: earnedBadgeIds.has('blossom') },
      { id: 'pushkara', name: "Pushkara's Favorite", icon: '👑', description: 'Under 70% budget for 30 days', rarity: 'legendary', earned: earnedBadgeIds.has('pushkara') },
      { id: 'deer', name: 'The Deer Appeared', icon: '🦌', description: 'Zero impulse purchases in a day', rarity: 'rare', earned: earnedBadgeIds.has('deer') },
      { id: 'elder', name: 'Forest Elder', icon: '🌳', description: 'Reach Level 5', rarity: 'legendary', earned: level >= 5 || earnedBadgeIds.has('elder') },
    ];
  }, [expenses.length, streak, level, earnedBadgeIds]);

  const earned = badges.filter(b => b.earned);
  const locked = badges.filter(b => !b.earned);

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <h2 className="font-display text-xl text-foreground mb-6">Achievement Badges</h2>

      {earned.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xs font-heading text-accent tracking-widest uppercase mb-4">Earned ({earned.length})</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {earned.map(b => (
              <div key={b.id} className={`glass-card-glow p-4 text-center border-2 ${RARITY_COLORS[b.rarity]}`}>
                <span className="text-4xl block mb-2">{b.icon}</span>
                <p className="text-sm font-display text-foreground">{b.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-xs font-heading text-muted-foreground tracking-widest uppercase mb-4">Locked ({locked.length})</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {locked.map(b => (
            <div key={b.id} className="glass-card p-4 text-center opacity-40">
              <span className="text-4xl block mb-2 grayscale">{b.icon}</span>
              <p className="text-sm font-display text-foreground">{b.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
