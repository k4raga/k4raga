'use client'
import Link from 'next/link'
import '../page.css'

export default function KkalPage() {
  return (
    <div className="rt-page">
      <nav className="rt-topbar">
        <Link href="/" className="rt-topbar-logo">
          <img src="/logo.jpg" alt="K4RAGA" />
          K4RAGA
        </Link>
        <span className="rt-topbar-title">ККАЛ</span>
      </nav>

      <div className="rt-hero">
        <div className="rt-hero-tag">NUTRITION</div>
        <h1 className="rt-hero-title">Ккал</h1>
        <p className="rt-hero-sub">Подсчёт калорий и питание</p>
      </div>

      <div className="rt-empty">
        <p>Скоро здесь появится трекер калорий</p>
      </div>
    </div>
  )
}
