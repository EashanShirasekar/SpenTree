// =====================================================
// Supabase Database Types — mirrors the SQL schema
// =====================================================

export type TreeSpecies = 'oak' | 'banyan' | 'peepal';

export type TreeState =
  | 'seedling'
  | 'sapling'
  | 'healthy'
  | 'stressed'
  | 'burnt'
  | 'golden'
  | 'crystal';

// ── profiles ──────────────────────────────────────────
export interface Profile {
  id: string;
  display_name: string;
  email: string;
  forest_name: string;
  daily_budget: number;
  tree_species: TreeSpecies;
  created_at: string;
  updated_at: string;
}

// ── expenses ──────────────────────────────────────────
export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  category: string;
  note: string;
  date: string;        // YYYY-MM-DD
  created_at: string;  // ISO timestamp
}

export type ExpenseInsert = Omit<Expense, 'id' | 'created_at'>;

// ── savings_goals ─────────────────────────────────────
export interface SavingsGoal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  saved_amount: number;
  created_at: string;
}

export type SavingsGoalInsert = Omit<SavingsGoal, 'id' | 'created_at'>;

// ── user_game_state ───────────────────────────────────
export interface UserGameState {
  user_id: string;
  xp: number;
  level: number;
  streak: number;
  locker_amount: number;
  updated_at: string;
}

// ── user_badges ───────────────────────────────────────
export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
}

// ── Convenience type used by AuthContext ───────────────
export interface AppUser {
  id: string;
  name: string;
  email: string;
  forestName: string;
  dailyBudget: number;
  treeSpecies: TreeSpecies;
  createdAt: string;
}

/** Convert a DB Profile row into the AppUser shape used by the UI */
export function profileToAppUser(p: Profile): AppUser {
  return {
    id: p.id,
    name: p.display_name,
    email: p.email,
    forestName: p.forest_name,
    dailyBudget: Number(p.daily_budget),
    treeSpecies: p.tree_species as TreeSpecies,
    createdAt: p.created_at,
  };
}
