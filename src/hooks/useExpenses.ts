import { useEffect, useState, useCallback } from 'react'
import {
  addExpense as apiAddExpense,
  getExpenses as apiGetExpenses,
  deleteExpense as apiDeleteExpense,
} from '../lib/api'
import type { Expense } from '../lib/database.types'

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  const loadExpenses = useCallback(async () => {
    try {
      setLoading(true)
      const data = await apiGetExpenses()
      setExpenses(data)
    } catch (err) {
      console.error('Failed to load expenses:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const createExpense = async (expense: {
    amount: number
    category: string
    note?: string
  }) => {
    const newExpense = await apiAddExpense(expense)
    setExpenses(prev => [newExpense, ...prev])
    return newExpense
  }

  const removeExpense = async (id: string) => {
    await apiDeleteExpense(id)
    setExpenses(prev => prev.filter(e => e.id !== id))
  }

  const getTodayExpenses = (): Expense[] => {
    const today = new Date().toISOString().split('T')[0]
    return expenses.filter(e => e.date === today)
  }

  const getTodayTotal = (): number => {
    return getTodayExpenses().reduce((sum, e) => sum + Number(e.amount), 0)
  }

  useEffect(() => {
    loadExpenses()
  }, [loadExpenses])

  return {
    expenses,
    loading,
    createExpense,
    removeExpense,
    getTodayExpenses,
    getTodayTotal,
    refreshExpenses: loadExpenses,
  }
}