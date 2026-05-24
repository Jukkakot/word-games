import { Link } from 'react-router-dom'
import styles from './Home.module.css'

function ConnectionsThumb() {
  const tiles = [
    { word: 'JALKA', color: '#e67e22' },
    { word: 'KORI', color: '#8e44ad' },
    { word: 'OTSA', color: '#e67e22' },
    { word: 'LENTO', color: '#8e44ad' },
    { word: 'TASKU', color: '#e67e22' },
    { word: 'SULKA', color: '#8e44ad' },
    { word: 'KATTO', color: '#e67e22' },
    { word: 'SADE', color: '#2980b9' },
    { word: 'VILLA', color: '#2980b9' },
    { word: 'NAHKA', color: '#2980b9' },
    { word: 'KEVYT', color: '#27ae60' },
    { word: 'RASKAS', color: '#27ae60' },
    { word: 'LENTO', color: '#2980b9' },
    { word: 'YLI', color: '#27ae60' },
    { word: 'ALI', color: '#27ae60' },
    { word: 'JOULU', color: '#c0392b' },
  ]
  return (
    <div className={styles.thumbGrid}>
      {tiles.map((t, i) => (
        <div key={i} className={styles.thumbTile} style={{ background: t.color }}>
          {t.word}
        </div>
      ))}
    </div>
  )
}

interface GameEntry {
  id: string
  title: string
  description: string
  path: string
  available: boolean
  thumb: React.ReactNode
}

const games: GameEntry[] = [
  {
    id: 'connections',
    title: 'Yhteydet',
    description: 'Löydä neljän ryhmät',
    path: '/connections',
    available: true,
    thumb: <ConnectionsThumb />,
  },
]

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Sanapelit</h1>
      </header>
      <div className={styles.grid}>
        {games.map((game) => (
          <div key={game.id} className={styles.cardWrapper}>
            {game.available ? (
              <Link to={game.path} className={styles.card}>
                <div className={styles.cardThumb}>{game.thumb}</div>
                <div className={styles.cardInfo}>
                  <span className={styles.cardTitle}>{game.title}</span>
                  <span className={styles.cardDesc}>{game.description}</span>
                </div>
              </Link>
            ) : (
              <div className={`${styles.card} ${styles.cardDisabled}`}>
                <div className={styles.cardThumb}>
                  {game.thumb}
                  <div className={styles.comingSoonOverlay}>Tulossa</div>
                </div>
                <div className={styles.cardInfo}>
                  <span className={styles.cardTitle}>{game.title}</span>
                  <span className={styles.cardDesc}>{game.description}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
