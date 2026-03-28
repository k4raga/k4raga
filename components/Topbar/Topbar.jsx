'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import logo from '@/lib/logo.js'
import './Topbar.css'

const CS_URL    = process.env.NEXT_PUBLIC_CS_URL    || 'http://cs.k4raga.ru'
const VOICE_URL = process.env.NEXT_PUBLIC_VOICE_URL || 'http://voice.k4raga.ru'

export default function Topbar() {
  const path = usePathname()

  return (
    <nav className="topbar">
      <Link href="/" className="topbar-left">
        <img className="topbar-logo" src={logo} alt="K4RAGA" />
        <span className="topbar-name">K4RAGA</span>
      </Link>
      <div className="topbar-nav">
        <Link href="/" className={'topbar-link' + (path === '/' ? ' active' : '')}>Hub</Link>
        <a href={CS_URL} className="topbar-link">CS</a>
        <a href={VOICE_URL} className="topbar-link">Голос</a>
      </div>
    </nav>
  )
}
