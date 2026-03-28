import Calendar from '@/components/Calendar/Calendar'
import './home.css'

export default function Home() {
  return (
    <div className="page">
      <div className="header">
        <div className="live-badge"><span className="live-dot" />LIVE</div>
        <h1 className="logo">K4RAGA</h1>
        <div className="subtitle">STREAMER · GAMER · GRINDER</div>
        <div className="sep" />
      </div>

      <Calendar />

      <div className="footer">
        <a className="social-link" href="https://www.twitch.tv/k4ragatv" target="_blank" rel="noreferrer">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
          </svg>
        </a>
        <span className="footer-text">K4RAGA © 2026</span>
      </div>
    </div>
  )
}
