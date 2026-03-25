import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExpenses } from '@/hooks/useExpenses';
import { useGameState } from '@/hooks/useGameState';
import type { AppUser } from '@/lib/database.types';

// ─── AVATAR SYSTEM ────────────────────────────────────────────────────────────
const AVATARS = [
  { id: 'man1',   label: 'Forest Elder',   gender: 'man',   svg: (col: string) => (
    <svg viewBox="0 0 80 80" width="100%" height="100%">
      <circle cx="40" cy="28" r="18" fill={col} opacity="0.9"/>
      <ellipse cx="40" cy="22" rx="14" ry="10" fill="#3d2b1f"/>
      <circle cx="34" cy="26" r="2.5" fill="#1a0f0a"/>
      <circle cx="46" cy="26" r="2.5" fill="#1a0f0a"/>
      <path d="M35 34 Q40 38 45 34" stroke="#1a0f0a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <rect x="24" y="46" width="32" height="28" rx="8" fill={col} opacity="0.7"/>
      <path d="M22 50 Q12 56 14 68" stroke={col} strokeWidth="10" strokeLinecap="round" fill="none" opacity="0.7"/>
      <path d="M58 50 Q68 56 66 68" stroke={col} strokeWidth="10" strokeLinecap="round" fill="none" opacity="0.7"/>
      <rect x="28" y="74" width="10" height="10" rx="3" fill={col} opacity="0.6"/>
      <rect x="42" y="74" width="10" height="10" rx="3" fill={col} opacity="0.6"/>
    </svg>
  )},
  { id: 'woman1', label: 'Grove Keeper',   gender: 'woman', svg: (col: string) => (
    <svg viewBox="0 0 80 80" width="100%" height="100%">
      <circle cx="40" cy="27" r="17" fill={col} opacity="0.9"/>
      <path d="M23 20 Q28 10 40 10 Q52 10 57 20 Q54 14 40 14 Q26 14 23 20Z" fill="#3d2b1f"/>
      <path d="M22 22 Q20 30 24 32" stroke="#3d2b1f" strokeWidth="3" fill="none"/>
      <path d="M58 22 Q60 30 56 32" stroke="#3d2b1f" strokeWidth="3" fill="none"/>
      <circle cx="34" cy="26" r="2.2" fill="#1a0f0a"/>
      <circle cx="46" cy="26" r="2.2" fill="#1a0f0a"/>
      <path d="M35 34 Q40 39 45 34" stroke="#1a0f0a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M26 44 Q24 58 24 74 L56 74 Q56 58 54 44 Q46 48 40 48 Q34 48 26 44Z" fill={col} opacity="0.7"/>
      <path d="M22 50 Q12 55 13 68" stroke={col} strokeWidth="9" strokeLinecap="round" fill="none" opacity="0.7"/>
      <path d="M58 50 Q68 55 67 68" stroke={col} strokeWidth="9" strokeLinecap="round" fill="none" opacity="0.7"/>
    </svg>
  )},
  { id: 'boy1',   label: 'Sprout Kid',     gender: 'boy',   svg: (col: string) => (
    <svg viewBox="0 0 80 80" width="100%" height="100%">
      <circle cx="40" cy="29" r="16" fill={col} opacity="0.9"/>
      <path d="M28 22 Q32 12 40 12 Q46 14 48 20 Q44 16 40 16 Q32 16 28 22Z" fill="#3d2b1f"/>
      <circle cx="34" cy="28" r="2.2" fill="#1a0f0a"/>
      <circle cx="46" cy="28" r="2.2" fill="#1a0f0a"/>
      <circle cx="34.8" cy="27.2" r="0.7" fill="white"/>
      <circle cx="46.8" cy="27.2" r="0.7" fill="white"/>
      <path d="M36 35 Q40 38 44 35" stroke="#1a0f0a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <rect x="26" y="45" width="28" height="26" rx="6" fill={col} opacity="0.75"/>
      <path d="M22 50 Q14 54 15 65" stroke={col} strokeWidth="9" strokeLinecap="round" fill="none" opacity="0.7"/>
      <path d="M58 50 Q66 54 65 65" stroke={col} strokeWidth="9" strokeLinecap="round" fill="none" opacity="0.7"/>
      <rect x="27" y="71" width="9" height="9" rx="3" fill={col} opacity="0.6"/>
      <rect x="44" y="71" width="9" height="9" rx="3" fill={col} opacity="0.6"/>
    </svg>
  )},
  { id: 'girl1',  label: 'Blossom Girl',   gender: 'girl',  svg: (col: string) => (
    <svg viewBox="0 0 80 80" width="100%" height="100%">
      <circle cx="40" cy="28" r="16" fill={col} opacity="0.9"/>
      <path d="M24 24 Q26 10 40 10 Q54 10 56 24" fill="#3d2b1f"/>
      <path d="M55 24 Q60 28 56 36" stroke="#3d2b1f" strokeWidth="2.5" fill="none"/>
      <circle cx="62" cy="22" r="4" fill="#ff6b9d" opacity="0.8"/>
      <circle cx="34" cy="27" r="2.2" fill="#1a0f0a"/>
      <circle cx="46" cy="27" r="2.2" fill="#1a0f0a"/>
      <circle cx="34.8" cy="26.2" r="0.7" fill="white"/>
      <circle cx="46.8" cy="26.2" r="0.7" fill="white"/>
      <path d="M35 34 Q40 39 45 34" stroke="#1a0f0a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <circle cx="33" cy="31" r="3" fill="#ff9f9f" opacity="0.5"/>
      <circle cx="47" cy="31" r="3" fill="#ff9f9f" opacity="0.5"/>
      <path d="M26 43 Q22 58 22 74 L58 74 Q58 58 54 43 Q47 48 40 48 Q33 48 26 43Z" fill={col} opacity="0.7"/>
      <path d="M22 50 Q13 55 14 66" stroke={col} strokeWidth="9" strokeLinecap="round" fill="none" opacity="0.7"/>
      <path d="M58 50 Q67 55 66 66" stroke={col} strokeWidth="9" strokeLinecap="round" fill="none" opacity="0.7"/>
    </svg>
  )},
  { id: 'spirit', label: 'Forest Spirit',  gender: 'spirit',svg: (col: string) => (
    <svg viewBox="0 0 80 80" width="100%" height="100%">
      <circle cx="40" cy="40" r="28" fill={col} opacity="0.15"/>
      <circle cx="40" cy="32" r="18" fill={col} opacity="0.85"/>
      <ellipse cx="32" cy="27" rx="4" ry="5" fill="white" opacity="0.9"/>
      <ellipse cx="48" cy="27" rx="4" ry="5" fill="white" opacity="0.9"/>
      <circle cx="32" cy="28" r="2.5" fill="#0a1a0f"/>
      <circle cx="48" cy="28" r="2.5" fill="#0a1a0f"/>
      <circle cx="33" cy="27" r="1" fill="white"/>
      <circle cx="49" cy="27" r="1" fill="white"/>
      <path d="M34 38 Q40 43 46 38" stroke="#0a1a0f" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <ellipse cx="40" cy="22" rx="4" ry="3" fill={col} opacity="0.6"/>
      <ellipse cx="30" cy="18" rx="5" ry="3" fill="#2d6a4f" transform="rotate(-20,30,18)"/>
      <ellipse cx="50" cy="18" rx="5" ry="3" fill="#2d6a4f" transform="rotate(20,50,18)"/>
      <ellipse cx="40" cy="14" rx="4" ry="2.5" fill="#3a7d5a"/>
      <path d="M20 52 Q15 70 18 78 Q28 72 32 60" fill={col} opacity="0.6"/>
      <path d="M60 52 Q65 70 62 78 Q52 72 48 60" fill={col} opacity="0.6"/>
      <path d="M32 50 Q40 58 48 50 Q44 68 40 72 Q36 68 32 50Z" fill={col} opacity="0.55"/>
    </svg>
  )},
  { id: 'ninja',  label: 'Shadow Saver',   gender: 'man',   svg: (col: string) => (
    <svg viewBox="0 0 80 80" width="100%" height="100%">
      <circle cx="40" cy="28" r="17" fill="#1a0f0a"/>
      <rect x="23" y="26" width="34" height="8" rx="3" fill="#1a0f0a"/>
      <rect x="23" y="25" width="34" height="5" rx="2" fill={col} opacity="0.85"/>
      <circle cx="34" cy="29" r="2.5" fill={col} opacity="0.9"/>
      <circle cx="46" cy="29" r="2.5" fill={col} opacity="0.9"/>
      <rect x="24" y="45" width="32" height="29" rx="6" fill="#1a0f0a"/>
      <path d="M22 50 Q13 55 14 68" stroke="#1a0f0a" strokeWidth="10" strokeLinecap="round" fill="none"/>
      <path d="M58 50 Q67 55 66 68" stroke="#1a0f0a" strokeWidth="10" strokeLinecap="round" fill="none"/>
      <path d="M24 58 L56 58" stroke={col} strokeWidth="1.5" opacity="0.4"/>
      <rect x="28" y="74" width="9" height="8" rx="2" fill="#1a0f0a"/>
      <rect x="43" y="74" width="9" height="8" rx="2" fill="#1a0f0a"/>
    </svg>
  )},
];

