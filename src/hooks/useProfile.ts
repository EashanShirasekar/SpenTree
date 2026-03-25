import { useEffect, useState, useCallback } from 'react'
import { getProfile, updateProfile } from '../lib/auth'
import { useAuth } from '../contexts/AuthContext'
import type { Profile } from '../lib/database.types'

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async () => {
    if (!user?.id) {
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const data = await getProfile(user.id)
      setProfile(data)
    } catch (err) {
      console.error('Failed to load profile:', err)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  const saveProfile = async (
    updates: Partial<Pick<Profile, 'display_name' | 'forest_name' | 'daily_budget' | 'tree_species'>>
  ) => {
    if (!user?.id) throw new Error('Not authenticated')
    const updated = await updateProfile(user.id, updates)
    setProfile(updated)
    return updated
  }

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  return {
    profile,
    loading,
    saveProfile,
    refreshProfile: loadProfile,
  }
}
