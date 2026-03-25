// =====================================================
// Pure utility functions — NO localStorage access
// =====================================================

import type { TreeState } from './database.types'

export const CATEGORIES = [
  { id: 'food', label: 'Food', icon: '🍔' },
  { id: 'transport', label: 'Transport', icon: '🚗' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️' },
  { id: 'bills', label: 'Bills', icon: '💡' },
  { id: 'health', label: 'Health', icon: '💊' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬' },
  { id: 'travel', label: 'Travel', icon: '✈️' },
  { id: 'education', label: 'Education', icon: '📚' },
  { id: 'gaming', label: 'Gaming', icon: '🎮' },
  { id: 'other', label: 'Other', icon: '🌀' },
];

const LEVEL_NAMES = [
  'Wandering Seed',
  'Tiny Sprout',
  'Young Sapling',
  'Grove Keeper',
  'Forest Warden',
  'Elder of the Wood',
  'Ancient Guardian',
  "Pushkara's Chosen",
];

export function getLevelName(level: number): string {
  return LEVEL_NAMES[Math.min(level - 1, LEVEL_NAMES.length - 1)];
}

export function getXPForLevel(level: number): number {
  return level * 200;
}

export function getTreeState(spentPercent: number): TreeState {
  if (spentPercent <= 20) return 'seedling';
  if (spentPercent <= 50) return 'sapling';
  if (spentPercent <= 85) return 'healthy';
  if (spentPercent <= 100) return 'stressed';
  return 'burnt';
}