// Color palette for avatar
const AVATAR_COLORS = [
  { id: 'forest', label: 'Forest',    hex: '#2d6a4f' },
  { id: 'leaf',   label: 'Leaf',      hex: '#52b788' },
  { id: 'ocean',  label: 'Ocean',     hex: '#1565c0' },
  { id: 'amber',  label: 'Amber',     hex: '#e8a020' },
  { id: 'rose',   label: 'Rose',      hex: '#c2185b' },
  { id: 'purple', label: 'Mystic',    hex: '#7b1fa2' },
  { id: 'teal',   label: 'Teal',      hex: '#00796b' },
  { id: 'crimson',label: 'Crimson',   hex: '#b71c1c' },
];

// ─── RANK SYSTEM ──────────────────────────────────────────────────────────────
const RANKS = [
  { min: 0,  label: 'Wandering Seed',   color: '#8b9e8b', icon: '🌰' },
  { min: 3,  label: 'Sprouting Sapling',color: '#52b788', icon: '🌱' },
  { min: 6,  label: 'Growing Canopy',   color: '#2d6a4f', icon: '🌿' },
  { min: 10, label: 'Forest Guardian',  color: '#4da6ff', icon: '🌳' },
  { min: 16, label: 'Ancient Oak',      color: '#ff9f43', icon: '🌲' },
  { min: 24, label: 'Forest Legend',    color: '#c77dff', icon: '🏔️' },
];

