export interface Word {
  id: string
  text: string
}

export interface Group {
  id: string
  label: string
  color: string
  wordIds: string[]
}

export interface Puzzle {
  words: Word[]
  groups: Group[]
  avgAttempts: number
  avgHints: number
}

export interface SolvedGroup extends Group {
  wordTexts: string[]
}
