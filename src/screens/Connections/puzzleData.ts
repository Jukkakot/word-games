import rawData from '../../data/puzzleGroups.json'
import type { Puzzle } from './types'

const GROUP_COLORS = ['#e67e22', '#8e44ad', '#2980b9', '#27ae60']

const sessionUsedGroupIds = new Set<string>()

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function generatePuzzle(): Puzzle {
  // Reset session history if fewer than 4 unused groups remain
  const available = rawData.groups.filter(g => !sessionUsedGroupIds.has(g.id))
  if (available.length < 4) sessionUsedGroupIds.clear()

  const shuffled = shuffle([...rawData.groups.filter(g => !sessionUsedGroupIds.has(g.id))])
  const selected: typeof rawData.groups = []
  const usedWords = new Set<string>()

  for (const group of shuffled) {
    if (group.words.some(w => usedWords.has(w))) continue
    selected.push(group)
    group.words.forEach(w => usedWords.add(w))
    if (selected.length === 4) break
  }

  selected.forEach(g => sessionUsedGroupIds.add(g.id))

  const words = selected.flatMap(g =>
    g.words.map((text, wi) => ({ id: `${g.id}_w${wi}`, text }))
  )

  const groups = selected.map((g, gi) => ({
    id: g.id,
    label: g.connector,
    color: GROUP_COLORS[gi],
    wordIds: g.words.map((_, wi) => `${g.id}_w${wi}`),
  }))

  return { words, groups, avgAttempts: 8, avgHints: 2 }
}
