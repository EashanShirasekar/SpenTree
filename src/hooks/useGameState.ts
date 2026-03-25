import { useEffect, useState, useCallback } from 'react'
import {
  getGameState as apiGetGameState,
  updateGameState as apiUpdateGameState,
  addXP as apiAddXP,
  getUserBadges as apiGetUserBadges,
  awardBadge as apiAwardBadge,
} from '../lib/api'
import type { UserGameState, UserBadge } from '../lib/database.types'

export function useGameState() {
  const [gameState, setGameState] = useState<UserGameState | null>(null)
  const [badges, setBadges] = useState<UserBadge[]>([])
  const [loading, setLoading] = useState(true)

  const loadGameState = useCallback(async () => {
    try {
      setLoading(true)
      const [state, userBadges] = await Promise.all([
        apiGetGameState(),
        apiGetUserBadges(),
      ])
      setGameState(state)
      setBadges(userBadges)
    } catch (err) {
      console.error('Failed to load game state:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const addXP = async (amount: number) => {
    const updated = await apiAddXP(amount)
    setGameState(updated)
    return updated
  }

  const updateState = async (
    updates: Partial<Pick<UserGameState, 'xp' | 'level' | 'streak' | 'locker_amount'>>
  ) => {
    const updated = await apiUpdateGameState(updates)
    setGameState(updated)
    return updated
  }

  const earnBadge = async (badgeId: string) => {
    const badge = await apiAwardBadge(badgeId)
    if (badge) {
      setBadges(prev => [...prev.filter(b => b.badge_id !== badgeId), badge])
    }
    return badge
  }

  useEffect(() => {
    loadGameState()
  }, [loadGameState])

  return {
    gameState,
    badges,
    loading,
    addXP,
    updateState,
    earnBadge,
    refreshGameState: loadGameState,
    // Convenience getters
    xp: gameState?.xp || 0,
    level: gameState?.level || 1,
    streak: gameState?.streak || 0,
    lockerAmount: gameState?.locker_amount || 0,
  }
}
