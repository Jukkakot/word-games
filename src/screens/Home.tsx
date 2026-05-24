import { Link } from 'react-router-dom'
import styles from './Home.module.css'

function ConnectionsThumb() {
  const colors = ['#16a34a', '#0d9488', '#65a30d', '#059669']
  const layout = [2, 0, 3, 1, 0, 3, 1, 2, 3, 1, 2, 0, 1, 2, 0, 3]
  return (
    <div className={styles.thumbGrid}>
      {layout.map((groupIdx, i) => (
        <div key={i} className={styles.thumbTile} style={{ background: colors[groupIdx] }} />
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
