import { supabase } from './supabase'
import type {
  Expense,
  SavingsGoal,
  UserGameState,
  UserBadge,
} from './database.types'
import { getUser } from './auth'

// ════════════════════════════════════════════════════════
// EXPENSES
// ════════════════════════════════════════════════════════

export async function addExpense({
  amount,
  category,
  note,
}: {
  amount: number
  category: string
  note?: string
}) {
  const user = await getUser()
  if (!user) throw new Error('Not authenticated')

  const now = new Date()

  const { data, error } = await supabase
    .from('expenses')
    .insert({
      user_id: user.id,
      amount,
      category,
      note: note || '',
      date: now.toISOString().split('T')[0],
    })
    .select()
    .single()

  if (error) throw error
  return data as Expense
}

export async function getExpenses(): Promise<Expense[]> {
  const user = await getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []) as Expense[]
}

export async function getExpensesByDate(date: string): Promise<Expense[]> {
  const user = await getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', date)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []) as Expense[]
}

export async function deleteExpense(id: string) {
  const { error } = await supabase.from('expenses').delete().eq('id', id)
  if (error) throw error
}

// ════════════════════════════════════════════════════════
// GAME STATE
// ════════════════════════════════════════════════════════

export async function getGameState(): Promise<UserGameState | null> {
  const user = await getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('user_game_state')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error) {
    console.error('getGameState error:', error)
    return null
  }
  return data as UserGameState
}

export async function updateGameState(
  updates: Partial<Pick<UserGameState, 'xp' | 'level' | 'streak' | 'locker_amount'>>
) {
  const user = await getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('user_game_state')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) throw error
  return data as UserGameState
}

export async function addXP(amount: number): Promise<UserGameState> {
  const current = await getGameState()
  const currentXP = current?.xp || 0
  const currentLevel = current?.level || 1
  const newXP = currentXP + amount

  // Level up every 200 XP
  const xpForLevel = currentLevel * 200
  let newLevel = currentLevel
  let remainingXP = newXP

  if (newXP >= xpForLevel) {
    newLevel = currentLevel + 1
    remainingXP = newXP - xpForLevel
  }

  return updateGameState({ xp: remainingXP, level: newLevel })
}

// ════════════════════════════════════════════════════════
// SAVINGS GOALS
// ════════════════════════════════════════════════════════

export async function getGoals(): Promise<SavingsGoal[]> {
  const user = await getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('savings_goals')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data || []) as SavingsGoal[]
}

export async function addGoal({
  name,
  target_amount,
}: {
  name: string
  target_amount: number
}): Promise<SavingsGoal> {
  const user = await getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('savings_goals')
    .insert({
      user_id: user.id,
      name,
      target_amount,
      saved_amount: 0,
    })
    .select()
    .single()

  if (error) throw error
  return data as SavingsGoal
}

export async function updateGoal(
  id: string,
  updates: Partial<Pick<SavingsGoal, 'name' | 'target_amount' | 'saved_amount'>>
) {
  const { data, error } = await supabase
    .from('savings_goals')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as SavingsGoal
}

export async function deleteGoal(id: string) {
  const { error } = await supabase.from('savings_goals').delete().eq('id', id)
  if (error) throw error
}

// ════════════════════════════════════════════════════════
// BADGES
// ════════════════════════════════════════════════════════

export async function getUserBadges(): Promise<UserBadge[]> {
  const user = await getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('user_badges')
    .select('*')
    .eq('user_id', user.id)

  if (error) throw error
  return (data || []) as UserBadge[]
}

export async function awardBadge(badgeId: string): Promise<UserBadge | null> {
  const user = await getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('user_badges')
    .upsert(
      { user_id: user.id, badge_id: badgeId },
      { onConflict: 'user_id,badge_id' }
    )
    .select()
    .single()

  if (error) {
    console.error('awardBadge error:', error)
    return null
  }
  return data as UserBadge
}