import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { generatePuzzle } from './puzzleData'
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

function HelpModal({ onClose }: { onClose: () => void }) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>Peliohjeet</h2>
        <p>Etsi neljän sanan ryhmät, joilla on jotain yhteistä.</p>
        <p>Valitse neljä sanaa ja paina <strong>Tarkista</strong> — yritä selvitä mahdollisimman vähillä arvauksilla!</p>
        <p>Voit käyttää korkeintaan 3 vihjettä pelin aikana. Vihje paljastaa kaksi sanaa yhdestä kategoriasta. Jokainen vihje lasketaan yhdeksi yritykseksi.</p>
        <div className={styles.modalExamples}>
          <p><strong>Esimerkkejä ryhmistä:</strong></p>
          <p><strong>ELÄIMET:</strong> kissa, hevonen, kilpikonna, norsu</p>
          <p><strong>LEHTI_:</strong> vihreä, kioski, mainos, taikina</p>
        </div>
        <p className={styles.modalWarning}>Jokaisella pelillä on vain yksi oikea ratkaisu. Varo sanoja, jotka voisivat kuulua useisiin kategorioihin!</p>
        <button className={styles.btnClose} onClick={onClose}>Sulje</button>
      </div>
    </div>
  )
}

function VictoryScreen({
  attempts,
  solvedGroups,
  avgAttempts,
  onRestart,
}: {
  attempts: number
  solvedGroups: SolvedGroup[]
  avgAttempts: number
  onRestart: () => void
}) {
  return (
    <div className={styles.container}>
      <div className={styles.victory}>
        <h1 className={styles.victoryTitle}>{victoryTitle(attempts, avgAttempts)}</h1>
        <p className={styles.attemptsRow}>Yrityksiä: <span className={styles.attemptsNum}>{attempts}</span></p>
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

function initGame() {
  const puzzle = generatePuzzle()
  return { puzzle, grid: shuffle(puzzle.words) }
}

export default function ConnectionsGame() {
  const [{ puzzle, grid }, setGame] = useState(initGame)
  const [selected, setSelected] = useState<string[]>([])
  const [solvedGroups, setSolvedGroups] = useState<SolvedGroup[]>([])
  const [hintedWords, setHintedWords] = useState<{ wordId: string; color: string }[]>([])
  const [attempts, setAttempts] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [shaking, setShaking] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [debugMode, setDebugMode] = useState(false)

  // D-näppäin toggleaa debug-tilan
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key === 'd' || e.key === 'D') && !e.ctrlKey && !e.metaKey) {
        setDebugMode(prev => !prev)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const hintsLeft = 3 - hintsUsed
  const solvedIds = new Set(solvedGroups.flatMap(g => g.wordIds))
  const remaining = grid.filter(w => !solvedIds.has(w.id))
  const hintMap = new Map(hintedWords.map(h => [h.wordId, h.color]))
  const debugMap = new Map(puzzle.groups.flatMap(g => g.wordIds.map(id => [id, g.color])))

  const restart = () => {
    setGame(initGame)
    setSelected([])
    setSolvedGroups([])
    setHintedWords([])
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
      setHintedWords(prev => prev.filter(h => !match.wordIds.includes(h.wordId)))
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
    const hintedGroupIds = new Set(hintedWords.map(h => {
      const g = puzzle.groups.find(g => g.wordIds.includes(h.wordId))
      return g?.id
    }))
    const unsolvedGroups = puzzle.groups.filter(g => !solvedGroups.some(s => s.id === g.id))
    const group = unsolvedGroups.find(g => !hintedGroupIds.has(g.id)) ?? unsolvedGroups[0]
    if (!group) return
    const hintedWordIds = new Set(hintedWords.map(h => h.wordId))
    const unhinted = group.wordIds.filter(id => !hintedWordIds.has(id))
    const pool = unhinted.length >= 2 ? unhinted : group.wordIds
    const revealed = shuffle(pool).slice(0, 2).map(wordId => ({ wordId, color: group.color }))
    setHintedWords(prev => [...prev, ...revealed])
    setHintsUsed(h => h + 1)
  }

  if (gameWon) {
    return (
      <VictoryScreen
        attempts={attempts}
        solvedGroups={solvedGroups}
        avgAttempts={puzzle.avgAttempts}
        onRestart={restart}
      />
    )
  }

  return (
    <div className={styles.container}>
      {helpOpen && <HelpModal onClose={() => setHelpOpen(false)} />}

      <header className={styles.header}>
        <div className={styles.headerRow}>
          <Link to="/" className={styles.btnBack}>← Pelit</Link>
          <button className={styles.btnHelp} onClick={() => setHelpOpen(true)}>?</button>
        </div>
        <h1 className={styles.title}>Löydä neljän ryhmiä!</h1>
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
          const hintColor = hintMap.get(word.id)
          const dbgColor = debugMode && !isSelected && !hintColor ? debugMap.get(word.id) : undefined
          const tileStyle = hintColor && !isSelected
            ? { background: hintColor, color: '#fff', borderColor: hintColor }
            : dbgColor
              ? { background: dbgColor + '28', borderColor: dbgColor, color: dbgColor }
              : undefined
          return (
            <button
              key={word.id}
              className={[
                styles.tile,
                isSelected ? styles.tileSelected : '',
                isSelected && shaking ? styles.tileShake : '',
                hintColor && !isSelected ? styles.tileHinted : '',
              ].join(' ')}
              style={tileStyle}
              onClick={() => toggleWord(word.id)}
            >
              {word.text}
            </button>
          )
        })}
      </div>

      {debugMode && (
        <div className={styles.debugBanner}>
          🐛 DEBUG — {puzzle.groups.map(g => `${g.label}: ${g.wordIds.map(id => puzzle.words.find(w => w.id === id)?.text).join(', ')}`).join(' | ')}
        </div>
      )}

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