// ─── REWARDS ─────────────────────────────────────────────────────────────────
const REWARDS = [
  { id: 'r1',  icon: '🌿', name: 'First Leaf',       desc: 'Log your first expense',                cost: 0,   type: 'milestone', unlockLevel: 1  },
  { id: 'r2',  icon: '🌸', name: 'Cherry Frame',      desc: 'Rare avatar border',                    cost: 100, type: 'cosmetic',  unlockLevel: 2  },
  { id: 'r3',  icon: '🔥', name: '7-Day Flame',       desc: 'Stay under budget 7 days straight',     cost: 0,   type: 'milestone', unlockLevel: 3  },
  { id: 'r4',  icon: '🦋', name: 'Butterfly Effect',  desc: 'Saved ₹500 in a single week',           cost: 0,   type: 'milestone', unlockLevel: 4  },
  { id: 'r5',  icon: '🎋', name: 'Bamboo Badge',      desc: 'Equip on your profile',                 cost: 200, type: 'cosmetic',  unlockLevel: 5  },
  { id: 'r6',  icon: '🌙', name: 'Moonlit Title',     desc: '"Night Saver" title for your card',     cost: 300, type: 'cosmetic',  unlockLevel: 6  },
  { id: 'r7',  icon: '🦌', name: 'Dusk Deer',         desc: 'Forest fauna companion unlocked',       cost: 0,   type: 'milestone', unlockLevel: 8  },
  { id: 'r8',  icon: '⚡', name: 'Lightning Saver',   desc: 'Log 5 expenses in under 2 minutes',     cost: 0,   type: 'milestone', unlockLevel: 5  },
  { id: 'r9',  icon: '🏆', name: 'Gold Canopy',       desc: 'Legendary profile frame',               cost: 500, type: 'cosmetic',  unlockLevel: 10 },
  { id: 'r10', icon: '💎', name: 'Crystal Bark',      desc: 'Animated profile background',           cost: 800, type: 'cosmetic',  unlockLevel: 14 },
];

