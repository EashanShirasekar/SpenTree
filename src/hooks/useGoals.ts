import { useEffect, useState, useCallback } from 'react'
import {
  getGoals as apiGetGoals,
  addGoal as apiAddGoal,
  updateGoal as apiUpdateGoal,
  deleteGoal as apiDeleteGoal,
} from '../lib/api'
import type { SavingsGoal } from '../lib/database.types'

export function useGoals() {
  const [goals, setGoals] = useState<SavingsGoal[]>([])
  const [loading, setLoading] = useState(true)

  const loadGoals = useCallback(async () => {
    try {
      setLoading(true)
      const data = await apiGetGoals()
      setGoals(data)
    } catch (err) {
      console.error('Failed to load goals:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const createGoal = async (name: string, targetAmount: number) => {
    const newGoal = await apiAddGoal({ name, target_amount: targetAmount })
    setGoals(prev => [...prev, newGoal])
    return newGoal
  }

  const modifyGoal = async (
    id: string,
    updates: Partial<Pick<SavingsGoal, 'name' | 'target_amount' | 'saved_amount'>>
  ) => {
    const updated = await apiUpdateGoal(id, updates)
    setGoals(prev => prev.map(g => (g.id === id ? updated : g)))
    return updated
  }

  const removeGoal = async (id: string) => {
    await apiDeleteGoal(id)
    setGoals(prev => prev.filter(g => g.id !== id))
  }

  useEffect(() => {
    loadGoals()
  }, [loadGoals])

  return {
    goals,
    loading,
    createGoal,
    modifyGoal,
    removeGoal,
    refreshGoals: loadGoals,
  }
}
