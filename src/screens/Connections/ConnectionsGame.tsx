import { useState } from 'react'
import { Link } from 'react-router-dom'
import { testPuzzle } from './puzzleData'
import type { SolvedGroup } from './types'
import styles from './ConnectionsGame.module.css'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function victoryTitle(attempts: number, avg: number): string {
  if (attempts <= 4) return '🏆 Täydellinen!'
  if (attempts <= avg - 2) return '🥇 Mahtavaa!'
  if (attempts <= avg) return '🥈 Erinomaista!'
  return '🥉 Selvitit sen!'
}

function VictoryScreen({
  attempts,
  hintsUsed,
  solvedGroups,
  avgAttempts,
  avgHints,
  onRestart,
}: {
  attempts: number
  hintsUsed: number
  solvedGroups: SolvedGroup[]
  avgAttempts: number
  avgHints: number
  onRestart: () => void
}) {
  const [copied, setCopied] = useState(false)

  const shareText =
    `Löydä neljän ryhmiä!\n` +
    `Yritykset: ${attempts} (joista ${hintsUsed} vihjeitä)\n` +
    `Pelaajien keskiarvo: ${avgAttempts} (joista ${avgHints} vihjeitä)`

  const share = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const beatsAvg = attempts < avgAttempts

  return (
    <div className={styles.container}>
      <div className={styles.victory}>
        <h1 className={styles.victoryTitle}>{victoryTitle(attempts, avgAttempts)}</h1>
        <p className={styles.victoryAttempts}>
          Yritykset: <strong>{attempts}</strong>
          {hintsUsed > 0 && ` (joista ${hintsUsed} vihjeitä)`}
        </p>
        <p className={styles.victoryCompare}>
          {beatsAvg
            ? `Päihitit pelaajien keskiarvon joka oli ${avgAttempts}. Saatko huomenna ratkaistua neljällä yrityksellä?`
            : `Pelaajien keskiarvo oli ${avgAttempts} yritystä.`}
        </p>
        <button className={styles.btnShare} onClick={share}>
          {copied ? '✓ Kopioitu!' : '🔗 Jaa tulos'}
        </button>
        <div className={styles.victoryGroups}>
          {solvedGroups.map(g => (
            <div key={g.id} className={styles.solvedBanner} style={{ background: g.color }}>
              <span className={styles.solvedLabel}>{g.label}</span>
              <span className={styles.solvedWords}>{g.wordTexts.join(', ')}</span>
            </div>
          ))}
        </div>
        <div className={styles.victoryActions}>
          <button className={styles.btnSecondary} onClick={onRestart}>Pelaa uudelleen</button>
          <Link to="/" className={styles.btnSecondary}>Etusivulle</Link>
        </div>
      </div>
    </div>
  )
}

export default function ConnectionsGame() {
  const puzzle = testPuzzle

  const [grid, setGrid] = useState(() => shuffle(puzzle.words))
  const [selected, setSelected] = useState<string[]>([])
  const [solvedGroups, setSolvedGroups] = useState<SolvedGroup[]>([])
  const [attempts, setAttempts] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [shaking, setShaking] = useState(false)
  const [gameWon, setGameWon] = useState(false)

  const hintsLeft = 3 - hintsUsed
  const solvedIds = new Set(solvedGroups.flatMap(g => g.wordIds))
  const remaining = grid.filter(w => !solvedIds.has(w.id))

  const restart = () => {
    setGrid(shuffle(puzzle.words))
    setSelected([])
    setSolvedGroups([])
    setAttempts(0)
    setHintsUsed(0)
    setShaking(false)
    setGameWon(false)
  }

  const toggleWord = (id: string) => {
    if (shaking) return
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : prev.length < 4 ? [...prev, id] : prev
    )
  }

  const check = () => {
    if (selected.length !== 4 || shaking) return

    const match = puzzle.groups.find(g => selected.every(id => g.wordIds.includes(id)))
    setAttempts(a => a + 1)

    if (match) {
      const wordTexts = match.wordIds.map(id => puzzle.words.find(w => w.id === id)!.text)
      const updated = [...solvedGroups, { ...match, wordTexts }]
      setSolvedGroups(updated)
      setSelected([])
      if (updated.length === puzzle.groups.length) setGameWon(true)
    } else {
      setShaking(true)
      setTimeout(() => {
        setShaking(false)
        setSelected([])
      }, 550)
    }
  }

  const hint = () => {
    if (hintsLeft <= 0 || shaking) return
    const group = puzzle.groups.find(g => !solvedGroups.some(s => s.id === g.id))
    if (!group) return
    setSelected(group.wordIds)
    setHintsUsed(h => h + 1)
  }

  if (gameWon) {
    return (
      <VictoryScreen
        attempts={attempts}
        hintsUsed={hintsUsed}
        solvedGroups={solvedGroups}
        avgAttempts={puzzle.avgAttempts}
        avgHints={puzzle.avgHints}
        onRestart={restart}
      />
    )
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/" className={styles.backLink}>← Pelit</Link>
        <h1 className={styles.title}>Löydä neljän ryhmiä!</h1>
        <p className={styles.stats}>
          Pelaajien keskiarvo tänään on {puzzle.avgAttempts} yritystä, joista {puzzle.avgHints} oli vihjeitä.
        </p>
        <p className={styles.attemptsRow}>
          Yritykset: <span className={styles.attemptsNum}>{attempts}</span>
        </p>
      </header>

      <div className={styles.solved}>
        {solvedGroups.map(g => (
          <div key={g.id} className={styles.solvedBanner} style={{ background: g.color }}>
            <span className={styles.solvedLabel}>{g.label}</span>
            <span className={styles.solvedWords}>{g.wordTexts.join(', ')}</span>
          </div>
        ))}
      </div>

      <div className={styles.grid} style={{ gridTemplateRows: `repeat(${Math.ceil(remaining.length / 4)}, 1fr)` }}>
        {remaining.map(word => {
          const isSelected = selected.includes(word.id)
          return (
            <button
              key={word.id}
              className={[
                styles.tile,
                isSelected ? styles.tileSelected : '',
                isSelected && shaking ? styles.tileShake : '',
              ].join(' ')}
              onClick={() => toggleWord(word.id)}
            >
              {word.text}
            </button>
          )
        })}
      </div>

      <div className={styles.actions}>
        <button className={styles.btnHint} onClick={hint} disabled={hintsLeft <= 0 || shaking}>
          Vihje ({hintsLeft})
        </button>
        <button className={styles.btnClear} onClick={() => setSelected([])} disabled={selected.length === 0 || shaking}>
          Tyhjennä
        </button>
        <button className={styles.btnCheck} onClick={check} disabled={selected.length !== 4 || shaking}>
          Tarkista
        </button>
      </div>
    </div>
  )
}
