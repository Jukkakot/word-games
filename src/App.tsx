import { Routes, Route } from 'react-router-dom'
import Home from './screens/Home'
import ConnectionsGame from './screens/Connections/ConnectionsGame'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/connections" element={<ConnectionsGame />} />
    </Routes>
  )
}

export default App
