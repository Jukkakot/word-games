import { Link } from 'react-router-dom'
import styles from './Home.module.css'

interface GameEntry {
  id: string
  title: string
  description: string
  path: string
  available: boolean
}

const games: GameEntry[] = [
  {
    id: 'connections',
    title: 'Yhteydet',
    description: 'Löydä neljän ryhmää — mitkä sanat kuuluvat yhteen?',
    path: '/connections',
    available: true,
  },
]

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Sanapelit</h1>
        <p className={styles.subtitle}>Valitse peli</p>
      </header>
      <ul className={styles.gameList}>
        {games.map((game) => (
          <li key={game.id} className={styles.gameItem}>
            {game.available ? (
              <Link to={game.path} className={styles.gameCard}>
                <span className={styles.gameName}>{game.title}</span>
                <span className={styles.gameDesc}>{game.description}</span>
              </Link>
            ) : (
              <div className={`${styles.gameCard} ${styles.gameCardDisabled}`}>
                <span className={styles.gameName}>{game.title}</span>
                <span className={styles.gameDesc}>{game.description}</span>
                <span className={styles.comingSoon}>Tulossa</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
