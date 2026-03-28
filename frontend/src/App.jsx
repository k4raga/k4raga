import { Routes, Route } from 'react-router-dom'
import Background from './components/Background/Background'
import Topbar from './components/Topbar/Topbar'
import Home from './pages/Home'
import CSTraining from './pages/CSTraining'
import VoiceTraining from './pages/VoiceTraining'

export default function App() {
  return (
    <>
      <Background />
      <Topbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cs-training" element={<CSTraining />} />
        <Route path="/voice-training" element={<VoiceTraining />} />
      </Routes>
    </>
  )
}
