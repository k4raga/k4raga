import { Link } from 'react-router-dom'
import Calendar from '../components/Calendar/Calendar'
import './Home.css'

export default function Home() {
  return (
    <div className="page">
      <div className="header">
        <div className="live-badge">
          <span className="live-dot" />
          LIVE
        </div>
        <h1 className="logo">
          K4RAGA
        </h1>
        <div className="subtitle">STREAMER · GAMER · GRINDER</div>
        <div className="sep" />
      </div>

      <div className="cards">
        <Link className="card" to="/cs-training">
          <div className="card-icon">
            <svg viewBox="0 0 32 32" fill="none" stroke="#D40000" strokeWidth="2" strokeLinecap="square">
              <rect x="3" y="10" width="20" height="12" rx="1"/>
              <path d="M23 14h4l2 2-2 2h-4"/>
              <line x1="9" y1="16" x2="13" y2="16"/>
            </svg>
          </div>
          <div className="card-title">CS Тренировка</div>
          <div className="card-desc">Чеклист навыков: прицел, стрейф, дигл, снайпер — всё перед каткой</div>
          <div className="card-arrow">Открыть <span>→</span></div>
        </Link>

        <Link className="card" to="/voice-training">
          <div className="card-icon">
            <svg viewBox="0 0 32 32" fill="none" stroke="#D40000" strokeWidth="2" strokeLinecap="square">
              <rect x="12" y="3" width="8" height="16" rx="1"/>
              <path d="M8 15v4a8 8 0 0016 0v-4"/>
              <line x1="16" y1="27" x2="16" y2="31"/>
              <line x1="11" y1="31" x2="21" y2="31"/>
            </svg>
          </div>
          <div className="card-title">Голос</div>
          <div className="card-desc">Дыхание, артикуляция, резонанс, интонация — прокачка голоса для стрима</div>
          <div className="card-arrow">Открыть <span>→</span></div>
        </Link>
      </div>

      <Calendar />

      <div className="footer">
        <a className="social-link" href="https://www.twitch.tv/k4ragatv" target="_blank" rel="noreferrer" title="Twitch">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
          </svg>
        </a>
        <span className="footer-text">K4RAGA © 2026</span>
      </div>
    </div>
  )
}