// ─── ACHIEVEMENTS ─────────────────────────────────────────────────────────────
const ACHIEVEMENTS = [
  { id: 'a1',  icon: '🌱', name: 'First Roots',       desc: 'Log your very first expense',           condition: (s: Stats) => s.days >= 1,      xp: 20  },
  { id: 'a2',  icon: '📅', name: 'Week Warrior',       desc: '7 days of tracking',                    condition: (s: Stats) => s.days >= 7,      xp: 50  },
  { id: 'a3',  icon: '💰', name: 'Money Conscious',    desc: 'Log ₹1000+ total',                      condition: (s: Stats) => s.totalSpent >= 1000, xp: 40 },
  { id: 'a4',  icon: '🌿', name: 'Consistent Saver',   desc: 'Reach level 5',                         condition: (s: Stats) => s.level >= 5,     xp: 80  },
  { id: 'a5',  icon: '🔥', name: 'On Fire',            desc: '14 days of tracking',                   condition: (s: Stats) => s.days >= 14,     xp: 100 },
  { id: 'a6',  icon: '🌳', name: 'Oak Status',         desc: 'Reach level 10',                        condition: (s: Stats) => s.level >= 10,    xp: 150 },
  { id: 'a7',  icon: '💎', name: 'Diamond Discipline', desc: 'Save 2000+ coins',                      condition: (s: Stats) => s.coins >= 2000,  xp: 200 },
  { id: 'a8',  icon: '🏔️', name: 'Summit Reached',    desc: 'Reach level 20',                        condition: (s: Stats) => s.level >= 20,    xp: 500 },
];

interface Stats {
  xp: number; level: number; currentXP: number; nextXP: number;
  coins: number; rank: typeof RANKS[0]; totalSpent: number; days: number;
}

