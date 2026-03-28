'use client'
import Link from 'next/link'
import './page.css'

const HUB_URL = process.env.NEXT_PUBLIC_HUB_URL || 'https://calendar.k4raga.ru'

const SECTIONS = [
  {
    href: '/kkal',
    label: '01',
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
    href: '/sport',
    label: '02',
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
    href: '/',
    label: '03',
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

export default function RoutinePage() {
  return (
    <div className="rt-page">
      <nav className="rt-topbar">
        <a href={HUB_URL} className="rt-topbar-logo">
          <img src="/logo.jpg" alt="K4RAGA" />
          K4RAGA
        </a>
        <span className="rt-topbar-title">РУТИНА</span>
      </nav>

      <div className="rt-hero">
        <div className="rt-hero-tag">DAILY ROUTINE</div>
        <h1 className="rt-hero-title">Рутина</h1>
        <p className="rt-hero-sub">Ккал · Спорт · Привычки</p>
      </div>

      <div className="rt-sections">
        {SECTIONS.map(s => (
          <Link key={s.href + s.title} href={s.href} className="rt-section-card">
            <div className="rt-section-num">{s.label}</div>
            <div className="rt-section-icon">{s.icon}</div>
            <div className="rt-section-info">
              <div className="rt-section-title">{s.title}</div>
              <div className="rt-section-sub">{s.sub}</div>
            </div>
            <div className="rt-section-arrow">→</div>
          </Link>
        ))}
      </div>

      <div className="rt-footer">K4RAGA © 2026</div>
    </div>
  )
}
