import { supabase } from './supabase'
import type { Profile } from './database.types'

// ── Sign Up ───────────────────────────────────────────
export async function signUp(name: string, email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: name },
    },
  })

  if (error) throw error

  // The DB trigger auto-creates the profile row,
  // but we update display_name + email immediately
  if (data.user) {
    await supabase
      .from('profiles')
      .update({ display_name: name, email })
      .eq('id', data.user.id)
  }

  return data.user
}

// ── Sign In ───────────────────────────────────────────
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data.user
}

// ── Get current Supabase auth user ────────────────────
export async function getUser() {
  const { data } = await supabase.auth.getUser()
  return data.user
}

// ── Google OAuth ──────────────────────────────────────
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  })
  if (error) throw error
  return data
}

// ── Sign Out ──────────────────────────────────────────
export async function signOut() {
  await supabase.auth.signOut()
}

// ── Profile helpers ───────────────────────────────────
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('getProfile error:', error)
    return null
  }
  return data as Profile
}

export async function updateProfile(
  userId: string,
  updates: Partial<Pick<Profile, 'display_name' | 'forest_name' | 'daily_budget' | 'tree_species'>>
) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data as Profile
}