import type { Puzzle } from './types'

// Test puzzle: four groups of four matching numbers (1–4), shuffled
export const testPuzzle: Puzzle = {
  avgAttempts: 8,
  avgHints: 2,
  words: [
    { id: 'w01', text: '1' }, { id: 'w02', text: '1' }, { id: 'w03', text: '1' }, { id: 'w04', text: '1' },
    { id: 'w05', text: '2' }, { id: 'w06', text: '2' }, { id: 'w07', text: '2' }, { id: 'w08', text: '2' },
    { id: 'w09', text: '3' }, { id: 'w10', text: '3' }, { id: 'w11', text: '3' }, { id: 'w12', text: '3' },
    { id: 'w13', text: '4' }, { id: 'w14', text: '4' }, { id: 'w15', text: '4' }, { id: 'w16', text: '4' },
  ],
  groups: [
    { id: 'g1', label: 'Ykköset', color: '#16a34a', wordIds: ['w01', 'w02', 'w03', 'w04'] },
    { id: 'g2', label: 'Kakkoset', color: '#0d9488', wordIds: ['w05', 'w06', 'w07', 'w08'] },
    { id: 'g3', label: 'Kolmoset', color: '#65a30d', wordIds: ['w09', 'w10', 'w11', 'w12'] },
    { id: 'g4', label: 'Neloset', color: '#059669', wordIds: ['w13', 'w14', 'w15', 'w16'] },
  ],
}
