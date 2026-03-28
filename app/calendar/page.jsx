import Calendar from '@/components/Calendar/Calendar'
import './home.css'

const CS_URL      = process.env.NEXT_PUBLIC_CS_URL      || 'https://cs.k4raga.ru'
const VOICE_URL   = process.env.NEXT_PUBLIC_VOICE_URL   || 'https://voice.k4raga.ru'
const ROUTINE_URL = process.env.NEXT_PUBLIC_ROUTINE_URL || 'https://routine.k4raga.ru'

const APPS = [
  {
    href: CS_URL,
    tag: 'COUNTER-STRIKE',
    title: 'CS',
    sub: 'Аим · Мувмент · Пистолеты · Снайпинг',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
        <rect x="3" y="10" width="20" height="12" rx="1"/>
        <path d="M23 14h4l2 2-2 2h-4"/>
        <line x1="9" y1="16" x2="13" y2="16"/>
      </svg>
    ),
  },
  {
    href: VOICE_URL,
    tag: 'VOICE',
    title: 'Голос',
    sub: 'Дыхание · Артикуляция · Резонанс',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
        <rect x="12" y="3" width="8" height="16" rx="1"/>
        <path d="M8 15v4a8 8 0 0016 0v-4"/>
        <line x1="16" y1="27" x2="16" y2="31"/>
        <line x1="11" y1="31" x2="21" y2="31"/>
      </svg>
    ),
  },
  {
    href: `${ROUTINE_URL}/kkal`,
    tag: 'NUTRITION',
    title: 'Ккал',
    sub: 'Подсчёт калорий и питание',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
        <path d="M8 4 C8 4 6 10 6 14 a10 10 0 0 0 20 0 C26 10 24 4 24 4"/>
        <line x1="16" y1="4" x2="16" y2="24"/>
      </svg>
    ),
  },
  {
    href: `${ROUTINE_URL}/sport`,
    tag: 'FITNESS',
    title: 'Спорт',
    sub: 'Тренировки и физическая активность',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
        <circle cx="16" cy="8" r="3"/>
        <line x1="16" y1="11" x2="16" y2="22"/>
        <line x1="8" y1="15" x2="24" y2="15"/>
        <line x1="16" y1="22" x2="10" y2="30"/>
        <line x1="16" y1="22" x2="22" y2="30"/>
      </svg>
    ),
  },
  {
    href: ROUTINE_URL,
    tag: 'DAILY',
    title: 'Рутина',
    sub: 'Ежедневные привычки и задачи',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
        <rect x="4" y="4" width="24" height="24" rx="2"/>
        <line x1="10" y1="12" x2="22" y2="12"/>
        <line x1="10" y1="16" x2="22" y2="16"/>
        <line x1="10" y1="20" x2="16" y2="20"/>
      </svg>
    ),
  },
]

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

      <div className="apps-grid">
        {APPS.map(app => (
          <a key={app.title} href={app.href} className="app-card">
            <div className="app-card-icon">{app.icon}</div>
            <div className="app-card-info">
              <div className="app-card-tag">{app.tag}</div>
              <div className="app-card-title">{app.title}</div>
              <div className="app-card-sub">{app.sub}</div>
            </div>
            <div className="app-card-arrow">→</div>
          </a>
        ))}
      </div>

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
