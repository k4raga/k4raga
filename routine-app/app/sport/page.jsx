'use client'
import Link from 'next/link'
import '../page.css'

export default function SportPage() {
  return (
    <div className="rt-page">
      <nav className="rt-topbar">
        <Link href="/" className="rt-topbar-logo">
          <img src="/logo.jpg" alt="K4RAGA" />
          K4RAGA
        </Link>
        <span className="rt-topbar-title">СПОРТ</span>
      </nav>

      <div className="rt-hero">
        <div className="rt-hero-tag">FITNESS</div>
        <h1 className="rt-hero-title">Спорт</h1>
        <p className="rt-hero-sub">Тренировки и физическая активность</p>
      </div>

      <div className="rt-empty">
        <p>Скоро здесь появится трекер тренировок</p>
      </div>
    </div>
  )
}