export function ProfileView({ user }: { user: AppUser }) {
  const [avatarId, setAvatarId] = useState('man1');
  const [avatarColor, setAvatarColor] = useState('#52b788');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'rewards' | 'achievements'>('stats');
  const [equippedRewards, setEquippedRewards] = useState<string[]>([]);

  const { expenses } = useExpenses();
  const { xp: gameXp, level: gameLevel } = useGameState();

  const stats: Stats = useMemo(() => {
    const totalSpent = expenses.reduce((s: number, e: { amount: number }) => s + Number(e.amount), 0);
    const days = new Set(expenses.map((e: { date: string }) => e.date)).size;
    
    // Use authoritative game state from Supabase
    const xp = gameXp;
    const level = gameLevel;
    const currentXP = xp % 100;
    const nextXP = 100;
    
    const coins = Math.max(0, Math.floor((user.dailyBudget * days - totalSpent) / 5));
    const rank = [...RANKS].reverse().find(r => level >= r.min) || RANKS[0];
    return { xp, level, currentXP, nextXP, coins, rank, totalSpent, days };
  }, [expenses, user.dailyBudget, gameXp, gameLevel]);

  const unlockedAchievements = ACHIEVEMENTS.filter(a => a.condition(stats));
  const currentAvatar = AVATARS.find(a => a.id === avatarId) || AVATARS[0];

  // Which rewards are accessible (enough coins + level)
  const canAfford = (cost: number) => stats.coins >= cost;
  const isUnlocked = (r: typeof REWARDS[0]) =>
    r.type === 'milestone'
      ? unlockedAchievements.some(a => a.xp <= r.cost + 1) || stats.level >= r.unlockLevel
      : stats.level >= r.unlockLevel && canAfford(r.cost);

  const isEquipped = (id: string) => equippedRewards.includes(id);
  const toggleEquip = (id: string) => {
    setEquippedRewards(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Equipped cosmetic frame
  const frameColor = equippedRewards.includes('r2') ? '#ff6b9d'
    : equippedRewards.includes('r9') ? '#f0c040'
    : equippedRewards.includes('r10') ? '#c77dff'
    : null;

  // ─── Shared card style ───────────────────────────────────────────────────────
  const gc: React.CSSProperties = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 14,
  };

  return (
    <div style={{
      flex: 1, overflowY: 'auto', background: '#0a1a0f',
      color: '#e8f5e9', fontFamily: "'DM Sans', sans-serif",
      scrollbarWidth: 'thin', scrollbarColor: 'rgba(82,183,136,0.15) transparent',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px 40px' }}>

        {/* ══ HERO PROFILE CARD ═══════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            ...gc,
            padding: '22px',
            marginBottom: 14,
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, rgba(45,106,79,0.18) 0%, rgba(10,26,15,0.95) 60%)',
          }}
        >
          {/* Ambient glow */}
          <div style={{
            position: 'absolute', top: -40, right: -40,
            width: 200, height: 200, borderRadius: '50%',
            background: `radial-gradient(circle, ${avatarColor}18 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 18, position: 'relative' }}>

            {/* Avatar with frame */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowAvatarPicker(true)}
                style={{
                  width: 82, height: 82,
                  borderRadius: '50%',
                  border: frameColor ? `3px solid ${frameColor}` : `2px solid ${avatarColor}55`,
                  background: `${avatarColor}14`,
                  cursor: 'pointer',
                  overflow: 'hidden',
                  boxShadow: frameColor
                    ? `0 0 20px ${frameColor}55`
                    : `0 0 16px ${avatarColor}33`,
                }}
              >
                {currentAvatar.svg(avatarColor)}
              </motion.div>
              {/* Edit badge */}
              <div style={{
                position: 'absolute', bottom: 0, right: 0,
                width: 22, height: 22, borderRadius: '50%',
                background: avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, border: '2px solid #0a1a0f', cursor: 'pointer',
              }} onClick={() => setShowAvatarPicker(true)}>
                ✏️
              </div>
              {/* Rank icon badge */}
              <div style={{
                position: 'absolute', top: -4, left: -4,
                width: 22, height: 22, borderRadius: '50%',
                background: '#0a1a0f', border: `1.5px solid ${stats.rank.color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11,
              }}>
                {stats.rank.icon}
              </div>
            </div>

            {/* Name + rank + level */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#e8f5e9', fontFamily: '"Playfair Display", serif' }}>
                  {user.name}
                </h2>
                {equippedRewards.includes('r6') && (
                  <span style={{
                    fontSize: 9, padding: '2px 7px', borderRadius: 20,
                    background: 'rgba(74,166,255,0.15)', border: '1px solid rgba(74,166,255,0.3)',
                    color: '#4da6ff', letterSpacing: '0.1em', textTransform: 'uppercase',
                  }}>Night Saver</span>
                )}
                {equippedRewards.includes('r5') && (
                  <span style={{ fontSize: 14 }}>🎋</span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                <span style={{ fontSize: 13 }}>{stats.rank.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: stats.rank.color }}>
                  {stats.rank.label}
                </span>
              </div>

              {/* Level + XP bar */}
              <div style={{ marginTop: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 11 }}>
                  <span style={{ color: 'rgba(168,237,188,0.6)', fontWeight: 600 }}>
                    LEVEL {stats.level}
                  </span>
                  <span style={{ color: 'rgba(168,237,188,0.45)' }}>
                    {stats.currentXP} / {stats.nextXP} XP
                  </span>
                </div>
                <div style={{ height: 8, background: 'rgba(255,255,255,0.07)', borderRadius: 4, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.currentXP}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                    style={{
                      height: '100%', borderRadius: 4,
                      background: `linear-gradient(90deg, ${avatarColor}aa, ${avatarColor})`,
                      boxShadow: `0 0 8px ${avatarColor}66`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Coins badge */}
            <div style={{
              flexShrink: 0, textAlign: 'center',
              padding: '10px 14px', borderRadius: 12,
              background: 'rgba(240,192,64,0.08)',
              border: '1px solid rgba(240,192,64,0.22)',
            }}>
              <div style={{ fontSize: 20 }}>🪙</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#f0c040', lineHeight: 1.1 }}>
                {stats.coins.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: 9, color: 'rgba(240,192,64,0.55)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 1 }}>
                Coins
              </div>
            </div>
          </div>

          {/* Equipped achievement badges strip */}
          {unlockedAchievements.length > 0 && (
            <div style={{ display: 'flex', gap: 5, marginTop: 14, flexWrap: 'wrap' }}>
              {unlockedAchievements.slice(0, 5).map(a => (
                <span key={a.id} title={a.name} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '3px 8px', borderRadius: 20, fontSize: 10,
                  background: 'rgba(82,183,136,0.1)', border: '1px solid rgba(82,183,136,0.2)',
                  color: '#a8edbc',
                }}>
                  {a.icon} {a.name}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* ══ QUICK STATS ROW ═══════════════════════════════════════════════════ */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 14 }}>
          {[
            { icon: '📊', label: 'Total XP',    value: stats.xp.toLocaleString('en-IN'), color: avatarColor },
            { icon: '🗓️', label: 'Days Active', value: stats.days.toString(),             color: '#4da6ff'  },
            { icon: '💸', label: 'Total Spent', value: `₹${stats.totalSpent.toLocaleString('en-IN')}`, color: '#ff9f43' },
            { icon: '🏅', label: 'Badges',      value: unlockedAchievements.length.toString(), color: '#c77dff' },
          ].map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              style={{ ...gc, padding: '12px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 10, color: 'rgba(168,237,188,0.4)', marginTop: 3, letterSpacing: '0.08em' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* ══ TABS ═════════════════════════════════════════════════════════════ */}
        <div style={{
          display: 'flex', gap: 4, marginBottom: 12,
          background: 'rgba(255,255,255,0.03)',
          padding: 4, borderRadius: 10,
          border: '1px solid rgba(255,255,255,0.07)',
        }}>
          {(['stats', 'rewards', 'achievements'] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              flex: 1, padding: '7px 4px', borderRadius: 7, border: 'none', cursor: 'pointer',
              fontSize: 11, fontWeight: 600, textTransform: 'capitalize', letterSpacing: '0.05em',
              background: activeTab === t ? `${avatarColor}22` : 'transparent',
              color: activeTab === t ? avatarColor : 'rgba(168,237,188,0.45)',
              outline: activeTab === t ? `1px solid ${avatarColor}44` : 'none',
              transition: 'all 0.15s',
            }}>
              {t === 'stats' ? '📈 Stats' : t === 'rewards' ? '🎁 Rewards' : '🏆 Achievements'}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ══ STATS TAB ════════════════════════════════════════════════════== */}
          {activeTab === 'stats' && (
            <motion.div key="stats"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

              {/* Rank ladder */}
              <div style={{ ...gc, padding: '16px', marginBottom: 10 }}>
                <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(107,158,123,0.5)', marginBottom: 12 }}>
                  Rank Progression
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {RANKS.map((r, i) => {
                    const isCurrent = stats.rank.label === r.label;
                    const isPast = RANKS.indexOf(stats.rank) > i;
                    const isNext = !isCurrent && !isPast;
                    return (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '8px 10px', borderRadius: 8,
                        background: isCurrent ? `${r.color}16` : 'transparent',
                        border: isCurrent ? `1px solid ${r.color}44` : '1px solid transparent',
                        opacity: isNext && RANKS.indexOf(r) > RANKS.indexOf(stats.rank) + 1 ? 0.4 : 1,
                      }}>
                        <span style={{ fontSize: 16 }}>{r.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: isCurrent ? r.color : isPast ? 'rgba(168,237,188,0.55)' : 'rgba(168,237,188,0.3)' }}>
                            {r.label}
                          </div>
                          <div style={{ fontSize: 9, color: 'rgba(107,158,123,0.4)' }}>Level {r.min}+</div>
                        </div>
                        {isPast && <span style={{ fontSize: 13, color: '#52b788' }}>✓</span>}
                        {isCurrent && (
                          <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 10, background: `${r.color}22`, color: r.color, fontWeight: 700 }}>
                            CURRENT
                          </span>
                        )}
                        {!isCurrent && !isPast && (
                          <span style={{ fontSize: 9, color: 'rgba(107,158,123,0.35)' }}>Lv {r.min}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Progress toward next rank */}
              {(() => {
                const nextRankIdx = RANKS.indexOf(stats.rank) + 1;
                if (nextRankIdx >= RANKS.length) return null;
                const nextRank = RANKS[nextRankIdx];
                const levelsNeeded = nextRank.min - stats.level;
                const prevMin = stats.rank.min;
                const progress = ((stats.level - prevMin) / (nextRank.min - prevMin)) * 100;
                return (
                  <div style={{ ...gc, padding: '14px 16px', marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 11 }}>
                      <span style={{ color: 'rgba(168,237,188,0.55)' }}>Next rank: <strong style={{ color: nextRank.color }}>{nextRank.label}</strong></span>
                      <span style={{ color: 'rgba(168,237,188,0.4)' }}>{levelsNeeded} levels away</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${Math.min(progress, 100)}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        style={{ height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${nextRank.color}88, ${nextRank.color})` }}
                      />
                    </div>
                  </div>
                );
              })()}

              {/* Inspirational quote */}
              <div style={{ ...gc, padding: '14px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>🌿</div>
                <p style={{ fontSize: 12, color: 'rgba(168,237,188,0.65)', fontStyle: 'italic', fontFamily: '"Playfair Display", serif', margin: 0, lineHeight: 1.7 }}>
                  "Your forest reflects your discipline.<br />Every coin saved is a root that runs deeper."
                </p>
              </div>
            </motion.div>
          )}

          {/* ══ REWARDS TAB ══════════════════════════════════════════════════== */}
          {activeTab === 'rewards' && (
            <motion.div key="rewards"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

              <div style={{ ...gc, padding: '10px 14px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>🪙</span>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#f0c040' }}>{stats.coins.toLocaleString('en-IN')} coins available</span>
                  <span style={{ fontSize: 10, color: 'rgba(107,158,123,0.5)', marginLeft: 8 }}>Spend wisely, keeper</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {REWARDS.map((r, i) => {
                  const unlocked = isUnlocked(r);
                  const equipped = isEquipped(r.id);
                  const affordable = r.type === 'milestone' || canAfford(r.cost);

                  return (
                    <motion.div key={r.id}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 14px', borderRadius: 12,
                        background: equipped ? `${avatarColor}12` : unlocked ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.015)',
                        border: equipped ? `1px solid ${avatarColor}44`
                          : unlocked ? '1px solid rgba(255,255,255,0.08)'
                          : '1px solid rgba(255,255,255,0.04)',
                        opacity: !unlocked ? 0.55 : 1,
                      }}>

                      {/* Icon */}
                      <div style={{
                        width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                        background: unlocked ? `${avatarColor}18` : 'rgba(255,255,255,0.04)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 20,
                        filter: !unlocked ? 'grayscale(1) brightness(0.4)' : 'none',
                      }}>
                        {r.icon}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: unlocked ? '#e8f5e9' : 'rgba(168,237,188,0.35)' }}>
                            {r.name}
                          </span>
                          {r.type === 'cosmetic' && (
                            <span style={{
                              fontSize: 9, padding: '1px 5px', borderRadius: 8,
                              background: 'rgba(199,125,255,0.15)', color: '#c77dff',
                              border: '1px solid rgba(199,125,255,0.25)',
                            }}>COSMETIC</span>
                          )}
                        </div>
                        <div style={{ fontSize: 11, color: 'rgba(107,158,123,0.55)', marginTop: 2 }}>{r.desc}</div>
                        {!unlocked && (
                          <div style={{ fontSize: 10, color: 'rgba(107,158,123,0.4)', marginTop: 2 }}>
                            🔒 Requires Level {r.unlockLevel}
                          </div>
                        )}
                      </div>

                      {/* Cost / button */}
                      <div style={{ flexShrink: 0, textAlign: 'right' }}>
                        {r.type === 'milestone' ? (
                          unlocked ? (
                            <span style={{ fontSize: 12, color: '#52b788', fontWeight: 600 }}>✓ Earned</span>
                          ) : (
                            <span style={{ fontSize: 10, color: 'rgba(107,158,123,0.4)' }}>Milestone</span>
                          )
                        ) : (
                          <>
                            <div style={{ fontSize: 11, color: '#f0c040', fontWeight: 700, marginBottom: 4 }}>
                              🪙 {r.cost}
                            </div>
                            {unlocked ? (
                              <button onClick={() => toggleEquip(r.id)} style={{
                                padding: '4px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
                                fontSize: 10, fontWeight: 700,
                                background: equipped ? `${avatarColor}33` : affordable ? `${avatarColor}` : 'rgba(255,255,255,0.07)',
                                color: equipped ? avatarColor : affordable ? '#0a1a0f' : 'rgba(107,158,123,0.4)',
                                outline: equipped ? `1px solid ${avatarColor}` : 'none',
                              }}>
                                {equipped ? 'Equipped ✓' : affordable ? 'Equip' : 'Not enough 🪙'}
                              </button>
                            ) : (
                              <span style={{ fontSize: 9, color: 'rgba(107,158,123,0.35)' }}>Locked</span>
                            )}
                          </>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ══ ACHIEVEMENTS TAB ═════════════════════════════════════════════== */}
          {activeTab === 'achievements' && (
            <motion.div key="achievements"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

              <div style={{ ...gc, padding: '10px 14px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 8,
                  background: `${avatarColor}22`, border: `1px solid ${avatarColor}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                }}>🏆</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: avatarColor }}>
                    {unlockedAchievements.length} / {ACHIEVEMENTS.length} Unlocked
                  </div>
                  <div style={{ fontSize: 10, color: 'rgba(107,158,123,0.5)' }}>
                    Total XP from achievements: {unlockedAchievements.reduce((s, a) => s + a.xp, 0)}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ ...gc, padding: '10px 14px', marginBottom: 10 }}>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(unlockedAchievements.length / ACHIEVEMENTS.length) * 100}%` }}
                    transition={{ duration: 1.1, ease: 'easeOut' }}
                    style={{ height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${avatarColor}88, ${avatarColor})` }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {ACHIEVEMENTS.map((a, i) => {
                  const done = a.condition(stats);
                  return (
                    <motion.div key={a.id}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: done ? 1 : 0.45, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '11px 14px', borderRadius: 12,
                        background: done ? `${avatarColor}0d` : 'rgba(255,255,255,0.02)',
                        border: done ? `1px solid ${avatarColor}33` : '1px solid rgba(255,255,255,0.05)',
                      }}>

                      <div style={{
                        width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                        background: done ? `${avatarColor}18` : 'rgba(255,255,255,0.04)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 20,
                        filter: done ? 'none' : 'grayscale(1) brightness(0.3)',
                      }}>
                        {a.icon}
                      </div>

                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: done ? '#e8f5e9' : 'rgba(168,237,188,0.3)' }}>
                          {done ? a.name : '??? Locked'}
                        </span>
                        <div style={{ fontSize: 11, color: 'rgba(107,158,123,0.5)', marginTop: 2 }}>
                          {done ? a.desc : a.desc}
                        </div>
                      </div>

                      <div style={{ flexShrink: 0, textAlign: 'right' }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: done ? avatarColor : 'rgba(107,158,123,0.3)' }}>
                          +{a.xp} XP
                        </div>
                        {done && <div style={{ fontSize: 10, color: '#52b788', marginTop: 2 }}>✓ Done</div>}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ══ AVATAR PICKER MODAL ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {showAvatarPicker && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowAvatarPicker(false)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 100, backdropFilter: 'blur(6px)',
            }}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: '#0d1f12',
                border: '1px solid rgba(82,183,136,0.25)',
                borderRadius: 20,
                padding: '22px',
                width: 360,
                maxHeight: '82vh',
                overflowY: 'auto',
                scrollbarWidth: 'thin',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#e8f5e9', fontFamily: '"Playfair Display", serif' }}>
                  Customize Avatar
                </h3>
                <button onClick={() => setShowAvatarPicker(false)} style={{
                  width: 28, height: 28, borderRadius: '50%', border: 'none', cursor: 'pointer',
                  background: 'rgba(255,255,255,0.06)', color: 'rgba(168,237,188,0.6)', fontSize: 12,
                }}>✕</button>
              </div>

              {/* Preview */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
                <div style={{
                  width: 90, height: 90, borderRadius: '50%',
                  border: `3px solid ${avatarColor}`,
                  background: `${avatarColor}14`,
                  overflow: 'hidden',
                  boxShadow: `0 0 24px ${avatarColor}44`,
                }}>
                  {AVATARS.find(a => a.id === avatarId)?.svg(avatarColor)}
                </div>
              </div>

              {/* Avatar grid */}
              <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(107,158,123,0.45)', marginBottom: 8 }}>
                Choose Character
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
                {AVATARS.map(av => (
                  <motion.button key={av.id}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                    onClick={() => setAvatarId(av.id)}
                    style={{
                      padding: '10px 6px 8px',
                      borderRadius: 12,
                      border: avatarId === av.id ? `2px solid ${avatarColor}` : '2px solid rgba(255,255,255,0.07)',
                      background: avatarId === av.id ? `${avatarColor}16` : 'rgba(255,255,255,0.03)',
                      cursor: 'pointer',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                      boxShadow: avatarId === av.id ? `0 0 12px ${avatarColor}33` : 'none',
                    }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', background: `${avatarColor}18` }}>
                      {av.svg(avatarColor)}
                    </div>
                    <span style={{ fontSize: 9, color: avatarId === av.id ? avatarColor : 'rgba(168,237,188,0.45)', fontWeight: 600, textAlign: 'center' }}>
                      {av.label}
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* Color picker */}
              <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(107,158,123,0.45)', marginBottom: 8 }}>
                Choose Color
              </div>
              <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 18 }}>
                {AVATAR_COLORS.map(c => (
                  <motion.button key={c.id}
                    whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                    onClick={() => setAvatarColor(c.hex)}
                    title={c.label}
                    style={{
                      width: 30, height: 30, borderRadius: '50%',
                      background: c.hex, border: 'none', cursor: 'pointer',
                      outline: avatarColor === c.hex ? `3px solid white` : `2px solid transparent`,
                      outlineOffset: 2,
                      boxShadow: avatarColor === c.hex ? `0 0 10px ${c.hex}88` : 'none',
                    }}
                  />
                ))}
              </div>

              <button onClick={() => setShowAvatarPicker(false)} style={{
                width: '100%', padding: '10px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: `linear-gradient(135deg, #2d6a4f, ${avatarColor})`,
                color: '#e8f5e9', fontSize: 13, fontWeight: 700,
              }}>
                Save Avatar ✓
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}